"use client";

import { motion } from "framer-motion";

const steps = [
  { num: "01", title: "Define", desc: "Specify milestones and total payment amount" },
  { num: "02", title: "Lock", desc: "Funds secured trustlessly in a smart contract" },
  { num: "03", title: "Confirm", desc: "Mutual approval on delivery of work" },
  { num: "04", title: "Deploy", desc: "Automatic bank settlement via Interswitch" }
];

export function Steps() {
  return (
    <section className="px-6 lg:px-12 py-24 bg-gray-50 border-y border-gray-100 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl lg:text-5xl font-light mb-4 tracking-tight text-gray-900">Simple, yet powerful</motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-gray-600">From agreement to disbursement in four steps.</motion.p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="absolute top-[3rem] left-0 right-0 h-px bg-gray-200 hidden md:block" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-24 h-24 bg-white border border-gray-200 group-hover:border-[#7c3aed] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-300 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-sm">
                <span className="text-2xl font-light text-[#7c3aed]">{step.num}</span>
              </div>
              <h3 className="text-xl font-medium mb-2 text-gray-900">{step.title}</h3>
              <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
