"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-6 lg:px-12 pt-20">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-12 xl:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full text-sm font-medium mb-8 border border-[#7c3aed]/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Powered by Interswitch & Ethereum</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-light leading-tight mb-6 tracking-tight"
          >
            Trustless B2B payments with <span className="text-[#7c3aed] font-medium">smart escrow</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 leading-relaxed mb-8 max-w-2xl"
          >
            A contractor in Lagos completed a ₦1 million project and got paid automatically the moment the client clicked approve — no calls, no delays, no broken promises.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link href="/dashboard" className="px-8 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] rounded-lg font-medium flex items-center gap-2 transition-colors">
              Start Building 
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a href="#docs" className="px-8 py-4 glass-card rounded-lg font-medium hover:bg-white/5 transition-colors">
              View Documentation
            </a>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-8"
          >
            <div>
              <div className="text-3xl font-light mb-1">100%</div>
              <div className="text-sm text-white/50">On-Chain Verified</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div>
              <div className="text-3xl font-light mb-1">₦0</div>
              <div className="text-sm text-white/50">Middleman Fees</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div>
              <div className="text-3xl font-light mb-1">&lt;1s</div>
              <div className="text-sm text-white/50">Disbursement</div>
            </div>
          </motion.div>
        </div>
        
        <div className="hidden xl:block lg:col-span-5 relative h-[500px]">
           <div className="absolute inset-0 flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4, duration: 0.5 }}
               className="w-full h-full border border-white/10 rounded-2xl bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#7c3aed]"></div>
                
                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-mono text-white/40 text-sm">PayLockAgreement.sol</span>
                    <span className="px-2 py-1 bg-[#7c3aed]/20 text-[#7c3aed] text-xs font-mono rounded border border-[#7c3aed]/30">Deployed</span>
                  </div>
                  
                  <div className="space-y-2 font-mono text-sm leading-relaxed">
                    <div className="text-white/70"><span className="text-[#a78bfa]">function</span> <span className="text-white">confirmMilestone</span>() <span className="text-[#a78bfa]">external</span> {'{'}</div>
                    <div className="pl-4 text-white/50">require(isClient || isContractor);</div>
                    <div className="pl-4 text-white/50">milestone.approvals++;</div>
                    <div className="pl-4 text-white/50 mt-2">if (milestone.isApproved) {'{'}</div>
                    <div className="pl-8 text-[#7c3aed] flex items-center gap-2">
                      <ArrowUpRight className="w-3 h-3" />
                      releaseFunds(Interswitch);
                    </div>
                    <div className="pl-4 text-white/50">{'}'}</div>
                    <div className="text-white/70">{'}'}</div>
                  </div>
                </div>
             </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
}
