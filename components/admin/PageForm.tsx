"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { slugify } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

interface PageData {
  id?: number;
  slug: string;
  title: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

const inputCls = "w-full border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";
const labelCls = "block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1";

export default function PageForm({ page }: { page?: PageData }) {
  const router = useRouter();
  const isEdit = !!page?.id;

  const [form, setForm] = useState({
    slug: page?.slug ?? "",
    title: page?.title ?? "",
    content: page?.content ?? "",
    metaTitle: page?.metaTitle ?? "",
    metaDescription: page?.metaDescription ?? "",
  });
  const [slugManual, setSlugManual] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugManual) set("slug", slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      content: form.content,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
    };
    const url = isEdit ? `/api/pages/${page!.id}` : "/api/pages";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      toast.success(isEdit ? "Page saved" : "Page created");
      router.push("/admin/pages");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save page");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Title & Slug */}
      <div className="bg-white border border-[#e0d9cc] p-6 space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">Page Details</h2>
        <div>
          <label className={labelCls}>Title *</label>
          <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Slug (URL path) *</label>
          <div className="flex">
            <span className="border border-r-0 border-[#e0d9cc] bg-[#f5f0e8] px-3 py-2 text-sm text-[#6b6b6b] select-none">/pages/</span>
            <input
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
              required
              className={`${inputCls} border-l-0`}
              placeholder="about-us"
            />
          </div>
          <p className="text-xs text-[#6b6b6b] mt-1">Auto-generated from title. Edit to customise.</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white border border-[#e0d9cc] p-6 space-y-4">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">Content</h2>
        <RichTextEditor value={form.content} onChange={(v) => set("content", v)} placeholder="Write the page content…" />
      </div>

      {/* SEO */}
      <div className="bg-white border border-[#e0d9cc] p-6 space-y-5">
        <h2 className="text-xs uppercase tracking-widest text-[#6b6b6b] font-medium border-b border-[#e0d9cc] pb-3">SEO (optional)</h2>
        <div>
          <label className={labelCls}>Meta Title</label>
          <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} maxLength={255} />
        </div>
        <div>
          <label className={labelCls}>Meta Description</label>
          <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="bg-[#1a1a1a] text-white px-8 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          {saving ? "Saving…" : isEdit ? "Update Page" : "Create Page"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-8 py-2.5 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a]">
          Cancel
        </button>
      </div>
    </form>
  );
}
