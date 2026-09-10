"use client";

import { useState } from "react";

type State = "idle" | "loading" | "success" | "error";

const inputCls = "w-full border border-[#e0d9cc] px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#b5964e] transition-colors placeholder:text-[#b0a898]";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setState(res.ok ? "success" : "error");
  }

  if (state === "success") {
    return (
      <div className="bg-[#f5f0e8] border border-[#e0d9cc] p-8 text-center">
        <div className="w-10 h-10 rounded-full bg-[#b5964e] flex items-center justify-center mx-auto mb-4">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9L7 13L15 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Thank You</h3>
        <p className="text-sm text-[#6b6b6b]">Your message has been received. A member of our team will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Name *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} required placeholder="Your name" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Email *</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required placeholder="your@email.com" className={inputCls} />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Phone</label>
        <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
      </div>
      <div>
        <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Message *</label>
        <textarea value={form.message} onChange={(e) => set("message", e.target.value)} required rows={6} placeholder="Tell us how we can help…" className={`${inputCls} resize-none`} />
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button type="submit" disabled={state === "loading"} className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
        {state === "loading" ? "Sending…" : "Send Message"}
      </button>

      <p className="text-xs text-[#6b6b6b] text-center">
        We typically respond within 1–2 business days.
      </p>
    </form>
  );
}
