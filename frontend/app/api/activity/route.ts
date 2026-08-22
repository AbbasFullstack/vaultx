import { NextRequest, NextResponse } from 'next/server';

const CHAIN_IDS: Record<string, string> = {
  amoy: '80002',
  sepolia: '11155111',
  base: '84532',
};

export async function GET(req: NextRequest) {
  const net = req.nextUrl.searchParams.get('net') || 'amoy';
  const address = req.nextUrl.searchParams.get('address') || '';
  if (!address) return NextResponse.json({ items: [] });

  const apiKey = process.env.ETHERSCAN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ items: [], error: 'Activity service is not configured.' }, { status: 503 });
  }

  try {
    const chainId = CHAIN_IDS[net] || CHAIN_IDS.amoy;
    const search = new URLSearchParams({
      chainid: chainId,
      module: 'account',
      action: 'txlist',
      address,
      page: '1',
      offset: '10',
      sort: 'desc',
      apikey: apiKey,
    });
    const url = `https://api.etherscan.io/v2/api?${search.toString()}`;
    const res = await fetch(url);
    const json = await res.json();
    if (Array.isArray(json.result)) {
      const items = json.result.map((transaction: Record<string, unknown>) => ({
        hash: String(transaction.hash ?? ''),
        from: { hash: String(transaction.from ?? '') },
        to: { hash: String(transaction.to ?? '') },
        value: String(transaction.value ?? '0'),
        timestamp: new Date(Number(transaction.timeStamp ?? 0) * 1000).toISOString(),
      }));
      return NextResponse.json({ items });
    }
  } catch {}

  return NextResponse.json({ items: [] });
}
