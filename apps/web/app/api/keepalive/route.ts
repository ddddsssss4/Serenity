import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://serenity-593k.onrender.com/health', {
      method: 'GET',
      cache: 'no-store',
    });
    return NextResponse.json({ 
      status: 'ok', 
      backend: res.ok ? 'alive' : 'down',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ 
      status: 'error', 
      backend: 'unreachable',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
