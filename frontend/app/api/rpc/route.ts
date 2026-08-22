import { NextRequest, NextResponse } from 'next/server';

function getRpcUrls(projectId: string): Record<string, string> {
  return {
    amoy: `https://polygon-amoy.infura.io/v3/${projectId}`,
    sepolia: `https://sepolia.infura.io/v3/${projectId}`,
    base: `https://base-sepolia.infura.io/v3/${projectId}`,
  };
}

export async function POST(req: NextRequest) {
  const net = req.nextUrl.searchParams.get('net') || 'amoy';
  const projectId = process.env.INFURA_PROJECT_ID;
  if (!projectId) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'RPC service is not configured.' },
      id: 1,
    }, { status: 503 });
  }

  const rpcs = getRpcUrls(projectId);
  const url = rpcs[net] || rpcs.amoy;
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'RPC error';
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32000, message },
      id: 1,
    });
  }
}
