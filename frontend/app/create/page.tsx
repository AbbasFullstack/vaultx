'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, HDNodeWallet } from 'ethers';
import { ArrowLeft, Copy, Check, AlertTriangle, Eye, EyeOff, KeyRound, Sparkles, Lock } from 'lucide-react';
import { saveKeystore } from '@/lib/wallet';

type Step = 'intro' | 'phrase' | 'confirm';

export default function CreateWallet() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('intro');
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const generateWallet = () => {
    const wallet = HDNodeWallet.createRandom();
    setMnemonic(wallet.mnemonic?.phrase.split(' ') || []);
    setAddress(wallet.address);
    setPrivateKey(wallet.privateKey);
    setStep('phrase');
  };

  const copyPhrase = () => {
    navigator.clipboard.writeText(mnemonic.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveWallet = async () => {
    setError('');
    if (password.length < 6) { setError('Password kam az kam 6 characters ka ho'); return; }
    if (password !== confirmPw) { setError('Dono passwords match nahi kar rahe'); return; }
    setSaving(true);
    try {
      const wallet = new Wallet(privateKey);
      const keystore = await wallet.encrypt(password);
      saveKeystore(keystore);
      sessionStorage.setItem('vaultx_pk', privateKey);
      router.push('/dashboard');
    } catch {
      setError('Wallet save nahi ho saki');
    }
    setSaving(false);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-500/[0.07] blur-[140px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[400px] h-[400px] bg-blue-500/[0.05] blur-[120px] rounded-full" />
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
        {step === 'intro' && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] text-white/60 mb-6 backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Ethereum Wallet Creation
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-white/30 bg-clip-text text-transparent mb-5">
              Create New Wallet
            </h1>
            <p className="text-white/50 max-w-md mx-auto mb-10 leading-relaxed">
              Aapka naya Ethereum wallet generate hoga - 12 secret words ke sath jo aapki wallet ki chabi hain.
            </p>
            <button
              onClick={generateWallet}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] transition-all"
            >
              Generate Wallet →
            </button>
          </div>
        )}

        {step === 'phrase' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Your Secret Phrase</h1>
              <p className="text-white/50 text-sm">In 12 words ko likh lein aur safe rakhein</p>
            </div>

            <div className="bg-red-500/[0.08] border border-red-500/20 rounded-2xl p-4 mb-6 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-200/80 leading-relaxed">
                  <strong className="text-red-300">WARNING:</strong> Yeh phrase kisi ko mat dikhao. Agar yeh phrase kisi aur ke paas chala gaya, toh aapki wallet ka access permanent chala jayega!
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-6">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {mnemonic.map((word, i) => (
                  <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-[10px] text-white/30 font-mono mb-1">#{i + 1}</div>
                    <div className="text-sm font-semibold">{word}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={copyPhrase}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white/70 hover:bg-white/10 transition-all"
              >
                {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Phrase</>}
              </button>
            </div>

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold hover:scale-[1.01] transition-all"
            >
              Maine Save Kar Liya Hai →
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Almost Done!</h1>
              <p className="text-white/50 text-sm">Password set karein - yeh aapki keys ko encrypt karega</p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-4">
              <div className="text-xs text-white/40 mb-2">Wallet Address</div>
              <div className="font-mono text-sm text-emerald-400 break-all">{address}</div>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-white/40">Private Key</div>
                <button onClick={() => setShowPrivateKey(!showPrivateKey)} className="text-xs text-white/60 hover:text-white flex items-center gap-1">
                  {showPrivateKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showPrivateKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="font-mono text-xs break-all text-white/70">
                {showPrivateKey ? privateKey : '•'.repeat(66)}
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl mb-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-purple-400" />
                <div className="text-xs font-bold uppercase tracking-widest text-white/40">Set Vault Password</div>
              </div>
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
              <p className="text-[11px] text-white/40 mt-3">
                Yeh password aapki keys ko encrypt karega. Har baar wallet kholne par yehi password lagega.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-white/20 bg-white/5 accent-purple-500"
              />
              <span className="text-xs text-white/70 group-hover:text-white/90 transition">
                Maine apna secret phrase safe jagah save kar liya hai.
              </span>
            </label>

            <button
              onClick={saveWallet}
              disabled={!confirmed || saving}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] transition-all"
            >
              {saving ? 'Encrypting...' : 'Encrypt & Save Wallet →'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
