"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Copy, Check, Eye, EyeOff, Terminal, ShieldAlert } from "lucide-react";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Read the key passed down from the backend login/register
    const stored = localStorage.getItem("nerave_api_key");
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hiddenKey = apiKey 
    ? apiKey.substring(0, 8) + "•".repeat(apiKey.length - 8)
    : "pk_test_••••••••••••••••••••••••••••••••";

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 mb-2">API Keys</h1>
        <p className="text-gray-500">Manage your secret keys for authenticating with the Nerave API.</p>
      </div>

      <div className="space-y-8">
        {/* API Key Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f3e8ff] flex items-center justify-center text-[#7c3aed]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Standard Secret Key</h2>
              <p className="text-sm text-gray-500">Use this to authenticate requests on your backend.</p>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50">
             <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    readOnly 
                    value={isVisible ? apiKey : hiddenKey} 
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 font-mono text-sm focus:outline-none shadow-sm"
                  />
                  <button 
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                    title={isVisible ? "Hide Key" : "Reveal Key"}
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-medium transition-colors shadow-sm flex items-center justify-center gap-2 min-w-[120px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Key
                    </>
                  )}
                </button>
             </div>
             
             <div className="mt-4 flex items-start gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100 text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p><strong>Keep your key secure.</strong> Do not expose this key in client-side code (like React, Vue, or native apps). Only use it on your backend servers.</p>
             </div>
          </div>
        </motion.div>

        {/* Quick Start Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-5 h-5 text-gray-900" />
            <h2 className="text-xl font-medium text-gray-900 tracking-tight">Quick Start</h2>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">1. Install the SDK</h3>
              <div className="bg-[#111827] rounded-xl p-4 flex items-center justify-between border border-gray-800">
                <code className="text-green-400 font-mono text-sm">npm install nerave-sdk</code>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">2. Initialize on your backend</h3>
              <div className="bg-[#111827] rounded-xl p-4 border border-gray-800 overflow-x-auto">
                <pre className="text-gray-300 font-mono text-sm leading-relaxed">
                  <span className="text-[#c678dd]">import</span> {'{'} Nerave {'}'} <span className="text-[#c678dd]">from</span> <span className="text-[#98c379]">'nerave-sdk'</span>;
                  <br /><br />
                  <span className="text-[#56b6c2]">const</span> <span className="text-[#e5c07b]">nerave</span> = <span className="text-[#c678dd]">new</span> <span className="text-[#e5c07b]">Nerave</span>({'{'}
                  <br />
                  {'  '}<span className="text-[#d19a66]">apiKey</span>: <span className="text-[#98c379]">'{(isVisible && apiKey) ? apiKey : "pk_test_..."}'</span>,
                  <br />
                  {'}'});
                  <br /><br />
                  <span className="text-[#7f848e]">// Ready to create agreements and disburse funds!</span>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
