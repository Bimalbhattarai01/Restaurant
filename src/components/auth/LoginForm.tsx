"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LoginFormProps {
  redirectTo?: string;
}

export default function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    router.prefetch(redirectTo || "/dashboard");
  }, [router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      toast.success("Welcome back");
      router.replace(redirectTo || "/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8 w-full space-y-6 border border-gray-100"
    >
      <div className="flex items-center justify-between text-sm text-gray-600">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold hover:text-[#BF1E2E]">
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>

      <h1 className="text-center text-2xl font-semibold text-gray-900">Login</h1>

 

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#BF1E2E]">
            <Mail size={18} className="text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder:text-gray-400"
              placeholder="example@email.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-[#BF1E2E]">
            <Lock size={18} className="text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-gray-700 placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-xs font-semibold text-gray-500 hover:text-[#BF1E2E] inline-flex items-center gap-1"
            >
              {showPassword ? (
                <>
                  <EyeOff size={16} /> Hide
                </>
              ) : (
                <>
                  <Eye size={16} /> Show
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#BF1E2E] text-white font-semibold py-3 rounded-xl hover:bg-[#A81826] disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>


    </form>
  );
}
