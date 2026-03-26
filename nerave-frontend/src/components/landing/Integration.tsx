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
        { title: "Frontend", amount: 500000 },
        { title: "Backend", amount: 500000 }
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
    <section className="px-6 lg:px-12 py-24 bg-[#f7f6f6] text-black border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight">
              Integrate in minutes
            </h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">
              Native SDK for TypeScript. Direct integration with Interswitch,
              automatic smart contract deployment, and seamless payment
              execution.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-white/80">
                  Automatic smart contract deployment
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-white/80">
                  Complete milestone tracking on Sepolia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#7c3aed]" />
                <span className="text-white/80">
                  SDK wrapper for seamless backend usage
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-medium flex items-center gap-2 transition-colors">
                <Play className="w-4 h-4" /> Try in Dashboard
              </button>
              <button className="px-6 py-3 glass-card rounded-lg font-medium hover:bg-white/5 border border-white/10 transition-colors flex items-center gap-2 text-white/80">
                <Terminal className="w-4 h-4" /> View Docs
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-[#050505] border border-white/10 rounded-xl p-6 overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full"></div>
                <div className="w-3 h-3 bg-white/20 rounded-full"></div>
              </div>
              <span className="ml-4 text-white/40 text-sm font-mono tracking-tight">
                TypeScript Example
              </span>
            </div>
            <pre className="text-[13px] leading-relaxed font-mono text-white/70 overflow-x-auto whitespace-pre">
              <code>{codeSnippet}</code>
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
