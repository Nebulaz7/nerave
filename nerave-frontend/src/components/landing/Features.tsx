"use client";

import { motion } from "framer-motion";
import { GitBranch, Shield, Zap, Lock, Globe, FileCheck } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "On-Chain Agreement Lineage",
    desc: "Every milestone and confirmation includes immutable provenance records on Ethereum."
  },
  {
    icon: Shield,
    title: "Verifiable Escrow History",
    desc: "Complete audit trail of total funds, generated contracts, and milestones stored permanently."
  },
  {
    icon: Zap,
    title: "One-Click Disbursement",
    desc: "Deploy funds directly to bank accounts via Interswitch with automatic confirmation."
  },
  {
    icon: Lock,
    title: "Trustless Enforcement",
    desc: "Generate payments that maintain strict rules without relying on manual database updates."
  },
  {
    icon: Globe,
    title: "Pan-African Reach",
    desc: "Settle transactions in local currency while leveraging global blockchain infrastructure."
  },
  {
    icon: FileCheck,
    title: "Quality Guarantees",
    desc: "Funds never move until both parties explicitly confirm satisfaction with deliveries."
  }
];

export function Features() {
  return (
    <section className="px-6 lg:px-12 py-24 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-light mb-4 tracking-tight">Everything you need for <span className="text-[#7c3aed] font-medium">trusted escrow</span></motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-white/60 max-w-3xl mx-auto">From scope definition to final disbursement, every step is verified on-chain with complete transparency.</motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-2xl p-8 hover:border-[#7c3aed]/50 transition-colors group cursor-default"
            >
              <div className="w-12 h-12 bg-[#7c3aed] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight">{f.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
