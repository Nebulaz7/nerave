"use client";

import Link from "next/link";
import {
  Sparkles,
  Book,
  Code2,
  ShieldAlert,
  Cpu,
  Home,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = [
    {
      title: "Navigation",
      links: [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Getting Started",
      links: [
        { name: "Introduction", href: "#introduction", icon: Book },
        { name: "Installation", href: "#installation", icon: Code2 },
        { name: "Authentication", href: "#authentication", icon: ShieldAlert },
      ],
    },
    {
      title: "Core Concepts",
      links: [
        { name: "Agreements", href: "#agreements", icon: Cpu },
        { name: "Milestones", href: "#milestones", icon: Cpu },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans selection:bg-[#7c3aed]/20">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-gray-50/50 sticky top-0 h-screen overflow-y-auto">
        <div className="h-16 flex items-center px-6 border-b border-gray-200/50 bg-white">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/nerave-logo.svg"
                alt="Nerave Logo"
                width={32}
                height={32}
              />
            </div>
            <span className="font-semibold tracking-tight text-gray-900">
              Nerave Docs
            </span>
          </Link>
        </div>

        <div className="flex-1 py-8 px-5">
          {sections.map((section, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.links.map((link) => {
                  const isInternalRoute = link.href.startsWith("/");
                  const LinkComponent = isInternalRoute ? Link : "a";

                  return (
                    <li key={link.name}>
                      <LinkComponent
                        href={link.href}
                        className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <link.icon className="w-4 h-4 text-gray-400" />
                        {link.name}
                      </LinkComponent>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="h-16 flex md:hidden items-center px-6 border-b border-gray-200 bg-white sticky top-0 z-20">
          <Link href="/" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-[#7c3aed]" />
            <span className="font-semibold tracking-tight text-gray-900">
              Nerave Docs
            </span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 lg:px-12">{children}</div>
      </main>
    </div>
  );
}
