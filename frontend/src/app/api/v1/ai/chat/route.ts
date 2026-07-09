import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export const runtime = 'edge';

const systemPrompt = `You are the "Aivora AI Assistant" (مساعد إيفورا الذكي), an advanced and helpful AI assistant for the Aivora digital business platform.
Your goal is to help users understand our products, manage their business processes, and get support.
You can communicate fluently in both Arabic and English. If the user speaks Arabic, reply in Arabic. If they speak English, reply in English.
Keep your answers professional, concise, and helpful. Format your responses using markdown.`;

export async function POST(req: Request) {
  // Step 1: Parse request body
  let query: string;
  let session_id: string | undefined;
  try {
    const body = await req.json();
    query = body.query;
    session_id = body.session_id;
  } catch (e) {
    return Response.json({ error: 'Invalid JSON body', detail: String(e) }, { status: 400 });
  }

  if (!query) {
    return Response.json({ error: 'Missing query' }, { status: 400 });
  }

  // Step 2: Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({
      error: 'Missing Supabase environment variables',
      has_url: !!supabaseUrl,
      has_key: !!supabaseKey,
    }, { status: 500 });
  }

  if (!openaiKey) {
    return Response.json({
      error: 'Missing OPENAI_API_KEY environment variable',
    }, { status: 500 });
  }

  // Step 3: Connect to Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);

  let currentSessionId = session_id;
  let history: any[] = [];

  try {
    // Fetch or create session
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      const { error: sessErr } = await supabase.from('chat_sessions').insert({
        id: currentSessionId,
        title: query.substring(0, 50) + '...',
        model: 'gpt-4o',
        user_agent: 'Aivora Assistant',
      });
      if (sessErr) {
        return Response.json({ error: 'Supabase session insert failed', detail: sessErr }, { status: 500 });
      }
    } else {
      const { data: messagesData, error: histErr } = await supabase
        .from('chat_messages')
        .select('role, content')
        .eq('session_id', currentSessionId)
        .order('created_at');

      if (histErr) {
        return Response.json({ error: 'Supabase history fetch failed', detail: histErr }, { status: 500 });
      }

      if (messagesData && messagesData.length > 0) {
        history = messagesData;
      } else {
        // Session doesn't exist yet, create it
        await supabase.from('chat_sessions').insert({
          id: currentSessionId,
          title: query.substring(0, 50) + '...',
          model: 'gpt-4o',
          user_agent: 'Aivora Assistant',
        });
      }
    }
  } catch (e) {
    return Response.json({ error: 'Supabase connection error', detail: String(e) }, { status: 500 });
  }

  // Step 4: Save user message
  try {
    const { error: msgErr } = await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: query,
    });
    if (msgErr) {
      return Response.json({ error: 'Supabase user message insert failed', detail: msgErr }, { status: 500 });
    }
  } catch (e) {
    return Response.json({ error: 'Supabase message save error', detail: String(e) }, { status: 500 });
  }

  // Step 5: Build messages array
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user' as const, content: query }
  ];

  // Step 6: Call OpenAI
  let stream;
  try {
    const openai = new OpenAI({ apiKey: openaiKey });
    stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      stream: true,
    });
  } catch (e: any) {
    return Response.json({
      error: 'OpenAI API call failed',
      detail: e?.message || String(e),
      status_code: e?.status,
    }, { status: 502 });
  }

  // Step 7: Stream response
  let fullResponse = '';
  const finalSessionId = currentSessionId;

  const customStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            const safeChunk = content.replace(/\n/g, "\\n");
            controller.enqueue(new TextEncoder().encode(`data: ${safeChunk}\n\n`));
          }
        }
        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();

        // Save assistant reply (fire and forget)
        supabase.from('chat_messages').insert({
          session_id: finalSessionId,
          role: 'assistant',
          content: fullResponse,
          token_usage: Math.floor(fullResponse.length / 4),
        }).then(() => {
          supabase.from('chat_sessions').update({
            last_activity: new Date().toISOString(),
          }).eq('id', finalSessionId).then();
        });
      } catch (err) {
        console.error('Stream error:', err);
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
}
