import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

// We need an async function for Route Handlers with dynamic params in Next.js 15
export async function GET(
  request: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  try {
    const { session_id } = await params;
    
    if (!session_id) {
      return NextResponse.json({ messages: [] });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('session_id', session_id)
      .order('created_at');

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ messages: [] });
    }

    const messages = data.map((row) => ({
      role: row.role,
      text: row.content,
      timestamp: row.created_at,
    }));

    return NextResponse.json({ messages });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ messages: [] }, { status: 500 });
  }
}
