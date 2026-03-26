# Nerave SDK

[![npm version](https://img.shields.io/npm/v/nerave-sdk.svg)](https://npmjs.org/package/nerave-sdk)

The official TypeScript SDK for Nerave — the nerve center of trust. Build trustless milestone payments for your platform using our smart contracts and Interswitch integration.

## Installation

```bash
npm install nerave-sdk
```

## Quickstart

```typescript
import { Nerave } from 'nerave-sdk';

// 1. Initialize the client
const nerave = new Nerave({
  apiKey: 'pk_test_your_api_key_here',
  // baseUrl: 'http://localhost:3000' // Uncomment to point to a local backend
});

// 2. Create a new agreement
const agreement = await nerave.agreements.create({
  contractorId: 'user_123',
  totalAmount: 1000,
  milestones: [
    { title: 'Design Phase', amount: 300 },
    { title: 'Development Phase', amount: 700 }
  ]
});

// 3. Confirm a milestone
await nerave.milestones.confirm({
  agreementId: agreement.data.id,
  milestoneId: 0,
  role: 'CLIENT' // Both CLIENT and CONTRACTOR must confirm
});

// 4. Check agreement state
const state = await nerave.agreements.getStatus(agreement.data.id);
console.log(state.milestones[0].disbursed); // true if both confirmed
```

## Environment Variables

You can load your API key from `.env` instead of hardcoding it.

```env
NERAVE_API_KEY=pk_test_your_api_key_here
```

```typescript
import { Nerave } from 'nerave-sdk';
import 'dotenv/config';

const nerave = new Nerave({
  // Reads process.env.NERAVE_API_KEY
  baseUrl: 'http://localhost:5000',
});
```

You can also use a custom env var name:

```typescript
const nerave = new Nerave({
  apiKeyEnvVar: 'MY_CUSTOM_NERAVE_KEY',
  baseUrl: 'http://localhost:5000',
});
```

## TypeScript Types
The SDK exports full typescript types defining interfaces for `CreateAgreementParams`, `ConfirmMilestoneParams`, `AgreementState`, etc.
