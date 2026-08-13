'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, JsonRpcProvider, parseEther, formatEther, isAddress } from 'ethers';
import { KeyRound, Copy, Check, ExternalLink, Send, Lock, Droplets, Activity } from 'lucide-react';

const EXPLORER = 'https://amoy.polygonscan.com';

function rpcUrl() {
  if (typeof window === 'undefined') return '/api/rpc';
  return window.location.origin + '/api/rpc';
}

async function rpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(rpcUrl(), {
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
  const [address, setAddress] = useState('');
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [polPrice, setPolPrice] = useState(0);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const pk = sessionStorage.getItem('vaultx_pk');
    if (!pk) {
      router.push('/');
      return;
    }
    (async () => {
      const provider = new JsonRpcProvider(rpcUrl());
      const w = new Wallet(pk, provider);
      setWallet(w);
      setAddress(w.address);
      try {
        const hex = await rpcCall('eth_getBalance', [w.address, 'latest']);
        setBalance(formatEther(BigInt(hex)));
      } catch (e: any) {
        setError('Balance load nahi hua: ' + (e.message || ''));
        setBalance('0');
      }
    })();
  }, [router]);

  useEffect(() => {
    fetch('https://api.binance.com/api/v3/ticker/price?symbol=POLUSDT')
      .then(r => r.json())
      .then(d => setPolPrice(parseFloat(d.price)))
      .catch(() => {});
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/polusdt@miniTicker');
    ws.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data);
        setPolPrice(parseFloat(d.c));
      } catch {}
    };
    return () => ws.close();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lockWallet = () => {
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
          const hex = await rpcCall('eth_getBalance', [address, 'latest']);
          setBalance(formatEther(BigInt(hex)));
        } catch {}
      }, 5000);
    } catch (e: any) {
      setError(e.shortMessage || e.message || 'Transaction fail ho gayi');
    }
    setSending(false);
  };

  const usdValue = balance ? parseFloat(balance) * polPrice : 0;

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
            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
              AMOY TESTNET
            </span>
          </div>
          <button onClick={lockWallet} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/70 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all">
            <Lock className="w-3.5 h-3.5" /> Lock
          </button>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold">Total Balance</span>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              LIVE POL: ${polPrice.toFixed(4)}
            </span>
          </div>
          <div className="flex items-end gap-3 mb-1">
            <p className="text-4xl font-bold font-mono">
              {balance === null ? '...' : parseFloat(balance).toFixed(4)}
            </p>
            <span className="text-white/50 font-semibold mb-1">POL</span>
          </div>
          <p className="text-sm text-white/40 font-mono mb-5">≈ ${usdValue.toFixed(4)} USD</p>

          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl p-3">
            <span className="font-mono text-xs text-white/60 break-all flex-1">{address}</span>
            <button onClick={copyAddress} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            </button>
            <a href={`${EXPLORER}/address/${address}`} target="_blank" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition">
              <ExternalLink className="w-4 h-4 text-white/60" />
            </a>
          </div>
        </div>

        {balance !== null && parseFloat(balance) === 0 && (
          <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <Droplets className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-amber-300 mb-1">Free Test POL Lein</h3>
                <p className="text-xs text-white/50 mb-3 leading-relaxed">
                  Amoy wallet mein sirf POL chalta hai (Sepolia ETH yahan nahi dikhega - wo alag blockchain hai).
                </p>
                <a href="https://faucet.polygon.technology" target="_blank" className="inline-block px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/30 text-[11px] font-bold text-amber-300 hover:bg-amber-500/30 transition">
                  Polygon Faucet
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-xl">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/40 mb-5">
            <Send className="w-4 h-4 text-purple-400" /> Send POL
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
              placeholder="Amount (POL)"
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
              <a href={`${EXPLORER}/tx/${txHash}`} target="_blank" className="font-mono text-[10px] text-emerald-300 underline break-all">
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

        <p className="text-center text-[11px] text-white/30 flex items-center justify-center gap-1.5">
          <Activity className="w-3 h-3" /> Powered by Polygon Amoy + Binance WebSocket
        </p>
      </div>
    </main>
  );
}
