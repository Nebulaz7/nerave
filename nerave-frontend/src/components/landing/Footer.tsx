"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-6 lg:px-12 py-12 border-t border-gray-200 bg-white relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-medium tracking-tight text-gray-900">
              Nerave
            </span>
            <p className="text-sm text-gray-500 mt-2">
              The trustless escrow platform for African B2B.
            </p>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <Link
              href="/docs"
              className="hover:text-gray-900 transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com"
              className="hover:text-gray-900 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Nerave. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
