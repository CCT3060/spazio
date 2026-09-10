"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else if (res.status === 409) {
      setStatus("duplicate");
    } else {
      setStatus("error");
    }
  }

  return (
    <div>
      {status === "success" ? (
        <p className="text-sm text-[#b5964e]">Thank you for subscribing.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-0 max-w-sm">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 border border-[#e0d9cc] px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:border-[#b5964e] transition-colors placeholder:text-[#6b6b6b]"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-[#b5964e] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#9a7d3a] transition-colors disabled:opacity-60 whitespace-nowrap"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
      )}
      {status === "duplicate" && (
        <p className="text-xs text-[#6b6b6b] mt-1">You&apos;re already subscribed.</p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-500 mt-1">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
