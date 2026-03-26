"use client";

import { motion } from "framer-motion";
import { Database, Clock, Network, GitBranch, Shield, CheckCircle2 } from "lucide-react";

export function Transparency() {
  return (
    <section className="px-6 lg:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 glass-card rounded-2xl p-8 border border-white/5 shadow-xl bg-[#0a0a0a]">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-white/80">Agreement ID</span>
                </div>
                <span className="text-sm font-mono text-white/60">agm_f92e...3b1</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-white/80">Deployed At</span>
                </div>
                <span className="text-sm font-mono text-white/60">2026-06-15 14:32 UTC</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Network className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-white/80">Contract Address</span>
                </div>
                <span className="text-sm font-mono text-white/60">0xc129...753e</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-white/80">Milestone State</span>
                </div>
                <span className="text-sm font-mono text-white/60">2/2 Approved</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-[#050505] rounded-lg border border-white/5">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-white/80">Verification</span>
                </div>
                <span className="text-sm font-mono text-green-400">On-chain verified ✓</span>
              </div>
              <button className="w-full mt-4 py-3 bg-[#7c3aed]/10 text-[#7c3aed] font-medium rounded-lg hover:bg-[#7c3aed]/20 transition-colors">
                View on Sepolia Etherscan →
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight">Complete transparency,<br/><span className="text-[#7c3aed] font-medium">immutable history</span></h2>
            <p className="text-xl text-white/60 mb-8 leading-relaxed">Every agreement and payment is securely recorded on Ethereum. Track the complete lineage from milestone creation to final Interswitch disbursement.</p>
            
            <ul className="space-y-4">
              {[
                "View exact parameters of the smart contract",
                "Track all approvals and timestamps",
                "Verify funds are safely locked before starting work",
                "Ensure indisputable audit readiness for disputes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#7c3aed] mt-0.5 shrink-0" />
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
