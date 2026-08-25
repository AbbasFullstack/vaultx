import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');

test('VaultX landing preserves its safe testnet positioning', () => {
  assert.match(page, /Learning project · Testnet networks only/);
  assert.match(page, /Testnet only\.<\/strong> Never use real funds or a production seed phrase/);
  assert.match(page, /Never use real funds or production seed phrases/);
  assert.match(page, /Polygon Amoy, Ethereum Sepolia, and Base Sepolia/);
});

test('VaultX landing exposes premium motion with reduced-motion support', () => {
  assert.match(page, /vault-orbit/);
  assert.match(page, /vault-float/);
  assert.match(page, /vault-headline/);
  assert.match(page, /w-full min-w-0 max-w-2xl/);
  assert.match(page, /grid w-full max-w-lg gap-3/);
  assert.match(page, /<span className="block">Explore testnet<\/span>/);
  assert.match(styles, /clamp\(2\.35rem, 11vw, 2\.8rem\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
});

test('VaultX metadata identifies the project rather than the framework scaffold', () => {
  assert.match(layout, /VaultX — Testnet Web3 Wallet/);
  assert.doesNotMatch(layout, /Create Next App/);
});
