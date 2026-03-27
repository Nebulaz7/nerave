"use client";

import { motion } from "framer-motion";
import { 
  ArrowUpRight, 
  Wallet, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const stats = [
    {
      title: "Active Escrows",
      value: "12",
      change: "+2.5%",
      icon: Activity,
      trend: "up"
    },
    {
      title: "Total Volume",
      value: "$45,200",
      change: "+14%",
      icon: Wallet,
      trend: "up"
    },
    {
      title: "Pending Milestones",
      value: "8",
      change: "-5%",
      icon: Clock,
      trend: "down"
    },
    {
      title: "Completed Payouts",
      value: "156",
      change: "+22%",
      icon: CheckCircle2,
      trend: "up"
    }
  ];

  const recentAgreements = [
    { id: "AGR-1092", title: "Website Redesign", contractor: "Studio Design", amount: "$4,500", status: "In Progress", date: "Oct 24, 2026" },
    { id: "AGR-1091", title: "Mobile App MVP", contractor: "TechFlow Ltd", amount: "$12,000", status: "Pending", date: "Oct 22, 2026" },
    { id: "AGR-1090", title: "Smart Contract Audit", contractor: "0xSecurity", amount: "$8,000", status: "Completed", date: "Oct 15, 2026" },
    { id: "AGR-1089", title: "Marketing Assets", contractor: "Creative Inc", amount: "$2,200", status: "Completed", date: "Oct 12, 2026" },
  ];

  return (
    <div className="max-w-6xl w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-1">Overview</h1>
          <p className="text-gray-500">Welcome back. Here's what's happening with your escrow agreements.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/dashboard/keys" 
            className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            Get API Key
          </Link>
          <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-xl font-medium text-sm hover:bg-[#6d28d9] transition-colors shadow-md shadow-[#7c3aed]/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Agreement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-[#f3e8ff] transition-colors">
                <stat.icon className="w-5 h-5 text-gray-500 group-hover:text-[#7c3aed] transition-colors" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">{stat.title}</h3>
              <p className="text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Recent Agreements</h2>
            <button className="text-sm font-medium text-[#7c3aed] hover:text-[#6d28d9] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="p-4 font-medium">Agreement ID</th>
                  <th className="p-4 font-medium">Title</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentAgreements.map((agr) => (
                  <tr key={agr.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="p-4 font-medium text-gray-900">{agr.id}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 group-hover:text-[#7c3aed] transition-colors">{agr.title}</div>
                      <div className="text-xs text-gray-500">{agr.contractor}</div>
                    </td>
                    <td className="p-4 font-mono">{agr.amount}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        agr.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                        agr.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                        'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {agr.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">{agr.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#7c3aed] rounded-full blur-[80px] opacity-20 pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-lg font-semibold mb-2 relative z-10">Start Integrating</h2>
          <p className="text-gray-400 text-sm mb-6 relative z-10">
            Generate trustless agreements and automate disbursements in your app using the Nerave SDK.
          </p>

          <div className="space-y-4 relative z-10">
            <Link href="/dashboard/keys" className="block w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white group-hover:text-[#e9d5ff]">Get API Keys</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#e9d5ff]" />
              </div>
              <p className="text-xs text-gray-400">Authenticate your requests</p>
            </Link>

            <a href="#docs" className="block w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white group-hover:text-[#e9d5ff]">Read Docs</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#e9d5ff]" />
              </div>
              <p className="text-xs text-gray-400">Explore the SDK reference</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
