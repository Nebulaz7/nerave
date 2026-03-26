"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Play, Terminal } from "lucide-react";

const codeSnippet = `import { Nerave } from 'nerave-sdk';

// Initialize Nerave client
const client = new Nerave({ apiKey: "your_api_key" });

// Generate agreement with on-chain provenance
const agreement = await client.agreements.create({
    contractorId: "user_contractor_123",
    totalAmount: 1000000,
    milestones: [
        { title: "Frontend", amount: 500000 }
    ],
    verify_on_chain: true
});

// Confirm milestone -> triggers Interswitch payout
await client.milestones.confirm({
    agreementId: agreement.data.id,
    milestoneId: 0,
    role: "CLIENT"
});`;

export function Integration() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-gray-50 border-y border-gray-100 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight text-gray-900">Integrate in minutes</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Native SDK for TypeScript. Direct integration with Interswitch, automatic smart contract deployment, and seamless payment execution.</p>
            
            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Automatic smart contract deployment</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Complete tracking on Sepolia blockchain</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">One-line Interswitch integration</span>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <button className="px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-medium flex items-center gap-2 transition-colors text-white">
                <Play className="w-4 h-4" /> Try in Playground
              </button>
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700">
                <Terminal className="w-4 h-4" /> View Docs
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative bg-[#111827] border border-gray-800 rounded-xl p-6 overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-400 text-sm font-mono tracking-tight">TypeScript Example</span>
            </div>
            <pre className="text-[13px] leading-relaxed font-mono text-gray-300 overflow-x-auto whitespace-pre">
              <code>{codeSnippet}</code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
