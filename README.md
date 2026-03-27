<p align="center">
  <img src="./nerave-frontend/public/Nerave-plane.svg" alt="Nerave Banner" width="100%" />
</p>


<h3 align="center">
  <em>The nerve center of trust — Trustless milestone payments for African businesses.</em>
</h3>

<p align="center">
  <a href="https://npmjs.org/package/nerave-sdk"><img src="https://img.shields.io/npm/v/nerave-sdk.svg?style=flat-square&color=00D4AA" alt="npm version" /></a>
  <img src="https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity" alt="Solidity" />
  <img src="https://img.shields.io/badge/Sepolia-Deployed-6C63FF?style=flat-square&logo=ethereum" alt="Sepolia" />
  <img src="https://img.shields.io/badge/Interswitch-Sandbox-F7941D?style=flat-square" alt="Interswitch" />
  <img src="https://img.shields.io/badge/NestJS-Backend-E0234E?style=flat-square&logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-SDK-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
</p>

<p align="center">
  <strong>Built for the Interswitch × Enyata Hackathon 2026</strong>
</p>

---

## 😤 The Problem — A Story Every Nigerian Business Knows

Picture this: You're a small business owner in Lagos. You hire a freelance developer to build your website. You agree on ₦500,000 — half upfront, half on delivery.

You send the first ₦250,000 via transfer. Then silence. The developer disappears. No refund. No recourse. You just lost ₦250,000.

Now flip it: You're the developer. You deliver the website. The client says _"It's not exactly what I wanted"_ and refuses to pay the remaining ₦250,000. You just worked 3 weeks for free.

**This happens thousands of times daily across Africa.** There's no trust layer between service providers and clients. Bank transfers are irreversible. Verbal agreements are unenforceable. And the courts? That's a 2-year journey nobody wants to take.

**Nerave fixes this.**

---

## 🧠 What Nerave Does — In 3 Simple Layers

Think of Nerave like a **digital referee** that holds money safely until both sides agree the work is done.

### Layer 1: The Agreement (What Everyone Sees)
> A business owner and a service provider agree on a project. They split it into **milestones** — checkpoints with amounts attached. For example: _"Design: ₦150,000 → Development: ₦250,000 → Deployment: ₦100,000"_.

### Layer 2: The Smart Contract (The Trust Engine)
> When an agreement is created, Nerave deploys a **smart contract on Ethereum (Sepolia testnet)** — a piece of code that lives on the blockchain and **cannot be tampered with**. This contract holds the rules: _both the client AND the contractor must confirm a milestone is complete_ before any money moves.

### Layer 3: The Money Rails (Interswitch)
> When both parties confirm a milestone, the smart contract emits a signal. Our backend catches it and **automatically triggers a bank transfer** through **Interswitch's API** to the contractor's bank account. No manual intervention. No disputes. The money flows when — and only when — both sides agree.

```
Client creates agreement → Smart contract deployed on blockchain
Client funds agreement  → Money held (via Interswitch collection)
Both confirm milestone  → Smart contract signals approval
Backend detects signal  → Interswitch disburses to contractor's bank
```

**That's it.** Trustless. Automatic. Transparent.

---

## 🚀 Live Demo & Test Credentials

