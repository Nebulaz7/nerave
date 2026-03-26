"use client";

import { motion } from "framer-motion";
import { Laptop, Building2, Store, Users } from "lucide-react";

export function UseCases() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-[#0a0a0a] border-y border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-light mb-4 tracking-tight">Applicable to innovators across industries</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-white/60">See how platforms integrate trustless escrow infrastructure.</motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-[#050505] border border-white/5 rounded-2xl p-8 text-center group hover:border-[#7c3aed]/50 transition-colors cursor-default">
            <div className="flex justify-center mb-4 text-[#7c3aed]">
              <Laptop className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Freelance Platforms</h3>
            <p className="text-white/50 text-sm">Automate milestone payouts for remote contractors reliably.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-[#050505] border border-white/5 rounded-2xl p-8 text-center group hover:border-[#7c3aed]/50 transition-colors cursor-default">
            <div className="flex justify-center mb-4 text-[#7c3aed]">
              <Building2 className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">B2B Agencies</h3>
            <p className="text-white/50 text-sm">Secure high-ticket client payments upfront before work begins.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#050505] border border-white/5 rounded-2xl p-8 text-center group hover:border-[#7c3aed]/50 transition-colors cursor-default">
            <div className="flex justify-center mb-4 text-[#7c3aed]">
              <Store className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Marketplaces</h3>
            <p className="text-white/50 text-sm">Hold merchant funds safely until buyer confirmation is received.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-[#050505] border border-white/5 rounded-2xl p-8 text-center group hover:border-[#7c3aed]/50 transition-colors cursor-default">
            <div className="flex justify-center mb-4 text-[#7c3aed]">
              <Users className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h3 className="text-lg font-semibold mb-2">DAOs & Web3</h3>
            <p className="text-white/50 text-sm">Trustless grant disbursements to community contributors.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
