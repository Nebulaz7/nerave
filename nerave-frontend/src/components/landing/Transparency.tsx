"use client";

import { motion } from "framer-motion";
import { Database, Clock, Network, GitBranch, Shield, CheckCircle2 } from "lucide-react";

export function Transparency() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 lg:order-1 bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-gray-700">Agreement ID</span>
                </div>
                <span className="text-sm font-mono text-gray-900">agm_f92e...3b1</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-gray-700">Deployed At</span>
                </div>
                <span className="text-sm font-mono text-gray-900">2026-06-15 14:32 UTC</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Network className="w-5 h-5 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-gray-700">Contract Address</span>
                </div>
                <span className="text-sm font-mono text-gray-900">0xc129...753e</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <GitBranch className="w-5 h-5 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-gray-700">Milestone State</span>
                </div>
                <span className="text-sm font-mono text-gray-900">2/2 Approved</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#7c3aed]" />
                  <span className="text-sm font-medium text-gray-700">Verification</span>
                </div>
                <span className="text-sm font-mono text-green-600">On-chain verified ✓</span>
              </div>
              <button className="w-full mt-4 py-3 bg-[#f3e8ff] text-[#7c3aed] font-medium rounded-lg hover:bg-[#e9d5ff] transition-colors">
                View on Sepolia Etherscan →
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
            <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight text-gray-900">Complete transparency,<br/><span className="text-[#7c3aed] font-medium">immutable history</span></h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">Every agreement and payment is securely recorded on Ethereum. Track the complete lineage from milestone creation to final Interswitch disbursement.</p>
            
            <ul className="space-y-4">
              {[
                "View exact parameters of the smart contract",
                "Track all approvals and timestamps",
                "Verify funds are safely locked before starting work",
                "Ensure indisputable audit readiness for disputes"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
