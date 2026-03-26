"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-6 lg:px-12 py-5 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Flat logo text */}
          <span className="text-xl font-medium tracking-tight">Nerave</span>
        </div>
        <div className="hidden lg:flex items-center gap-6">
          <a href="#docs" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
            View Documentation
          </a>
          <Link href="/dashboard" className="px-5 py-2.5 text-sm font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-lg flex items-center gap-2 transition-colors">
            Start Building
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <button className="lg:hidden text-white/80 p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#050505] border-t border-white/5 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              <a href="#docs" className="p-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setOpen(false)}>
                View Documentation
              </a>
              <Link href="/dashboard" className="p-3 bg-[#7c3aed] text-white text-center rounded-lg mt-2 font-medium">
                Start Building
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
