import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const systemPrompt = `You are the "Aivora AI Assistant" (مساعد إيفورا الذكي), an advanced and helpful AI assistant for the Aivora digital business platform.
Your goal is to help users understand our products, manage their business processes, and get support.
You can communicate fluently in both Arabic and English. If the user speaks Arabic, reply in Arabic. If they speak English, reply in English.
Keep your answers professional, concise, and helpful. Format your responses using markdown.`;

export async function POST(req: Request) {
  // Step 1: Parse request
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

  // Step 2: Check env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL;

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Missing Supabase env vars' }, { status: 500 });
  }

  if (!apiKey) {
    return Response.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }

  if (!baseUrl) {
    return Response.json({ error: 'Missing OPENAI_BASE_URL' }, { status: 500 });
  }

  // Step 3: Supabase
  const supabase = createClient(supabaseUrl, supabaseKey);
  let currentSessionId = session_id;
  let history: any[] = [];

  try {
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      await supabase.from('chat_sessions').insert({
        id: currentSessionId,
        title: query.substring(0, 50) + '...',
        model: 'gpt-4o-mini',
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
          model: 'gpt-4o-mini',
          user_agent: 'Aivora Assistant',
        });
      }
    }
  } catch (e) {
    return Response.json({ error: 'Supabase session error', detail: String(e) }, { status: 500 });
  }

  // Save user message
  try {
    await supabase.from('chat_messages').insert({
      session_id: currentSessionId,
      role: 'user',
      content: query,
    });
  } catch {
    // Non-critical
  }

  // Step 4: Build messages
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: query }
  ];

  // Step 5: Call Dahl (OpenAI-compatible) using OPENAI_BASE_URL
  let llmResponse: Response;
  try {
    llmResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        stream: true,
      }),
    });

    if (!llmResponse.ok) {
      const errText = await llmResponse.text();
      return Response.json({
        error: 'LLM API call failed',
        target: baseUrl,
        status_code: llmResponse.status,
        detail: errText.substring(0, 500),
      }, { status: 502 });
    }
  } catch (e: any) {
    return Response.json({
      error: 'LLM network error',
      target: baseUrl,
      detail: e?.message || String(e),
    }, { status: 502 });
  }

  if (!llmResponse.body) {
    return Response.json({ error: 'No stream body from LLM' }, { status: 502 });
  }

  // Step 6: Transform SSE → useChatStream.ts format
  const rawStream = llmResponse.body;
  const finalSessionId = currentSessionId;
  let fullResponse = '';

  const transformedStream = new ReadableStream({
    async start(controller) {
      const reader = rawStream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const text = parsed?.choices?.[0]?.delta?.content || '';
              if (text) {
                fullResponse += text;
                const safeChunk = text.replace(/\n/g, '\\n');
                controller.enqueue(new TextEncoder().encode(`data: ${safeChunk}\n\n`));
              }
            } catch {
              // Skip unparseable
            }
          }
        }

        controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        controller.close();

        // Save assistant response (fire and forget)
        if (fullResponse) {
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
        }
      } catch (err) {
        console.error('Stream transform error:', err);
        controller.error(err);
      }
    }
  });

  return new Response(transformedStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
