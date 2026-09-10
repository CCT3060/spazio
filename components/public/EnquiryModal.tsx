"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  productSku?: string;
}

export default function EnquiryModal({ isOpen, onClose, productName, productSku }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Reset on open
  useEffect(() => {
    if (isOpen) setStatus("idle");
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, productName, productSku }),
    });
    setStatus(res.ok ? "success" : "error");
  }

  if (!isOpen) return null;

  const inputCls =
    "w-full border border-[#e0d9cc] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-lg shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#e0d9cc]">
          <div>
            <h2
              className="text-xl font-semibold text-[#1a1a1a]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Enquire About This Item
            </h2>
            {productName && (
              <p className="text-sm text-[#6b6b6b] mt-0.5">
                {productName}
                {productSku && <span className="ml-2 font-mono">#{productSku}</span>}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Thank You
              </h3>
              <p className="text-sm text-[#6b6b6b] mb-6">
                Your enquiry has been received. We&apos;ll be in touch within one business day.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#1a1a1a] text-white text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                    Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className={inputCls + " resize-none"}
                  placeholder="Tell us about your project, timeline, or any questions…"
                />
              </div>

              {status === "error" && (
                <p className="text-sm text-red-500">
                  Something went wrong. Please try again.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#1a1a1a] text-white py-3 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send Enquiry"}
              </button>
              <p className="text-xs text-center text-[#6b6b6b]">
                We respond within one business day.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
