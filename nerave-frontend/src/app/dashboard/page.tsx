"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Key, BookOpen } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="max-w-6xl w-full">
      <div className="flex flex-col justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-1">
            Overview
          </h1>
          <p className="text-gray-500">
            Welcome to Nerave. Get started by integrating our escrow SDK.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 relative overflow-hidden group hover:border-[#7c3aed]/30 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center border border-[#e9d5ff] mb-6 group-hover:bg-[#7c3aed] transition-colors">
            <Key className="w-6 h-6 text-[#7c3aed] group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Get API Keys
          </h2>
          <p className="text-gray-500 mb-6">
            Generate and manage your API keys to authenticate requests from your
            application to the Nerave network.
          </p>
          <Link
            href="/dashboard/keys"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors shadow-sm w-fit"
          >
            Manage Keys <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-6 text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed] rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity" />
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 mb-6 backdrop-blur-sm">
            <BookOpen className="w-6 h-6 text-[#e9d5ff]" />
          </div>
          <h2 className="text-xl font-semibold mb-2 relative z-10">
            Read SDK Docs
          </h2>
          <p className="text-gray-400 mb-6 relative z-10">
            Explore the Nerave SDK reference. Learn how to generate trustless
            agreements and automate disbursements.
          </p>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white border border-[#6d28d9] rounded-xl font-medium text-sm hover:bg-[#6d28d9] transition-colors shadow-md shadow-[#7c3aed]/20 w-fit relative z-10"
          >
            View Documentation <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
