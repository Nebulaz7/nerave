"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          businessName,
          password,
          role: "CLIENT", // Defaulting to CLIENT for now
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message ||
            "Registration failed. Email may already be in use.",
        );
      }

      const data = await res.json();

      if (data.apiKey) {
        localStorage.setItem("nerave_api_key", data.apiKey);
      }

      setSuccess(true);

      // Auto redirect to signin after 2 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen noise-texture font-sans bg-[#f7f6f6] text-[#09090b] selection:bg-[#7c3aed]/20 flex items-center justify-center p-6">
      {/* Background Graphic Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f3e8ff] blur-[120px] pointer-events-none rounded-full mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f3e8ff] blur-[120px] pointer-events-none rounded-full mix-blend-multiply" />

      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 group z-20"
      >
        <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:border-[#7c3aed]/50 transition-colors">
          {/* logo */}
          {/* <Sparkles className="w-4 h-4 text-[#7c3aed]" /> */}
        </div>
        <span className="font-medium tracking-tight text-gray-900">Nerave</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-sm text-gray-500">
              Join Nerave to start generating trustless escrow.
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="businessName"
              >
                Business or Full Name
              </label>
              <input
                id="businessName"
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all text-sm"
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="email"
              >
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all text-sm"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1.5"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] transition-all text-sm font-mono tracking-widest"
                placeholder="••••••••"
                minLength={8}
              />
              <p className="text-xs text-gray-400 mt-2">
                Must be at least 8 characters long.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 text-center"
              >
                Account created successfully! Redirecting...
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-4 cursor-pointer bg-gray-900 hover:bg-black text-white rounded-xl py-3.5 px-4 font-medium flex items-center justify-center gap-2 transition-all shadow-md shadow-gray-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : success ? (
                "Redirecting..."
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#7c3aed] hover:text-[#6d28d9] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
