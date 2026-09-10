"use client";

import { useState } from "react";
import toast from "react-hot-toast";

const inputCls = "w-full border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";
const labelCls = "block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1";

interface Settings {
  siteName?: string;
  tagline?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  instagram?: string;
  facebook?: string;
  pinterest?: string;
  footerText?: string;
  announcementBar?: string;
  [key: string]: string | undefined;
}

export default function SiteSettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const [form, setForm] = useState<Settings>({
    siteName: "",
    tagline: "",
    address: "",
    phone: "",
    email: "",
    hours: "",
    instagram: "",
    facebook: "",
    pinterest: "",
    footerText: "",
    announcementBar: "",
    ...initialSettings,
  });
  const [saving, setSaving] = useState(false);

  function set(key: keyof Settings, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save settings");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Brand */}
      <section className="bg-white border border-[#e0d9cc] p-6 space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">Brand</h2>
        <div>
          <label className={labelCls}>Site Name</label>
          <input value={form.siteName ?? ""} onChange={(e) => set("siteName", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Tagline</label>
          <input value={form.tagline ?? ""} onChange={(e) => set("tagline", e.target.value)} className={inputCls} placeholder="Curating exceptional furniture & lighting" />
        </div>
        <div>
          <label className={labelCls}>Footer Text</label>
          <input value={form.footerText ?? ""} onChange={(e) => set("footerText", e.target.value)} className={inputCls} placeholder="A short brand description for the footer" />
        </div>
        <div>
          <label className={labelCls}>Announcement Bar</label>
          <input value={form.announcementBar ?? ""} onChange={(e) => set("announcementBar", e.target.value)} className={inputCls} placeholder="Free delivery on orders over ₹5,000" />
          <p className="text-xs text-[#6b6b6b] mt-1">Leave blank to hide the announcement bar.</p>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white border border-[#e0d9cc] p-6 space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">Contact & Location</h2>
        <div>
          <label className={labelCls}>Address</label>
          <textarea
            value={form.address ?? ""}
            onChange={(e) => set("address", e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder={"42, Design One, Pali Hill\nBandra West, Mumbai 400050"}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Phone</label>
            <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} className={inputCls} placeholder="+91 98201 00000" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="info@farnichare.com" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Showroom Hours</label>
          <textarea
            value={form.hours ?? ""}
            onChange={(e) => set("hours", e.target.value)}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder={"Mon–Fri: 10am – 6pm\nSat: 11am – 5pm\nSun: Closed"}
          />
        </div>
      </section>

      {/* Social */}
      <section className="bg-white border border-[#e0d9cc] p-6 space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">Social Media</h2>
        <div>
          <label className={labelCls}>Instagram URL</label>
          <input value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} className={inputCls} placeholder="https://instagram.com/farnichare" />
        </div>
        <div>
          <label className={labelCls}>Facebook URL</label>
          <input value={form.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} className={inputCls} placeholder="https://facebook.com/farnichare" />
        </div>
        <div>
          <label className={labelCls}>Pinterest URL</label>
          <input value={form.pinterest ?? ""} onChange={(e) => set("pinterest", e.target.value)} className={inputCls} placeholder="https://pinterest.com/farnichare" />
        </div>
      </section>

      <div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1a1a1a] text-white px-8 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
