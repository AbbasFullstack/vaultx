import { NextRequest, NextResponse } from 'next/server';

const RPC_LIST = [
  'https://polygon-amoy-rpc.publicnode.com',
  'https://rpc-amoy.polygon.technology',
  'https://polygon-amoy.g.alchemy.com/public',
];

export async function POST(req: NextRequest) {
  const body = await req.text();

  for (const url of RPC_LIST) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      if (!res.ok) continue;
      const text = await res.text();
      return new NextResponse(text, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {}
  }

  return NextResponse.json({
    jsonrpc: '2.0',
    error: { code: -32000, message: 'All RPCs failed' },
    id: 1,
  });
}
