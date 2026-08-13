import { NextRequest, NextResponse } from 'next/server';

const RPC_URL = 'https://polygon-amoy.infura.io/v3/8ab9ddf3d3de4c6bb3f89844d57d5335';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const res = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    
    if (!res.ok) {
      return NextResponse.json({
        jsonrpc: '2.0',
        error: { code: -32000, message: `Infura error: ${res.status}` },
        id: 1,
      });
    }
    
    const text = await res.text();
    return new NextResponse(text, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: e.message || 'Unknown error' },
      id: 1,
    });
  }
}