### Demo Application
> **[🌐 Nerave Demo App](https://nerave-demo.vercel.app)** — _Try the full flow yourself_

### Test Accounts

| Role | Email | Password | What You Can Do |
|------|-------|----------|----------------|
| 🏢 **Business Owner** | `demo-owner@nerave.test` | `Demo12345!` | Create agreements, add milestones, fund & confirm |
| 🔧 **Contractor** | `demo-contractor@nerave.test` | `Demo12345!` | View projects, confirm milestones, receive disbursement |

### Quick Demo Walkthrough (2 minutes)

1. **Open the demo app** → Click **"Login as Business Owner"**
2. **Create an agreement** → Click "New Agreement", enter `demo-contractor@nerave.test` as the contractor
3. **Add milestones** → e.g., _"Design Phase: ₦150,000"_ and _"Development: ₦350,000"_
4. **Fund the agreement** → Click **"Mock Pay"** (simulates Interswitch payment)
5. **Confirm a milestone** → Expand the agreement, click **"Confirm"** on a milestone
6. **Switch to Contractor** → Sign out, click **"Login as Contractor"**
7. **Confirm the same milestone** → When _both sides confirm_, auto-disbursement triggers! 🎉
8. **Check Etherscan** → Click the contract address link to see it live on the blockchain

### API & SDK Access

| Resource | Value |
|----------|-------|
| API Base URL | `https://nerave.onrender.com` |
| SDK Test API Key | `pk_test_02b687d61e5144ab8a0fd3a05cb3a6de` |
| NPM Package | `npm install nerave-sdk` |
| Interswitch Sandbox | `https://sandbox.interswitchng.com` |
| Test Bank Account | `0014261063` (GTB, Bank Code: `058`) |
| Interswitch Terminal ID | `3PBL0001` |

---

## 💡 Innovation — Why This Matters

### The Blockchain Angle 🔗

Most payment escrow solutions require you to **trust the platform** — they hold your money, and you hope they release it fairly. That's just replacing one trust problem with another.

Nerave is different. The escrow logic lives **on-chain** in a Solidity smart contract (`PayLockAgreement.sol`). The rules are:

- Only the **client** and **contractor** on the agreement can interact with it
- Both must call `confirmMilestone()` — one party alone cannot trigger disbursement
- Once both confirm, the contract emits a `MilestoneApproved` event that **cannot be faked or reversed**
- The contract is **verified on Etherscan** — anyone can audit the code

**Nobody — not even Nerave — can override the contract.** That's real trust.

### The Interswitch Angle 💳

Smart contracts are powerful, but they don't move Naira. That's where **Interswitch** completes the picture:

1. **Collection** — Clients fund agreements through Interswitch Web Checkout (secure, PCI-compliant payment page)
2. **Account Validation** — Before disbursement, we validate the contractor's bank account using Interswitch's Name Enquiry API
3. **Disbursement** — When a milestone is approved on-chain, we automatically transfer funds to the contractor's bank via Interswitch's TransferFunds API
4. **Webhooks** — We listen for Interswitch's `TRANSACTION.COMPLETED` webhook to confirm payment status

**Blockchain provides the trust. Interswitch provides the rails. Nerave connects them.**

---

## 📦 SDK Quickstart — Ship in 10 Lines

```bash
npm install nerave-sdk
```

```typescript
import { Nerave } from 'nerave-sdk';

const nerave = new Nerave({ apiKey: 'pk_test_your_key_here' });

// Create an agreement — deploys a smart contract!
const agreement = await nerave.agreements.create({
  contractorId: 'contractor-user-id',
  totalAmount: 500000,
  milestones: [
    { title: 'Design Phase', amount: 150000 },
    { title: 'Development', amount: 250000 },
    { title: 'Deployment', amount: 100000 },
  ],
});

// Fund via Interswitch
const payment = await nerave.payments.initiate(agreement.id);
// → Returns Interswitch checkout URL for the client to pay

// Confirm milestone (both parties must do this)
await nerave.milestones.confirm({
  agreementId: agreement.id,
  milestoneId: agreement.milestones[0].id,
});
// → When both confirm → auto-disburse to contractor's bank!
```

### Full SDK API

| Method | Description |
|--------|-------------|
| `nerave.agreements.create(input)` | Create agreement + deploy smart contract |
| `nerave.agreements.list()` | List all your agreements |
| `nerave.agreements.get(id)` | Get agreement details + milestone states |
| `nerave.milestones.confirm(input)` | Confirm a milestone (as client or contractor) |
| `nerave.payments.initiate(agreementId)` | Generate Interswitch payment URL |
| `nerave.payments.verify(transactionRef)` | Verify payment status |

---

## 🏗️ Architecture

```
                            ┌─────────────────────────────────────────┐
                            │         Developer's Application         │
                            │                                         │
                            │    import { Nerave } from 'nerave-sdk'  │
                            │    const nerave = new Nerave({...})     │
                            └────────────────┬────────────────────────┘
                                             │
                                        HTTP + API Key
                                             │
                ┌────────────────────────────┼────────────────────────────┐
                │                    Nerave Backend (NestJS)              │
                │                                                        │
                │  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐ │
                │  │   Auth   │  │  Agreements  │  │    Payments      │ │
                │  │  Module  │  │    Module     │  │     Module       │ │
                │  │          │  │              │  │                  │ │
                │  │ • JWT    │  │ • CRUD       │  │ • Collection     │ │
                │  │ • API    │  │ • Deploy     │  │ • Verification   │ │
                │  │   Keys   │  │   Contract   │  │ • Disbursement   │ │
                │  │ • Roles  │  │ • Confirm    │  │ • Webhooks       │ │
                │  └──────────┘  │   Milestone  │  │ • MAC Hash       │ │
                │                └──────┬───────┘  └────────┬─────────┘ │
                │                       │                   │           │
                │              ┌────────┴───────────────────┘           │
                │              │    Blockchain Module (Viem)            │
                │              │    • Deploy contract                   │
                │              │    • Call confirmMilestone()           │
                │              │    • Watch MilestoneApproved events    │
                │              └────────┬───────────────────┬───────────┤
                └───────────────────────┼───────────────────┼───────────┘
                                        │                   │
                     ┌──────────────────┘                   └──────────────┐
                     ▼                                                      ▼
         ┌───────────────────────┐                           ┌──────────────────────┐
         │   Sepolia Testnet     │                           │   Interswitch APIs   │
         │                       │                           │                      │
         │  PayLockAgreement.sol │                           │  • OAuth2 Token      │
         │  • Agreement struct   │                           │  • Web Checkout      │
         │  • Milestone struct   │                           │  • Name Enquiry      │
         │  • confirmMilestone() │                           │  • TransferFunds     │
         │  • MilestoneApproved  │                           │  • Webhooks          │
         │    event              │                           │                      │
         └───────────────────────┘                           └──────────────────────┘
                                                                       │
                                                                       ▼
                                                             ┌──────────────────┐
                                                             │  Contractor's    │
                                                             │  Bank Account    │
                                                             │  (GTB/Any Bank)  │
                                                             └──────────────────┘
```

### Data Flow: What Happens When a Milestone is Approved

```
1. Client calls  → nerave.milestones.confirm({ agreementId, milestoneId })
2. Contractor    → nerave.milestones.confirm({ agreementId, milestoneId })
3. Backend       → Calls smart contract confirmMilestone() on Sepolia
4. Smart Contract→ Both confirmed? Emit MilestoneApproved(milestoneId, amount)
5. Viem Listener → Catches the event on-chain
6. Backend       → Validates contractor bank (Interswitch Name Enquiry)
7. Backend       → Computes MAC hash (SHA-512)
8. Backend       → Calls Interswitch TransferFunds API
9. Interswitch   → Disburses ₦ to contractor's bank account
10. Backend      → Marks milestone as disbursed in database
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Smart Contract** | Solidity 0.8.20 + Foundry | Battle-tested EVM toolchain, fast compilation, built-in testing |
| **Backend** | NestJS + TypeScript | Modular architecture, dependency injection, enterprise-grade structure |
| **Database** | PostgreSQL (Supabase) | Reliable, free tier, real-time capabilities |
| **ORM** | Prisma | Type-safe database queries, automatic migrations |
| **Blockchain Client** | Viem | Modern, lightweight alternative to ethers.js — better TypeScript support |
| **SDK** | TypeScript + Axios | Full type safety, tree-shakeable, works in Node.js and browsers |
| **Demo Frontend** | React + Vite | Fast dev server, optimal bundling, TypeScript-first |
| **Payment Rails** | Interswitch APIs | Nigeria's leading payment infrastructure — trusted by banks |
| **Testnet** | Sepolia (Ethereum) | Official Ethereum testnet — reliable, well-supported |
| **Deployment** | Render (API) + Vercel (Frontend) | Zero-config deployment, automatic HTTPS |

---

## 💳 Interswitch APIs Used

### 1. OAuth 2.0 Authentication
```
POST https://sandbox.interswitchng.com/passport/oauth/token
Authorization: Basic Base64(CLIENT_ID:SECRET_KEY)
Body: grant_type=client_credentials
→ Returns access_token for subsequent API calls
```
**Used for:** Payment collection and disbursement API authentication.

### 2. Web Checkout (Payment Collection)
```
POST https://sandbox.interswitchng.com/collections/api/v1/purchases
Authorization: Bearer {access_token}
Body: { merchantCode, amount, transactionReference, customerEmail, redirectUrl }
→ Returns redirectUrl for customer payment page
```
**Used for:** Client funds the agreement through Interswitch's secure, PCI-compliant hosted payment page.

### 3. Transaction Verification
```
GET https://sandbox.interswitchng.com/collections/api/v1/purchases/{transactionRef}
Authorization: Bearer {access_token}
→ Returns { responseCode: '00' } on success
```
**Used for:** Confirming payment was successful before marking agreement as FUNDED.

### 4. Name Enquiry (Account Validation) — _Legacy Auth_
```
GET https://qa.interswitchng.com/api/v1/nameenquiry/banks/accounts/names
Headers: InterswitchAuth, Signature, Timestamp, Nonce, TerminalID
Signature: Base64(SHA1("GET&{url}&{timestamp}&{nonce}&{CLIENT_ID}&{SECRET_KEY}"))
→ Returns { accountName: "..." } — validates the bank account exists
```
**Used for:** Validating the contractor's bank account before disbursing funds.

### 5. TransferFunds (Disbursement) — _OAuth Bearer_
```
POST https://qa.interswitchng.com/quicktellerservice/api/v5/transactions/TransferFunds
Authorization: Bearer {access_token}
Body: { mac, transferCode, beneficiaryBankCode, beneficiaryAccountNumber, amount, ... }
MAC: SHA-512(initiatingAmount + currencyCodes + paymentMethods + countryCode)
→ Returns { transactionReference } — funds sent to contractor's bank
```
**Used for:** Automatically disbursing milestone payment to the contractor's bank account when both parties confirm.

### 6. Webhook Verification
```
POST /webhooks/interswitch (our endpoint)
Verify: HmacSHA512(rawJsonBody, WEBHOOK_SECRET) === X-Interswitch-Signature header
→ Return HTTP 200 immediately (Interswitch retries 5x if no 200)
→ Then async: update agreement status to FUNDED
```
**Used for:** Receiving real-time payment confirmation from Interswitch.

---

## ⛓️ Smart Contract — Verified on Etherscan

**Contract:** [`PayLockAgreement.sol`](./nerave-contracts/src/PayLockAgreement.sol)

> 🔗 **[View on Sepolia Etherscan](https://sepolia.etherscan.io)** — _Each agreement deploys a new contract instance_

### Key Functions

```solidity
// Only client/contractor can interact
modifier onlyParties() {
    require(msg.sender == agreement.client || msg.sender == agreement.contractor);
}

// Both must confirm before disbursement triggers
function confirmMilestone(uint256 milestoneId) external onlyParties {
    if (msg.sender == agreement.client) m.clientConfirmed = true;
    if (msg.sender == agreement.contractor) m.contractorConfirmed = true;

    if (m.clientConfirmed && m.contractorConfirmed && !m.disbursed) {
        m.disbursed = true;
        emit MilestoneApproved(milestoneId, m.amount); // ← triggers Interswitch disbursement
    }
}
```

### Why This Matters
- The contract is **immutable** — once deployed, nobody can change the rules
- Both parties must agree — **no single party can steal funds**
- The `MilestoneApproved` event is **publicly verifiable** on the blockchain
- Any auditor, judge, or third party can inspect the contract on Etherscan

---

## 📁 Repository Structure

```
nerave/
├── nerave-contracts/          # Solidity smart contracts (Foundry)
│   └── src/
│       └── PayLockAgreement.sol
│
├── nerave-backend/            # NestJS API server
│   └── src/
│       ├── auth/              # JWT + API key authentication
│       ├── agreement/         # Agreement CRUD + milestone confirmation
│       ├── blockchain/        # Viem client — deploy, confirm, listen
│       ├── payment/           # Interswitch collection + disbursement
│       │   ├── helpers/       # OAuth + Legacy auth + MAC hash
│       │   └── webhooks/      # Interswitch webhook handler
│       └── prisma/            # Database service
│
├── nerave-sdk/                # TypeScript SDK (published on npm)
│   └── src/
│       ├── nerave.ts          # Main client class
│       ├── resources/         # agreements, milestones, payments
│       ├── types.ts           # Full TypeScript type exports
│       └── http.ts            # Axios HTTP client with interceptors
│
├── nerave-demo/               # React + Vite demo application
│   └── src/
│       ├── pages/             # Login, Business Dashboard, Client Portal
│       ├── components/        # Agreement cards, SDK panels, flow diagrams
│       ├── context/           # Auth state management
│       └── hooks/             # useNerave SDK hook
│
└── README.md                  # ← You are here
```

---

## 👥 Team

| Name | Role | Contributions |
|------|------|--------------|
| **Peters Joshua** | Frontend | Smart Contracts + Blockchain | Solidity contract, Foundry tests, Viem integration, SDK architecture, blockchain event listeners, auto-disbursement pipeline |
| **Ademola Aderemi** | API + Payments | NestJS modules, Prisma schema, Interswitch OAuth + Legacy auth, disbursement flow, webhook handling, MAC hash computation |
| **Augustine Emmanuel** |  Brand | Brand identity, UI/UX design, React frontend, demo application, responsive layouts |

---

## 🏁 How to Run Locally

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Supabase free tier)
- Interswitch sandbox credentials (provided in `.env`)

### Backend
```bash
cd nerave-backend
npm install
npx prisma migrate dev
npm run start:dev
# → API running on http://localhost:5000
```

### SDK (Development)
```bash
cd nerave-sdk
npm install
npm run build
# → Compiled to dist/
```

### Demo App
```bash
cd nerave-demo
npm install
npm run dev
# → Open http://localhost:5173
```

---

## 🔑 Environment Variables

```env
# Interswitch Sandbox
INTERSWITCH_CLIENT_ID=IKIA732217EE0092C23AC6B6D3CC62C29D9747E9B0A6
INTERSWITCH_SECRET_KEY=5qaZhlOt8msVqXx
INTERSWITCH_TERMINAL_ID=3PBL0001
INTERSWITCH_BASE_URL=https://sandbox.interswitchng.com
INTERSWITCH_TRANSFER_URL=https://qa.interswitchng.com

# Blockchain (Sepolia)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-key
WALLET_PRIVATE_KEY=0x...

# Database
DATABASE_URL=postgresql://...

# Auth
JWT_SECRET=your-secret
```

---

<p align="center">
  <br />
  <strong>Nerave</strong> — Because trust shouldn't be a luxury.<br />
  <em>Built with 💚 for the Interswitch × Enyata Hackathon 2026</em><br />
  <sub>March 23–26, 2026</sub>
</p>
