'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wallet as WalletIcon, KeyRound, Sparkles, ArrowRight, Lock, Trash2, Download, Plus } from 'lucide-react';
import { Wallet } from 'ethers';
import { hasWallet, getKeystore, clearWallet } from '@/lib/wallet';

export default function Home() {
  const router = useRouter();
  const [exists, setExists] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setExists(hasWallet()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const unlock = async () => {
    setUnlocking(true);
    setError('');
    try {
      const ks = getKeystore();
      if (!ks) throw new Error();
      const wallet = await Wallet.fromEncryptedJson(ks, password);
      sessionStorage.setItem('vaultx_pk', wallet.privateKey);
      router.push('/dashboard');
    } catch {
      setError('Ghalat password! Dobara koshish karein.');
    }
    setUnlocking(false);
  };

  const deleteWallet = () => {
    if (window.confirm('Wallet delete karein? Yeh action wapas nahi ho sakta!')) {
      clearWallet();
      setExists(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-500/[0.07] blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[400px] bg-emerald-500/[0.05] blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div className="relative max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/60 mb-6 backdrop-blur-xl">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Web3 Wallet
        </div>

        <div className="relative inline-block mb-8">
          <div className="absolute -inset-4 rounded-3xl bg-purple-500/30 blur-2xl" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            {exists ? <Lock className="w-10 h-10 text-white" /> : <WalletIcon className="w-10 h-10 text-white" />}
          </div>
        </div>

        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent mb-4">
          VaultX
        </h1>

        {exists ? (
          <>
            <p className="text-white/50 mb-8">Wallet locked hai - password se unlock karein</p>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl text-left">
              <input
                type="password"
                placeholder="Vault password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && unlock()}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition mb-3"
              />
              {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
              <button
                onClick={unlock}
                disabled={unlocking}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold disabled:opacity-50 hover:scale-[1.01] transition-all"
              >
                {unlocking ? 'Unlocking...' : 'Unlock Wallet →'}
              </button>

              <div className="flex gap-2 mt-3">
                <Link href="/import" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:bg-purple-500/10 hover:border-purple-500/30 hover:text-purple-300 transition-all">
                  <Download className="w-3.5 h-3.5" /> Import Wallet
                </Link>
                <Link href="/create" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:bg-emerald-500/10 hover:border-emerald-500/30 hover:text-emerald-300 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Create New
                </Link>
              </div>
              <p className="text-[10px] text-white/30 mt-2 text-center">
                Import/Create se current wallet replace hogi - pehle phrase backup karein!
              </p>

              <button
                onClick={deleteWallet}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/50 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Wallet
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-white/50 mb-10 leading-relaxed">
              Secure, modern Web3 wallet - create, import & manage your Ethereum keys
            </p>
            <div className="space-y-3">
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all"
              >
                <KeyRound className="w-5 h-5" />
                Create New Wallet
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/import"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-white/5 border border-white/10 font-bold text-white/70 hover:bg-white/10 transition-all"
              >
                <Download className="w-5 h-5" />
                Import Existing Wallet
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
