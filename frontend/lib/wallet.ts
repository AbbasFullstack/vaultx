const KEYSTORE_KEY = 'vaultx_keystore';

export function hasWallet(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(KEYSTORE_KEY);
}

export function saveKeystore(json: string) {
  localStorage.setItem(KEYSTORE_KEY, json);
}

export function getKeystore(): string | null {
  return localStorage.getItem(KEYSTORE_KEY);
}

export function clearWallet() {
  localStorage.removeItem(KEYSTORE_KEY);
}
