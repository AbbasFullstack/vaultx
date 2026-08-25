'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  Download,
  KeyRound,
  Lock,
  Network,
  Orbit,
  Plus,
  ServerCog,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wallet as WalletIcon,
} from 'lucide-react';
import { Wallet } from 'ethers';
import { clearWallet, getKeystore, hasWallet } from '@/lib/wallet';

const proofPoints = [
  { icon: Network, title: 'Testnet networks', detail: 'Amoy · Sepolia · Base Sepolia' },
  { icon: ShieldCheck, title: 'Encrypted keystore', detail: 'Password-protected local vault' },
  { icon: ServerCog, title: 'Server-side RPC', detail: 'Provider keys stay off the client' },
];

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
      const keystore = getKeystore();
      if (!keystore) throw new Error('No local vault found');
      const wallet = await Wallet.fromEncryptedJson(keystore, password);
      sessionStorage.setItem('vaultx_pk', wallet.privateKey);
      router.push('/dashboard');
    } catch {
      setError('Incorrect password. Please try again.');
    }
    setUnlocking(false);
  };

  const deleteWallet = () => {
    if (window.confirm('Delete this local VaultX wallet? This action cannot be undone.')) {
      clearWallet();
      setExists(false);
    }
  };

  return (
    <main className="vault-shell min-h-screen overflow-hidden bg-[#04040a] text-white selection:bg-violet-400/30">
      <div className="vault-grid" aria-hidden="true" />
      <div className="vault-aurora vault-aurora-one" aria-hidden="true" />
      <div className="vault-aurora vault-aurora-two" aria-hidden="true" />
      <div className="vault-aurora vault-aurora-three" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-white/[0.07] pb-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.07] shadow-[0_0_30px_rgba(139,92,246,0.24)]">
              <WalletIcon className="h-5 w-5 text-violet-200" aria-hidden="true" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-[#04040a] bg-emerald-400" />
            </div>
            <div>
              <p className="font-semibold tracking-tight">VaultX</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/42">Testnet Web3 Wallet</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-amber-200/10 bg-amber-300/[0.04] px-3 py-1.5 text-[11px] font-medium text-amber-100/80 sm:flex">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
            Learning project · Testnet only
          </div>
        </header>

        <section className="grid min-w-0 flex-1 items-center gap-12 py-12 lg:grid-cols-[1.03fr_0.97fr] lg:py-16">
          <div className="relative z-10 w-full min-w-0 max-w-2xl">
            <div className="vault-reveal inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.07] px-3 py-1.5 text-xs font-semibold text-violet-100/90 shadow-[0_0_26px_rgba(139,92,246,0.12)]">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" aria-hidden="true" />
              <span>Private-by-design learning workflow</span>
            </div>

            <h1 className="vault-headline vault-reveal vault-reveal-delay-1 mt-6 max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              <span className="block">Explore testnet</span>
              <span className="block">assets with a</span>
              <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">vault-like flow.</span>
            </h1>

            <p className="vault-reveal vault-reveal-delay-2 mt-6 w-full max-w-xl break-words text-base leading-7 text-white/58 sm:text-lg">
              <span className="sm:hidden">Explore wallet flows across three testnets in a focused local workspace.</span>
              <span className="hidden sm:inline">Create or import a wallet, switch between Polygon Amoy, Ethereum Sepolia, and Base Sepolia, and explore key-management workflows in a focused local workspace.</span>
            </p>

            <div className="vault-reveal vault-reveal-delay-3 mt-8 flex w-full max-w-xl items-start gap-3 overflow-hidden rounded-2xl border border-amber-200/10 bg-amber-200/[0.045] p-4 text-sm leading-6 text-amber-50/85">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
              <p className="break-words"><span className="sm:hidden"><strong className="font-semibold text-amber-100">Testnet only.</strong> Never use real funds or a production seed phrase.</span><span className="hidden sm:inline"><strong className="font-semibold text-amber-100">Learning project · Testnet networks only.</strong> Never use real funds or production seed phrases.</span></p>
            </div>

            {exists ? (
              <section className="vault-reveal vault-reveal-delay-4 mt-8 rounded-3xl border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6" aria-labelledby="unlock-heading">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/15 text-violet-200"><Lock className="h-5 w-5" aria-hidden="true" /></div>
                    <div><h2 id="unlock-heading" className="font-semibold">Vault detected</h2><p className="text-xs text-white/48">Unlock your local encrypted keystore.</p></div>
                  </div>
                  <BadgeCheck className="h-5 w-5 text-emerald-300/80" aria-label="Encrypted local vault detected" />
                </div>
                <label className="sr-only" htmlFor="vault-password">Vault password</label>
                <input id="vault-password" type="password" placeholder="Vault password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && unlock()} className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-white/28 outline-none transition focus:border-violet-300/60 focus:ring-4 focus:ring-violet-400/10" />
                {error && <p className="mt-2 text-xs font-medium text-red-300">{error}</p>}
                <button onClick={unlock} disabled={unlocking} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 px-4 py-3.5 text-sm font-bold shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-0">
                  <Lock className="h-4 w-4" aria-hidden="true" />{unlocking ? 'Unlocking local vault…' : 'Unlock vault'}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link href="/import" className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs font-semibold text-white/70 transition hover:border-violet-300/30 hover:bg-violet-400/[0.08] hover:text-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-200"><Download className="h-3.5 w-3.5" aria-hidden="true" />Import wallet</Link>
                  <Link href="/create" className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs font-semibold text-white/70 transition hover:border-emerald-300/30 hover:bg-emerald-400/[0.08] hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"><Plus className="h-3.5 w-3.5" aria-hidden="true" />Create new</Link>
                </div>
                <p className="mt-3 text-center text-[11px] leading-5 text-white/35">Importing or creating another wallet replaces the current local vault. Back up your test phrase first.</p>
                <button onClick={deleteWallet} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-white/42 transition hover:border-red-400/20 hover:bg-red-400/[0.06] hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Delete local vault</button>
              </section>
            ) : (
              <div className="vault-reveal vault-reveal-delay-4 mt-8 grid w-full max-w-lg gap-3 sm:grid-cols-2">
                <Link href="/create" className="group flex min-h-16 w-full min-w-0 items-center justify-between rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 p-4 font-bold shadow-xl shadow-violet-500/25 transition duration-200 hover:-translate-y-1 hover:shadow-violet-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-100 active:translate-y-0"><span className="flex min-w-0 items-center gap-2"><KeyRound className="h-5 w-5 shrink-0" aria-hidden="true" />Create wallet</span><ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" /></Link>
                <Link href="/import" className="group flex min-h-16 w-full min-w-0 items-center justify-between rounded-2xl border border-white/12 bg-white/[0.045] p-4 font-bold text-white/80 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-100 active:translate-y-0"><span className="flex min-w-0 items-center gap-2"><Download className="h-5 w-5 shrink-0" aria-hidden="true" />Import wallet</span><ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" /></Link>
              </div>
            )}
          </div>

          <div className="relative mx-auto w-full min-w-0 max-w-xl lg:max-w-none" aria-label="VaultX testnet wallet visual">
            <div className="vault-stage relative aspect-square min-h-[390px] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.025] to-violet-500/[0.05] shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:min-h-[470px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.24),transparent_26%),radial-gradient(circle_at_18%_22%,rgba(56,189,248,0.15),transparent_22%),radial-gradient(circle_at_80%_82%,rgba(16,185,129,0.12),transparent_24%)]" />
              <div className="vault-orbit absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-200/20" aria-hidden="true"><span className="absolute -left-1.5 top-1/2 h-3 w-3 rounded-full bg-violet-300 shadow-[0_0_16px_rgba(196,181,253,0.9)]" /></div>
              <div className="vault-orbit-reverse absolute left-1/2 top-1/2 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10" aria-hidden="true"><span className="absolute right-[9%] top-[18%] h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.9)]" /></div>
              <div className="vault-particle vault-particle-one" aria-hidden="true" /><div className="vault-particle vault-particle-two" aria-hidden="true" /><div className="vault-particle vault-particle-three" aria-hidden="true" />
              <div className="vault-float absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"><div className="relative flex h-40 w-40 items-center justify-center rounded-[2.1rem] border border-white/25 bg-gradient-to-br from-violet-400 via-violet-500 to-blue-600 shadow-[0_28px_70px_rgba(107,70,255,0.52)] sm:h-48 sm:w-48"><div className="absolute inset-2 rounded-[1.65rem] border border-white/20 bg-gradient-to-br from-white/20 to-transparent" /><WalletIcon className="relative h-16 w-16 text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.25)] sm:h-20 sm:w-20" aria-hidden="true" /></div></div>
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-2 sm:bottom-7 sm:left-7 sm:right-7 sm:gap-3">
                {proofPoints.map(({ icon: Icon, title, detail }, index) => <div key={title} className="vault-reveal rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl" style={{ animationDelay: `${0.2 + index * 0.1}s` }}><Icon className="h-4 w-4 text-violet-200" aria-hidden="true" /><p className="mt-3 text-[11px] font-semibold text-white/85 sm:text-xs">{title}</p><p className="mt-1 hidden text-[10px] leading-4 text-white/42 sm:block">{detail}</p></div>)}
              </div>
            </div>
            <div className="pointer-events-none absolute -right-3 top-8 hidden rounded-2xl border border-white/10 bg-[#0a0b16]/80 px-4 py-3 shadow-xl backdrop-blur-xl md:block"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/38">Network state</p><p className="mt-1 flex items-center gap-2 text-xs font-medium text-white/80"><span className="h-2 w-2 rounded-full bg-emerald-400" />Testnet ready</p></div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/[0.07] py-5 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between"><p>VaultX is a portfolio learning project. It is not a production wallet.</p><div className="flex items-center gap-2"><Orbit className="h-3.5 w-3.5 text-violet-300/70" aria-hidden="true" />Polygon Amoy · Ethereum Sepolia · Base Sepolia</div></footer>
      </div>
    </main>
  );
}
