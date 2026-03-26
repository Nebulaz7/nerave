"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Database,
  Network,
  Server,
  GitBranch,
  Lock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-6 lg:px-12 pt-24 pb-16 bg-[#f7f6f6] overflow-hidden">
      <div className="absolute inset-0 bg-[#f7f6f6] noise-texture pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-12 xl:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f3e8ff] text-[#7c3aed] rounded-full text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Built on Interswitch</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-6xl font-light leading-tight mb-6 text-gray-900 tracking-tight"
          >
            Trustless payments with
            <span className="bg-[#f3e8ff] px-2 relative inline-block text-[#7c3aed] rounded">
              smart escrow
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg"
          >
            Generate verifiable agreements, lock funds safely, and disburse
            automatically via Interswitch upon milestone confirmation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md shadow-[#7c3aed]/20"
            >
              Start Building
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <a
              href="#docs"
              className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm"
            >
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
              <div className="text-3xl font-light text-gray-900 mb-1">100%</div>
              <div className="text-sm text-gray-500">On-Chain Verified</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                99.9%
              </div>
              <div className="text-sm text-gray-500">Uptime Guarantee</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div>
              <div className="text-3xl font-light text-gray-900 mb-1">
                &lt;1s
              </div>
              <div className="text-sm text-gray-500">Disbursement</div>
            </div>
          </motion.div>
        </div>

        <div className="hidden xl:block lg:col-span-6 relative h-[600px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Central Node */}
            <div className="relative z-10 w-28 h-28 bg-white rounded-3xl shadow-[0_8px_30px_rgb(124,58,237,0.12)] border border-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#7c3aed] rounded-3xl blur-2xl opacity-20 transform scale-150"></div>
              <Sparkles className="w-10 h-10 text-[#7c3aed] relative z-20" />
            </div>

            {/* Orbiting Nodes */}
            {[
              { icon: Shield, angle: 0 },
              { icon: Database, angle: 60 },
              { icon: Server, angle: 120 },
              { icon: GitBranch, angle: 180 },
              { icon: Lock, angle: 240 },
              { icon: Network, angle: 300 },
            ].map((node, i) => {
              const radius = 160;
              const angleRad = (node.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;

              return (
                <div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  {/* Dashed line connecting to center */}
                  <div
                    className="absolute border-b-2 border-dashed border-[#7c3aed]/20 w-[160px]"
                    style={{
                      transformOrigin: "left center",
                      transform: `rotate(${node.angle}deg)`,
                    }}
                  />
                  {/* Node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      duration: 0.5,
                      type: "spring",
                    }}
                    className="absolute w-12 h-12 rounded-full bg-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.4)] border-2 border-white flex items-center justify-center pointer-events-auto"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <node.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
