import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export const runtime = 'edge';

const systemPrompt = `You are the "Aivora AI Assistant" (مساعد إيفورا الذكي), an advanced and helpful AI assistant for the Aivora digital business platform.
Your goal is to help users understand our products, manage their business processes, and get support.
You can communicate fluently in both Arabic and English. If the user speaks Arabic, reply in Arabic. If they speak English, reply in English.
Keep your answers professional, concise, and helpful. Format your responses using markdown.`;

export async function POST(req: Request) {
  try {
    const { query, session_id } = await req.json();

    if (!query) {
      return new Response('Missing query', { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let currentSessionId = session_id;
    let history: any[] = [];

    // Fetch or create session
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      await supabase.from('chat_sessions').insert({
        id: currentSessionId,
        title: query.substring(0, 50) + '...',
        model: 'gpt-4o',
        user_agent: 'Aivora Assistant',
      });
    } else {
      const { data: messagesData } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('created_at');

      if (messagesData && messagesData.length > 0) {
        history = messagesData;
      } else {
        await supabase.from('chat_sessions').insert({
          id: currentSessionId,
          title: query.substring(0, 50) + '...',
          model: 'gpt-4o',
          user_agent: 'Aivora Assistant',
        });
      }
    }

    // Insert new user message
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: query,
    });

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: query }
    ];

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Use standard OpenAI streaming
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as any,
      stream: true,
    });

    let fullResponse = '';

    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              // Escape newlines like the Python backend did
              const safeChunk = content.replace(/\n/g, "\\n");
              controller.enqueue(new TextEncoder().encode(`data: ${safeChunk}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
          controller.close();

          // Save assistant reply in background
          supabase.from('chat_messages').insert({
            session_id: currentSessionId,
            role: 'assistant',
            content: fullResponse,
            token_usage: Math.floor(fullResponse.length / 4),
          }).then(() => {
            supabase.from('chat_sessions').update({
              last_activity: new Date().toISOString(),
            }).eq('id', currentSessionId).then();
          });

        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
