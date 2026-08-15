'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, JsonRpcProvider, parseEther, formatEther, isAddress } from 'ethers';
import { KeyRound, Copy, Check, ExternalLink, Send, LogOut, Droplets, Activity, History, ArrowUpRight, ArrowDownLeft, Eye, EyeOff } from 'lucide-react';

const NETWORKS = [
  { id: 'amoy', short: 'AMOY', name: 'Polygon Amoy', symbol: 'POL', binance: 'POLUSDT', explorer: 'https://amoy.polygonscan.com', faucet: 'https://faucet.polygon.technology' },
  { id: 'sepolia', short: 'SEPOLIA', name: 'Ethereum Sepolia', symbol: 'ETH', binance: 'ETHUSDT', explorer: 'https://sepolia.etherscan.io', faucet: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia' },
  { id: 'base', short: 'BASE', name: 'Base Sepolia', symbol: 'ETH', binance: 'ETHUSDT', explorer: 'https://sepolia.basescan.org', faucet: 'https://www.coinbase.com/faucets/base-sepolia-faucet' },
];

async function rpcCall(netId: string, method: string, params: any[]): Promise<any> {
  const res = await fetch(window.location.origin + `/api/rpc?net=${netId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  if (!res.ok) throw new Error('RPC HTTP error');
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

export default function Dashboard() {
  const router = useRouter();
  const [netIndex, setNetIndex] = useState(0);
  const network = NETWORKS[netIndex];

  const [address, setAddress] = useState('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [price, setPrice] = useState(0);
  const [activity, setActivity] = useState<any[]>([]);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const loadActivity = async (netId: string, addr: string) => {
    const chainIds: Record<string, string> = { amoy: '80002', sepolia: '11155111', base: '84532' };
    const blockscout: Record<string, string> = {
      amoy: 'https://polygon-amoy.blockscout.com',
      sepolia: 'https://eth-sepolia.blockscout.com',
      base: 'https://base-sepolia.blockscout.com',
    };
    // 1) Routescan (browser se)
    try {
      const r = await fetch(`https://api.routescan.io/v2/network/testnet/evm/${chainIds[netId]}/etherscan?module=account&action=txlist&address=${addr}&page=1&offset=10&sort=desc`);
      const j = await r.json();
      if (Array.isArray(j.result) && j.result.length > 0) {
        setActivity(j.result.map((t: any) => ({
          hash: t.hash,
          from: { hash: t.from },
          to: { hash: t.to },
          value: t.value,
          timestamp: new Date(parseInt(t.timeStamp) * 1000).toISOString(),
        })));
        return;
      }
    } catch {}
    // 2) Blockscout (browser se)
    try {
      const r = await fetch(`${blockscout[netId]}/api/v2/addresses/${addr}/transactions?limit=10`);
      const j = await r.json();
      if (Array.isArray(j.items) && j.items.length > 0) {
        setActivity(j.items.slice(0, 8));
        return;
      }
    } catch {}
    // 3) Server proxy fallback
    try {
      const r = await fetch(`/api/activity?net=${netId}&address=${addr}`);
      const j = await r.json();
      setActivity((j.items || []).slice(0, 8));
    } catch {
      setActivity([]);
    }
  };

  useEffect(() => {
    const pk = sessionStorage.getItem('vaultx_pk');
    if (!pk) {
      router.push('/');
      return;
    }
    const provider = new JsonRpcProvider(window.location.origin + `/api/rpc?net=${network.id}`);
    const w = new Wallet(pk, provider);
    setWallet(w);
    setAddress(w.address);
    setPrivateKey(pk);
    setBalance(null);
    setTxHash('');
    setError('');
    (async () => {
      try {
        const hex = await rpcCall(network.id, 'eth_getBalance', [w.address, 'latest']);
        setBalance(formatEther(BigInt(hex)));
      } catch {
        setBalance('0');
      }
    })();
    loadActivity(network.id, w.address);
  }, [netIndex, router]);

  useEffect(() => {
    fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${network.binance}`)
      .then(r => r.json())
      .then(d => setPrice(parseFloat(d.price)))
      .catch(() => {});
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${network.binance.toLowerCase()}@miniTicker`);
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        setPrice(parseFloat(d.c));
      } catch {}
    };
    return () => ws.close();
  }, [netIndex]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(privateKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logout = () => {
    sessionStorage.removeItem('vaultx_pk');
    router.push('/');
  };

  const sendTx = async () => {
    setError('');
    setTxHash('');
    if (!isAddress(to)) {
      setError('Sahi recipient address daalein (0x se shuru)');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError('Sahi amount daalein');
      return;
    }
    setSending(true);
    try {
      const tx = await wallet!.sendTransaction({ to, value: parseEther(amount) });
      setTxHash(tx.hash);
      setTo('');
      setAmount('');
      setTimeout(async () => {
        try {
          const hex = await rpcCall(network.id, 'eth_getBalance', [address, 'latest']);
          setBalance(formatEther(BigInt(hex)));
        } catch {}
        loadActivity(network.id, address);
      }, 6000);
    } catch (e: any) {
      setError(e.shortMessage || e.message || 'Transaction fail ho gayi');
    }
    setSending(false);
  };

  const usdValue = balance ? parseFloat(balance) * price : 0;

  const shortAddr = (a: string) => (a ? `${a.slice(0, 6)}...${a.slice(-4)}` : 'Contract');

  const timeAgo = (ts: string) => {
    const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (m < 1) return 'abhi abhi';
    if (m < 60) return `${m} min pehle`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} ghante pehle`;
    return `${Math.floor(h / 24)} din pehle`;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-500/[0.07] blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[400px] bg-emerald-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/30 backdrop-blur-2xl">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">VaultX</span>
          </div>
          <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/70 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Network Switcher */}
        <div className="flex gap-2">
          {NETWORKS.map((n, i) => (
            <button
              key={n.id}
              onClick={() => setNetIndex(i)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${
                i === netIndex
                  ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
              }`}
            >
              {n.short}
            </button>
          ))}
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">{network.name}</span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              LIVE {network.symbol}: ${price.toLocaleString()}
            </span>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-4xl font-bold font-mono">
              {balance === null ? '...' : parseFloat(balance).toFixed(4)}
            </p>
            <span className="text-white/50 font-semibold mb-1">{network.symbol}</span>
          </div>
          <p className="text-sm text-white/40 font-mono mb-5">≈ ${usdValue.toFixed(4)} USD</p>

          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl p-3">
            <span className="font-mono text-xs text-white/60 break-all flex-1">{address}</span>
            <button onClick={copyAddress} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            </button>
            <a href={`${network.explorer}/address/${address}`} target="_blank" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <ExternalLink className="w-4 h-4 text-white/60" />
            </a>
          </div>

          {/* Export Private Key */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => setShowKey(!showKey)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-red-400 hover:border-red-500/30 transition"
            >
              {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showKey ? 'Hide Private Key' : 'Export Private Key'}
            </button>
            {showKey && (
              <button
                onClick={copyKey}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/60 hover:text-white transition"
              >
                {copied ? '✓ Copied' : 'Copy Key'}
              </button>
            )}
          </div>
          {showKey && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mt-2">
              <p className="text-[10px] text-red-300 mb-1 font-bold">⚠️ SECRET - kisi ko mat dikhana!</p>
              <p className="font-mono text-[10px] text-red-200 break-all">{privateKey}</p>
            </div>
          )}
        </div>

        {/* Faucet */}
        {balance !== null && parseFloat(balance) === 0 && (
          <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Droplets className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-300 mb-1">Free Test {network.symbol} Lein</h3>
                <p className="text-xs text-white/50 mb-3">Balance khali hai - {network.name} faucet se free test tokens lein.</p>
                <a href={network.faucet} target="_blank" className="inline-block px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition">
                  Faucet Kholein
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Send */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 mb-5">
            <Send className="w-4 h-4 text-purple-400" /> Send {network.symbol}
          </h2>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="Recipient address (0x...)"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500 transition"
            />
            <input
              type="number"
              step="any"
              placeholder={`Amount (${network.symbol})`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          {txHash && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
              <p className="text-emerald-400 text-xs mb-2">✅ Transaction sent!</p>
              <a href={`${network.explorer}/tx/${txHash}`} target="_blank" className="font-mono text-[10px] text-emerald-300 underline break-all">
                {txHash}
              </a>
            </div>
          )}

          <button
            onClick={sendTx}
            disabled={sending}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold disabled:opacity-50 hover:scale-[1.01] transition-all"
          >
            {sending ? 'Sending...' : 'Send Transaction →'}
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 mb-5">
            <History className="w-4 h-4 text-purple-400" /> Recent Activity
          </h2>
          {activity.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-4">
              Abhi koi transaction nahi - pehli transaction bhejein!
            </p>
          ) : (
            <div className="space-y-3">
              {activity.map((tx: any) => {
                const isSent = (tx.from?.hash || '').toLowerCase() === address.toLowerCase();
                return (
                  <a
                    key={tx.hash}
                    href={`${network.explorer}/tx/${tx.hash}`}
                    target="_blank"
                    className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 hover:bg-white/[0.06] transition"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isSent ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      {isSent ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold">{isSent ? 'Sent' : 'Received'}</p>
                      <p className="text-[10px] text-white/40 font-mono">
                        {isSent ? shortAddr(tx.to?.hash || '') : shortAddr(tx.from?.hash || '')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold font-mono ${isSent ? 'text-red-400' : 'text-emerald-400'}`}>
                        {isSent ? '-' : '+'}{parseFloat(formatEther(BigInt(tx.value || '0'))).toFixed(4)} {network.symbol}
                      </p>
                      <p className="text-[10px] text-white/30">{timeAgo(tx.timestamp)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-white/30 flex items-center justify-center gap-1.5">
          <Activity className="w-3 h-3" /> 3 Networks · 1 Wallet · Powered by Infura + Binance
        </p>
      </div>
    </main>
  );
}
