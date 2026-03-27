"use client";

import { motion } from "framer-motion";
import { Copy, Check, Terminal, Shield, Cpu } from "lucide-react";
import { useState } from "react";

const CodeBlock = ({ code, language = "typescript" }: { code: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6">
      <div className="absolute flex items-center justify-between top-0 left-0 w-full px-4 py-2 bg-[#1a1b26] rounded-t-xl border-b border-gray-800">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button 
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="bg-[#111827] text-gray-300 p-4 pt-12 rounded-xl border border-gray-800 overflow-x-auto text-sm font-mono leading-relaxed shadow-lg">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function DocsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
    >
      <div className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">Nerave SDK Documentation</h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          The official Node.js / TypeScript SDK for Nerave. Build trustless milestone payments for your platform using our smart contracts and Interswitch automated disbursements.
        </p>
      </div>

      <section id="introduction" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Introduction</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Nerave solves the B2B trust deficit in Africa by ensuring contractors get paid when milestones are met, and buyers are protected if work isn't delivered. 
          The SDK allows you to embed this trust directly into your own marketplaces, SaaS, or freelance platforms without dealing with Web3 complexities.
        </p>
      </section>

      <section id="installation" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Installation</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Install the SDK via npm, yarn, or pnpm. The package includes built-in TypeScript definitions.
        </p>
        <CodeBlock language="bash" code="npm install nerave-sdk" />
      </section>

      <section id="authentication" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Authentication</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          You must initialize the SDK with your Secret API Key. You can pass it directly or let the SDK auto-load it from your `.env` file via <code className="bg-gray-100 text-[#7c3aed] px-1.5 py-0.5 rounded text-sm font-mono">NERAVE_API_KEY</code>.
        </p>
        <CodeBlock language="typescript" code={`import { Nerave } from 'nerave-sdk';
import 'dotenv/config';

// Option 1: Implicitly loads process.env.NERAVE_API_KEY
const nerave = new Nerave({});

// Option 2: Explicit initialization
const nerave = new Nerave({
  apiKey: 'pk_test_your_secret_key',
  // baseUrl: 'http://localhost:5000' // Optional target URL
});`} />
      </section>

      <hr className="border-gray-200 my-16" />

      <section id="agreements" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Agreements</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Agreements are the core entity. When you create an agreement, a secure smart escrow contract is instantly deployed on the Ethereum blockchain behind the scenes.
        </p>
        <h3 className="text-lg font-medium text-gray-900 mb-2 mt-8">Creating an Agreement</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          Define the total transaction amount and split it across deliverables (milestones).
        </p>
        <CodeBlock language="typescript" code={`const agreement = await nerave.agreements.create({
  contractorId: 'uuid-of-developer',
  totalAmount: 1000,
  milestones: [
    { title: 'UX Research & Wireframing', amount: 300 },
    { title: 'Frontend Development', amount: 700 }
  ]
});

console.log(agreement.data.id); // e.g., "AGR-1092"`} />
        
        <h3 className="text-lg font-medium text-gray-900 mb-2 mt-8">Checking Agreement Status</h3>
        <p className="text-gray-600 leading-relaxed">
          Poll the agreement to sync the local state with the on-chain data.
        </p>
        <CodeBlock language="typescript" code={`const state = await nerave.agreements.getStatus("AGR-1092");

console.log(state.totalAmount); 
console.log(state.milestones[0].disbursed); // false (pending)`} />
      </section>

      <section id="milestones" className="mb-16 scroll-mt-24">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-6 h-6 text-[#7c3aed]" />
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Milestones & Payouts</h2>
        </div>
        <p className="text-gray-600 leading-relaxed mb-4">
          Funds are only unlocked and disbursed to the contractor's Interswitch account when milestones are mutually confirmed.
        </p>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2 mt-8">Confirming a Milestone</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          As a standard B2B transaction requires mutual consent, both the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-700">CLIENT</code> and the <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-700">CONTRACTOR</code> must hit this endpoint. Upon the second confirmation, Nerave automatically routes the funds via Interswitch.
        </p>

        <CodeBlock language="typescript" code={`// The client signs off on the "UX Research" milestone
await nerave.milestones.confirm({
  agreementId: "AGR-1092",
  milestoneId: 0, // Array index of the milestone
  role: 'CLIENT'
});

// Once the contractor also calls confirm(..., role: 'CONTRACTOR'),
// the Smart Contract instantly releases funds to Interswitch.`} />
      </section>

    </motion.div>
  );
}
