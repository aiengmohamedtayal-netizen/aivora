import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const systemPrompt = `You are the "Aivora AI Assistant" (مساعد إيفورا الذكي), an advanced and helpful AI assistant for the Aivora digital business platform.
Your goal is to help users understand our products, manage their business processes, and get support.
You can communicate fluently in both Arabic and English. If the user speaks Arabic, reply in Arabic. If they speak English, reply in English.
Keep your answers professional, concise, and helpful. Format your responses using markdown.`;

// ─── Gemini Streaming ────────────────────────────────────────────────
async function streamFromGemini(
  apiKey: string,
  messages: { role: string; content: string }[]
): Promise<ReadableStream | null> {
  // Build Gemini format
  const systemContent = messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const contents = conversationMessages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemContent }] },
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini ${response.status}: ${errText.substring(0, 200)}`);
  }

  return response.body;
}

// ─── OpenAI Streaming ────────────────────────────────────────────────
async function streamFromOpenAI(
  apiKey: string,
  baseUrl: string,
  messages: { role: string; content: string }[]
): Promise<ReadableStream | null> {
  const response = await fetch(`${baseUrl}/chat/completions`, {
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

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI ${response.status}: ${errText.substring(0, 200)}`);
  }

  return response.body;
}

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
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiBaseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: 'Missing Supabase env vars' }, { status: 500 });
  }

  if (!geminiKey && !openaiKey) {
    return Response.json({ error: 'No LLM API key configured (need GEMINI_API_KEY or OPENAI_API_KEY)' }, { status: 500 });
  }

  // Step 3: Supabase setup
  const supabase = createClient(supabaseUrl, supabaseKey);
  let currentSessionId = session_id;
  let history: any[] = [];

  try {
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      await supabase.from('chat_sessions').insert({
        id: currentSessionId,
        title: query.substring(0, 50) + '...',
        model: geminiKey ? 'gemini-2.0-flash' : 'gpt-4o-mini',
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
          model: geminiKey ? 'gemini-2.0-flash' : 'gpt-4o-mini',
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
  } catch (e) {
    // Non-critical, continue
  }

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: query }
  ];

  // Step 4: Get LLM stream with cascading fallback (Gemini → OpenAI)
  let rawStream: ReadableStream | null = null;
  let provider: 'gemini' | 'openai' = 'gemini';

  if (geminiKey) {
    try {
      rawStream = await streamFromGemini(geminiKey, messages);
      provider = 'gemini';
    } catch (geminiErr) {
      console.error('Gemini failed:', geminiErr);
      if (openaiKey) {
        try {
          rawStream = await streamFromOpenAI(openaiKey, openaiBaseUrl, messages);
          provider = 'openai';
        } catch (openaiErr) {
          return Response.json({
            error: 'Both Gemini and OpenAI failed',
            gemini: String(geminiErr),
            openai: String(openaiErr),
          }, { status: 502 });
        }
      } else {
        return Response.json({ error: 'Gemini failed, no OpenAI fallback', detail: String(geminiErr) }, { status: 502 });
      }
    }
  } else if (openaiKey) {
    try {
      rawStream = await streamFromOpenAI(openaiKey, openaiBaseUrl, messages);
      provider = 'openai';
    } catch (openaiErr) {
      return Response.json({ error: 'OpenAI failed', detail: String(openaiErr) }, { status: 502 });
    }
  }

  if (!rawStream) {
    return Response.json({ error: 'No stream obtained from LLM' }, { status: 502 });
  }

  // Step 5: Transform raw SSE into our format that useChatStream.ts expects
  const finalSessionId = currentSessionId;
  let fullResponse = '';

  const transformedStream = new ReadableStream({
    async start(controller) {
      const reader = rawStream!.getReader();
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
              let text = '';

              if (provider === 'gemini') {
                // Gemini SSE: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
                text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              } else {
                // OpenAI SSE: {"choices":[{"delta":{"content":"..."}}]}
                text = parsed?.choices?.[0]?.delta?.content || '';
              }

              if (text) {
                fullResponse += text;
                const safeChunk = text.replace(/\n/g, '\\n');
                controller.enqueue(new TextEncoder().encode(`data: ${safeChunk}\n\n`));
              }
            } catch {
              // Skip unparseable chunks
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
