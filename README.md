![Header](https://capsule-render.vercel.app/api?type=waving&height=230&section=header&text=VaultX&fontSize=70&fontColor=ffffff&animation=twinkling&desc=Your%20Keys,%20Your%20Crypto%20%E2%80%A2%20Multi-Chain%20Web3%20Wallet&descAlignY=72&color=gradient&customColorList=10)

<div align="center">

<img src="https://readme-typing-svg.demolab.com/?font=Fira+Code&weight=600&size=24&pause=1000&color=8B5CF6&center=true&vCenter=true&width=700&lines=Your+Keys+Your+Crypto;Multi-Chain:+Polygon+%E2%80%A2+Ethereum+%E2%80%A2+Base;Encrypted+Keystore+%2B+Mnemonic" alt="Typing SVG"/>

**Testnet Web3 wallet learning project — create, import, and explore wallet flows across Polygon Amoy, Ethereum Sepolia, and Base Sepolia.**

> **Learning project · Testnet networks only · Never use real funds or production seed phrases.**

[![LIVE DEMO](https://img.shields.io/badge/🚀_LIVE_DEMO-vaultx--mu.vercel.app-8B5CF6?style=for-the-badge&logo=vercel&logoColor=white)](https://vaultx-mu.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![ethers.js](https://img.shields.io/badge/ethers.js-v6-8B5CF6?style=for-the-badge)](https://docs.ethers.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Infura](https://img.shields.io/badge/Infura-RPC_Node-FF6C37?style=for-the-badge)](https://infura.io)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ Features

<div align="center">

[![🎲 Create Wallet](https://img.shields.io/badge/🎲_Create_Wallet-12_Word_Mnemonic-8B5CF6?style=for-the-badge)](#)
[![📥 Import Wallet](https://img.shields.io/badge/📥_Import-Phrase_+_Private_Key-blue?style=for-the-badge)](#)
[![🔐 Encrypted](https://img.shields.io/badge/🔐_Keystore-Password_Encrypted-green?style=for-the-badge)](#)

[![⛓️ Multi-Chain](https://img.shields.io/badge/⛓️_Multi_Chain-Amoy_+_Sepolia_+_Base-orange?style=for-the-badge)](#)
[![💸 Send TX](https://img.shields.io/badge/💸_Send-Signed_Transactions-red?style=for-the-badge)](#)
[![📜 Activity](https://img.shields.io/badge/📜_Activity-Sent_+_Received_History-teal?style=for-the-badge)](#)

[![💰 Live Balances](https://img.shields.io/badge/💰_Live-Balances_+_Prices-yellow?style=for-the-badge)](#)
[![👥 Multi-Account](https://img.shields.io/badge/👥_Accounts-Logout_+_Switch-purple?style=for-the-badge)](#)
[![💎 UI](https://img.shields.io/badge/💎_UI-Glassmorphism_Carbon_Dark-slate?style=for-the-badge)](#)

</div>

---

## 🏗️ Architecture

```text
Browser ──JSON-RPC──► /api/rpc (proxy) ──► Infura RPC (Amoy/Sepolia/Base)
   │
   ├──REST──► Etherscan V2 API (activity history)
   │
   └──WebSocket──► Binance (live prices)
```

---

## 🛠️ Tech Stack

<div align="center">

[![Next.js 16](https://img.shields.io/badge/Next.js_16-App_Router_+_API_Routes-black?style=for-the-badge&logo=next.js)](#)
[![ethers.js v6](https://img.shields.io/badge/ethers.js-HD_Wallet_+_Signing-8B5CF6?style=for-the-badge)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Type_Safety-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Glassmorphism-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
[![Infura](https://img.shields.io/badge/Infura-3_Network_RPC-FF6C37?style=for-the-badge)](#)
[![Etherscan V2](https://img.shields.io/badge/Etherscan_V2-Activity_API-slate?style=for-the-badge)](#)
[![Binance WebSocket](https://img.shields.io/badge/Binance-Live_Prices-F0B90B?style=for-the-badge&logo=binance&logoColor=black)](#)

</div>

---

## 📦 Installation

```bash
git clone https://github.com/AbbasFullstack/vaultx.git
cd vaultx/frontend
npm install
cp .env.example .env.local
# Add INFURA_PROJECT_ID and ETHERSCAN_API_KEY to .env.local
npm run dev
```

> 🔑 Provider keys ko sirf `.env.local` aur Vercel Environment Variables mein rakhein. API keys, private keys, seed phrases aur `.env.local` ko GitHub par kabhi commit na karein.

---

## 📘 OpenAPI Contract

VaultX ke server-side API proxy contract ko OpenAPI 3.0 specification mein document kiya gaya hai:

- **Specification:** [`docs/openapi/vaultx-openapi.yaml`](docs/openapi/vaultx-openapi.yaml)
- **Covered endpoints:** `POST /api/rpc` aur `GET /api/activity`
- **Generated client:** [`frontend/lib/generated/vaultx-api-client.ts`](frontend/lib/generated/vaultx-api-client.ts)
- **OpenAPI Forge workflow:** spec ko OpenAPI Forge mein upload karein, validate karein, API documentation aur mock responses review karein, phir TypeScript client SDK generate karein.

VaultX dashboard ke RPC aur server-side activity fallback calls generated client methods (`proxyJsonRpcRequest` aur `getWalletActivity`) use karte hain. Jab specification change ho, client file ko OpenAPI Forge se regenerate karke update karein.

> Provider credentials specification mein intentionally included nahi hain. Document sirf request/response contract aur safe example values describe karta hai.

---

## 📁 Project Structure

```text
vaultx/
├── docs/
│   └── openapi/
│       └── vaultx-openapi.yaml     # API contract for OpenAPI Forge
└── frontend/
    ├── app/
    │   ├── api/
    │   │   ├── rpc/route.ts        # RPC proxy (3 testnet networks)
    │   │   └── activity/route.ts   # Activity-history fallback
    │   ├── create/page.tsx         # Wallet creation + mnemonic
    │   ├── import/page.tsx         # Import phrase/key
    │   ├── dashboard/page.tsx      # Testnet balances + send + activity
    │   └── page.tsx                # Landing + unlock / account switch
    ├── lib/
    │   ├── generated/
    │   │   └── vaultx-api-client.ts # Generated OpenAPI client
    │   └── wallet.ts               # Local keystore helpers
    └── .env.example                # Required provider variable names only
```

---

## ⚠️ Security Note

Yeh ek **learning project** hai. Keys browser mein password-encrypted save hoti hain (industry standard keystore format). Phir bhi: **asli funds kabhi test wallets mein na rakhein!**

If provider credentials were ever committed or shared, revoke/rotate them in the relevant provider dashboards, replace them in Vercel Environment Variables, and redeploy before treating the project as publicly safe.

---

## 👨💻 About the Developer

<div align="center">

<img src="https://github.com/AbbasFullstack.png" width="120" height="120" alt="Abbas Hussain"/>

### **Abbas Hussain**
*Full-Stack & Web3 Developer*

[![GitHub](https://img.shields.io/badge/GitHub-AbbasFullstack-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AbbasFullstack)
[![Portfolio](https://img.shields.io/badge/Portfolio-Live_Projects-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://abbas-portfolio-beta.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Abbas_Hussain-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abbas-hussain-56a61338b/)

> 🎯 Self-taught full-stack developer building public learning projects across Web3, APIs, and developer tooling.
> ⛓️ Next.js • TypeScript • ethers.js • Supabase • WebSocket APIs

### 📊 Development Activity

![Contribution Graph](https://ghchart.rshah.org/8B5CF6/AbbasFullstack)

</div>

---

## 📄 License

<div align="center">

[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](#)

**Made with ❤️ by Abbas Hussain**

⭐ *Star this repo if you find it helpful!*

</div>

![Footer](https://capsule-render.vercel.app/api?type=wave&height=110&section=footer&color=gradient&customColorList=10)
