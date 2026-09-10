"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-semibold tracking-wide"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Spazio
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1 tracking-widest uppercase">
            Admin Panel
          </p>
        </div>

        <div className="bg-white shadow-sm border border-[#e0d9cc] p-8">
          <h2
            className="text-xl font-medium mb-6"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sign In
          </h2>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#e0d9cc] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5964e] transition-colors"
                placeholder="admin@farnichare.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#e0d9cc] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5964e] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white py-3 text-xs font-medium uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
