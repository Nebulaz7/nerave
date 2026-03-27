"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  Key,
  FileSignature,
  Webhook,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("nerave_token");
    if (!token) {
      router.push("/signin");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("nerave_token");
    localStorage.removeItem("nerave_api_key");
    router.push("/");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f6f6]">
        <Loader2 className="w-6 h-6 animate-spin text-[#7c3aed]" />
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
  ];

  return (
    <div className="flex h-screen bg-[#f7f6f6] text-[#09090b] font-sans overflow-hidden selection:bg-[#7c3aed]/20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-[#7c3aed]/50 transition-colors">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
            </div>
            <span className="font-semibold tracking-tight text-gray-900">
              Nerave
            </span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) && link.href !== "/dashboard");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-[#f3e8ff] text-[#7c3aed]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <link.icon
                  className={`w-4 h-4 ${isActive ? "text-[#7c3aed]" : "text-gray-400"}`}
                />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f7f6f6] noise-texture relative">
        <div className="h-16 flex items-center justify-end px-8 border-b border-gray-200/50 bg-white/50 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <a
              href="#docs"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Documentation
            </a>
            <div className="w-8 h-8 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7c3aed] font-medium border border-[#e9d5ff]">
              U
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative z-0">
          {children}
        </div>
      </main>
    </div>
  );
}
