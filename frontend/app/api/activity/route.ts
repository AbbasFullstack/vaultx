import { NextRequest, NextResponse } from 'next/server';

const API_KEY = 'G7ATPPN7P8UN14GRCXR143JQPAY7E5VVSM';

export async function GET(req: NextRequest) {
  const net = req.nextUrl.searchParams.get('net') || 'amoy';
  const address = req.nextUrl.searchParams.get('address') || '';
  if (!address) return NextResponse.json({ items: [] });

  try {
    const url = `https://api.etherscan.io/v2/api?chainid=80002&module=account&action=txlist&address=${address}&page=1&offset=10&sort=desc&apikey=${API_KEY}`;
    const res = await fetch(url);
    const json = await res.json();
    if (Array.isArray(json.result)) {
      const items = json.result.map((t: any) => ({
        hash: t.hash,
        from: { hash: t.from },
        to: { hash: t.to },
        value: t.value,
        timestamp: new Date(parseInt(t.timeStamp) * 1000).toISOString(),
      }));
      return NextResponse.json({ items });
    }
  } catch {}

  return NextResponse.json({ items: [] });
}
