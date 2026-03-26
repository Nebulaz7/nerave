"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="px-6 lg:px-12 py-32 relative z-10">
      <div className="max-w-4xl mx-auto text-center glass-card border border-white/5 shadow-2xl rounded-3xl p-12 lg:p-16 relative overflow-hidden bg-[#050505]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight">Ready to build without trust issues?</h2>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">Join developers building trustworthy B2B platforms with Nerave's API and smart contracts.</p>
          <div className="flex justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-medium flex items-center gap-2 transition-colors">
              Get Started Free <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
