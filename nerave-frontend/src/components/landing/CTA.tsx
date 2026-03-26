"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="px-6 lg:px-12 py-32 relative z-10 bg-white">
      <div className="max-w-4xl mx-auto text-center bg-white shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100 rounded-3xl p-12 lg:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3e8ff] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f3e8ff] blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-light mb-6 tracking-tight text-gray-900">Ready to build without trust issues?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">Join developers building trustworthy B2B platforms with Nerave's SDK and smart contracts.</p>
          <div className="flex justify-center">
            <Link href="/dashboard" className="px-8 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-[#7c3aed]/20">
              Get Started Free <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
