# 🔐 Nerave — 3-Day Hackathon Build Plan
> Trustless milestone payments for African businesses. Smart contract logic. Interswitch rails. TypeScript SDK.

---

## 👥 Team Roles
| Role | Responsibilities |
|------|-----------------|
| **Joshua** (You) | Smart contracts (Solidity + Foundry) + Blockchain module (NestJS + Viem) |
| **Backend Dev** | NestJS modules — Auth, Agreements, Payments, Webhooks + Prisma schema |
| **Designer** | Brand identity, UI design, Next.js frontend implementation |

---

## ⚠️ Ground Rules
- No code pushed to Git before **March 23rd (Kickoff day)**
- Use **Sepolia testnet** throughout — no real money
- Use **Interswitch sandbox** credentials throughout
- Every team member commits to the repo — judges check this
- Deploy target: **Vercel** (frontend) + **Railway/Render** (NestJS backend)

---

&nbsp;

# 📅 DAY 1 — March 23rd: Foundation
> Goal: Every layer has its skeleton running. Nothing pretty, everything connected.

&nbsp;

## 🔷 Joshua — Smart Contracts + Blockchain Module

### Morning (9am – 1pm): Smart Contract
- [ ] `forge init paylock-contracts` — scaffold Foundry project
- [ ] Write `PayLockAgreement.sol` — core contract with:
  - Agreement struct (client, contractor, total amount)
  - Milestone struct (title, amount, `clientConfirmed`, `contractorConfirmed`, `disbursed`)
  - `confirmMilestone(uint milestoneId)` — callable by client or contractor
  - `MilestoneApproved(uint milestoneId, uint amount)` event — fires when both confirm
- [ ] Write `PayLockAgreement.t.sol` — basic Foundry tests
- [ ] Run `forge test` — all tests passing

### Afternoon (2pm – 7pm): NestJS Blockchain Module
- [ ] Scaffold NestJS project — `nest new nerave-api`
- [ ] Create `blockchain/` module
- [ ] Integrate Viem — set up public + wallet client pointing at Sepolia
- [ ] Write `deployAgreement()` service method — deploys a new contract instance per agreement using ABI + bytecode from `forge build`
- [ ] Write `listenToEvents()` service method — listens for `MilestoneApproved` event on a contract address
- [ ] Test deployment script manually with `cast` — confirm contract appears on Sepolia Etherscan

### End of Day Checkpoint ✅
- Smart contract deploys cleanly on Sepolia
- NestJS can deploy a contract and read its events

&nbsp;

## 🔶 Backend Dev — Project Scaffold + Auth + Schema

### Morning (9am – 1pm): Setup
- [ ] Scaffold NestJS project (coordinate with Joshua — one shared repo)
- [ ] Set up PostgreSQL on Supabase free tier
- [ ] Configure Prisma — `prisma init`
- [ ] Write full schema:
  ```
  User (id, email, businessName, apiKey, role)
  Agreement (id, contractAddress, clientId, contractorId, totalAmount, status)
  Milestone (id, agreementId, title, amount, clientConfirmed, contractorConfirmed, disbursed)
  Transaction (id, agreementId, milestoneId, interswitchRef, type, status)
  ```
- [ ] Run `prisma migrate dev` — tables created

### Afternoon (2pm – 7pm): Auth + API Keys
- [ ] Build `auth/` module — email + password registration/login
- [ ] JWT strategy — protect all routes
- [ ] API key generation — every registered business gets a `pk_test_xxx` key
- [ ] API key guard — SDK calls authenticate via this key
- [ ] Test all auth endpoints with Postman

### End of Day Checkpoint ✅
- Database is live on Supabase
- Auth endpoints working
- API key guard protecting routes

&nbsp;

## 🎨 Designer — Brand + Design System

### Morning (9am – 1pm): Brand Identity
- [ ] Define Nerave brand — name means **nerve center of trust**
- [ ] Choose color palette — suggest deep navy `#0A0F1E` + electric teal `#00D4AA` + white
- [ ] Choose typography — one strong display font + one clean body font (avoid Inter/Roboto)
- [ ] Design logo — wordmark or icon mark
- [ ] Create brand board in Figma — colors, fonts, spacing scale, button styles

