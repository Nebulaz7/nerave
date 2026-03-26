"use client";

import { motion } from "framer-motion";
import { GitBranch, Shield, Zap, Lock, Globe, FileCheck } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "On-Chain Lineage",
    desc: "Every milestone and confirmation includes immutable provenance records on Ethereum."
  },
  {
    icon: Shield,
    title: "Verifiable History",
    desc: "Complete audit trail of dataset transformations, generated contracts, and milestones stored."
  },
  {
    icon: Zap,
    title: "One-Click Disbursement",
    desc: "Deploy funds directly to bank accounts via Interswitch with automatic confirmation."
  },
  {
    icon: Lock,
    title: "Privacy-Preserving",
    desc: "Generate payments that maintain strict rules without relying on manual database updates."
  },
  {
    icon: Globe,
    title: "Decentralized Reach",
    desc: "Settle transactions in local currency while leveraging global blockchain infrastructure."
  },
  {
    icon: FileCheck,
    title: "Quality Metrics",
    desc: "Funds never move until both parties explicitly confirm satisfaction with deliveries."
  }
];

export function Features() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-light mb-4 tracking-tight text-gray-900">
            Everything you need for <span className="text-[#7c3aed] font-medium">trusted AI & escrow</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-gray-600 max-w-3xl mx-auto">
            From generation to deployment, every step is verified on-chain with complete transparency.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-2xl p-8 hover:shadow-lg transition-all group cursor-default"
            >
              <div className="w-12 h-12 bg-[#f3e8ff] rounded-xl flex items-center justify-center text-[#7c3aed] mb-6 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight text-gray-900">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
