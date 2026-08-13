import { NextRequest, NextResponse } from 'next/server';

const KEY = '8ab9ddf3d3de4c6bb3f89844d57d5335';

const RPCS: Record<string, string> = {
  amoy: `https://polygon-amoy.infura.io/v3/${KEY}`,
  sepolia: `https://sepolia.infura.io/v3/${KEY}`,
  base: `https://base-sepolia.infura.io/v3/${KEY}`,
};

export async function POST(req: NextRequest) {
  const net = req.nextUrl.searchParams.get('net') || 'amoy';
  const url = RPCS[net] || RPCS.amoy;
  try {
    const body = await req.text();
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const text = await res.text();
    return new NextResponse(text, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: e.message || 'RPC error' },
      id: 1,
    });
  }
}
