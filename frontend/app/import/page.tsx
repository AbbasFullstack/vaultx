'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, HDNodeWallet } from 'ethers';
import { ArrowLeft, KeyRound, AlertTriangle, Download } from 'lucide-react';
import { saveKeystore, hasWallet } from '@/lib/wallet';

export default function ImportWallet() {
  const router = useRouter();
  const [secret, setSecret] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [exists] = useState(hasWallet());

  const importWallet = async () => {
    setError('');
    if (password.length < 6) { setError('Password kam az kam 6 characters ka ho'); return; }
    if (password !== confirmPw) { setError('Dono passwords match nahi kar rahe'); return; }
    setSaving(true);
    try {
      const trimmed = secret.trim();
      let wallet: Wallet | HDNodeWallet;
      if (trimmed.split(/\s+/).length === 12) {
        wallet = HDNodeWallet.fromPhrase(trimmed);
      } else if (trimmed.startsWith('0x') && trimmed.length === 66) {
        wallet = new Wallet(trimmed);
      } else {
        throw new Error('invalid');
      }
      const keystore = await wallet.encrypt(password);
      saveKeystore(keystore);
      sessionStorage.setItem('vaultx_pk', wallet.privateKey);
      router.push('/dashboard');
    } catch {
      setError('Ghalat phrase ya private key! Check karke dobara try karein.');
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-500/[0.07] blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/30 backdrop-blur-2xl">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 text-white/70 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold">VaultX</span>
          </div>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Import Wallet</h1>
          <p className="text-white/50 text-sm">Apna purana wallet restore karein - 12 words ya private key se</p>
        </div>

        {exists && (
          <div className="bg-amber-500/[0.08] border border-amber-500/20 rounded-2xl p-4 mb-6 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/80 leading-relaxed">
                <strong className="text-amber-300">Note:</strong> Import karne se current wallet replace ho jayegi. Pehle uska secret phrase backup kar lein!
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-purple-400" />
            <div className="text-xs font-bold uppercase tracking-widest text-white/40">Secret Phrase / Private Key</div>
          </div>
          <textarea
            placeholder="12 words ka phrase (space se alag) ya private key (0x...)"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-mono focus:outline-none focus:border-purple-500 transition resize-none"
          />
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-4">
          <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Naya Vault Password</div>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-purple-500 transition"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={importWallet}
          disabled={saving}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold disabled:opacity-40 hover:scale-[1.01] transition-all"
        >
          {saving ? 'Importing...' : 'Import Wallet →'}
        </button>
      </div>
    </main>
  );
}