### Afternoon (2pm – 7pm): Core Screens (Figma)
- [ ] Design landing page — hero, how it works (3 steps), SDK code snippet section, CTA
- [ ] Design dashboard layout — sidebar navigation, main content area
- [ ] Design agreement creation flow — step 1 (details) → step 2 (milestones) → step 3 (payment)
- [ ] Design milestone card component — shows status, confirmation buttons, progress

### End of Day Checkpoint ✅
- Brand board complete
- 4 core screens designed in Figma
- Ready to hand off to frontend implementation tomorrow

---

&nbsp;

# 📅 DAY 2 — March 24th: Core Features
> Goal: The full agreement lifecycle works end to end. Create → Pay → Approve → Disburse.

&nbsp;

## 🔷 Joshua — Contract Events + SDK Package

### Morning (9am – 1pm): Event Listener Integration
- [ ] Wire `listenToEvents()` into the `agreements/` module
- [ ] When `MilestoneApproved` fires → call `payments/` service to trigger Interswitch disbursement
- [ ] Handle event listener lifecycle — start listening when agreement is created, clean up when complete
- [ ] Write contract interaction methods:
  - `confirmMilestone(contractAddress, milestoneId, signerRole)`
  - `getAgreementState(contractAddress)` — read all milestone states

### Afternoon (2pm – 7pm): SDK Package
- [ ] `mkdir nerave-sdk && npm init`
- [ ] Write SDK wrapper in TypeScript:
  ```typescript
  new Nerave({ apiKey: 'pk_test_xxx' })
  nerave.agreements.create({ ... })
  nerave.milestones.confirm({ ... })
  nerave.agreements.getStatus({ ... })
  ```
- [ ] Point SDK at local NestJS API for now
- [ ] Write `README.md` for the SDK — judges will read this
- [ ] Test SDK methods manually

### End of Day Checkpoint ✅
- Milestone approval on-chain triggers disbursement automatically
- SDK package installable and working locally

&nbsp;

## 🔶 Backend Dev — Agreements + Payments + Webhooks

### Morning (9am – 1pm): Agreements Module
- [ ] `POST /agreements` — creates agreement, tells blockchain module to deploy contract, saves `contractAddress` to DB
- [ ] `GET /agreements/:id` — returns agreement + milestone states
- [ ] `POST /agreements/:id/milestones/:milestoneId/confirm` — records confirmation in DB + calls contract
- [ ] Validate that only the correct party (client or contractor) can confirm each milestone

### Afternoon (2pm – 7pm): Payments + Webhooks
- [ ] `payments/` module — Interswitch Web Checkout integration
  - `initiatePayment(agreementId)` → returns Interswitch payment URL
  - `verifyPayment(transactionRef)` → confirms payment status
- [ ] `POST /webhooks/interswitch` — receives `TRANSACTION.COMPLETED` event
  - Verify `X-Interswitch-Signature` using HmacSHA512
  - Mark agreement as `FUNDED` in DB
  - Return HTTP 200 immediately
- [ ] `disbursement/` service — calls Interswitch Single Transfer API when milestone approved

### End of Day Checkpoint ✅
- Full flow working: create agreement → pay → confirm milestones → auto-disburse
- Webhook verified and handling payment confirmation

&nbsp;

## 🎨 Designer — Frontend Implementation (Next.js)

### Morning (9am – 1pm): Project Setup + Landing Page
- [ ] `npx create-next-app nerave-frontend` — scaffold with Tailwind
- [ ] Set up design tokens in `tailwind.config.js` — brand colors, fonts
- [ ] Build landing page from Figma designs:
  - Hero section with tagline
  - "How it works" — 3 step visual flow
  - SDK code snippet block (syntax highlighted)
  - CTA buttons

### Afternoon (2pm – 7pm): Dashboard + Agreement Flow
- [ ] Build dashboard layout — sidebar + main content
- [ ] Build agreement creation form — multi-step (details → milestones → payment)
- [ ] Build milestone card component — status indicators, confirm button
- [ ] Connect to backend API — agreement creation + payment initiation
- [ ] Basic auth pages — login + register

### End of Day Checkpoint ✅
- Landing page live on Vercel
- Dashboard functional with real API calls
- Agreement creation flow working end to end in UI

---

&nbsp;

