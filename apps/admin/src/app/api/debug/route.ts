import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    status: 'nextjs_api_alive',
    url: request.url,
  });
}