# 📅 DAY 3 — March 25th: Polish + Deploy
> Goal: Everything is live, demo-able, and judges can test it themselves.

&nbsp;

## 🔷 Joshua — Testing + Contract Verification + Demo Prep

### Morning (9am – 1pm): Hardening
- [ ] Write full Foundry test suite — cover all milestone states and edge cases
- [ ] Run `forge test -vvv` — all passing
- [ ] Verify deployed contract on Sepolia Etherscan — judges can inspect it
- [ ] Stress test event listener — does it handle multiple agreements simultaneously?
- [ ] Fix any blockchain ↔ backend sync issues

### Afternoon (2pm – 6pm): SDK Docs + Demo Script
- [ ] Polish SDK README — installation, quickstart, full API reference
- [ ] Record or prepare a code walkthrough showing SDK usage
- [ ] Write the demo script — exact steps judges will follow
- [ ] Prepare Sepolia Etherscan links to show on-chain activity during demo
- [ ] Final end-to-end test of entire flow

### End of Day Checkpoint ✅
- Contract verified on Etherscan
- SDK README polished
- Demo script rehearsed

&nbsp;

## 🔶 Backend Dev — Deploy + Stabilise

### Morning (9am – 1pm): Deployment
- [ ] Deploy NestJS API to Railway or Render
- [ ] Set all environment variables — Interswitch sandbox keys, Sepolia RPC, wallet private key, JWT secret
- [ ] Point frontend to production API URL
- [ ] Run full flow against production — create agreement → pay → approve → disburse

### Afternoon (2pm – 6pm): Stability + Docs
- [ ] Handle edge cases — failed payments, duplicate webhook events, network errors
- [ ] Add request validation — `class-validator` on all DTOs
- [ ] Write basic API documentation — at minimum document the 5 core endpoints
- [ ] Add test credentials to submission README so judges can log in immediately
- [ ] Final Postman run through all endpoints

### End of Day Checkpoint ✅
- API live and stable on production URL
- Test credentials documented
- All endpoints returning correct responses

&nbsp;

## 🎨 Designer — Polish + Presentation Assets

### Morning (9am – 1pm): UI Polish
- [ ] Responsive design — make sure dashboard works on different screen sizes
- [ ] Loading states — skeleton loaders, button loading spinners
- [ ] Empty states — what shows when there are no agreements yet
- [ ] Success/error toast notifications
- [ ] Final Vercel deploy — confirm live URL works

### Afternoon (2pm – 6pm): Demo Assets
- [ ] Design a clean project banner / cover image for GitHub README
- [ ] Create a 1-page pitch slide — problem, solution, tech stack, demo link
- [ ] Screenshot the working product for the README
- [ ] Design the SDK npm package README header graphic
- [ ] Prepare any demo walkthrough visuals judges might need

### End of Day Checkpoint ✅
- Frontend polished and live
- GitHub README has banner, screenshots, demo link, test credentials
- Pitch slide ready for Demo Day

---

&nbsp;

# 🚀 Submission Checklist
- [ ] GitHub repo is public with commits from all team members
- [ ] Live frontend URL (Vercel)
- [ ] Live backend URL (Railway/Render)
- [ ] Contract address on Sepolia Etherscan
- [ ] SDK README with installation + quickstart
- [ ] Test credentials in README
- [ ] Demo video or walkthrough (optional but recommended)

---

# 🏗️ Architecture Summary

```
┌─────────────────┐         ┌──────────────────┐
│   Nerave SDK    │────────▶│   NestJS API     │
│  (TypeScript)   │  HTTP   │                  │
└─────────────────┘         │  ┌────────────┐  │
                            │  │ agreements │  │
┌─────────────────┐         │  │ payments   │  │
│  Next.js Demo   │────────▶│  │ blockchain │  │
│    Frontend     │  HTTP   │  │ webhooks   │  │
└─────────────────┘         │  └────────────┘  │
                            └────────┬─────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                 │
             ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
             │  PostgreSQL  │  │  Interswitch │  │   Sepolia   │
             │  (Supabase)  │  │   Sandbox    │  │   Testnet   │
             └─────────────┘  └─────────────┘  └─────────────┘
```

---

*Built for the Interswitch x Enyata Hackathon 2026 · March 23–26*
