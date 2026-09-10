"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, ChevronUp, ChevronDown,
  ChevronsUpDown, Eye, EyeOff, Save, GripVertical, X,
  LayoutTemplate, Grid3X3,
} from "lucide-react";
import dynamic from "next/dynamic";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

interface Slide {
  id: number;
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
  linkUrl: string | null;
  buttonText: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface Section {
  id: number;
  sectionType: string;
  layout: string | null;
  title: string | null;
  subtitle: string | null;
  excerpt: string | null;
  bodyText: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  buttonText: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface Cat { id: number; name: string; slug: string; parentId?: number | null }

type EditingSlide = Omit<Slide, "id"> & { id?: number };

const inputCls = "w-full border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";
const labelCls = "block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1";

// ── Collapsible wrapper ───────────────────────────────────────────────────────

function CollapsibleSection({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#e0d9cc] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f5f0e8] transition-colors group"
      >
        <div>
          <h2 className="text-base font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {title}
          </h2>
          {description && (
            <p className="text-xs text-[#6b6b6b] mt-0.5">{description}</p>
          )}
        </div>
        <span className={`ml-4 shrink-0 text-[#6b6b6b] group-hover:text-[#b5964e] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronsUpDown size={16} />
        </span>
      </button>
      {open && (
        <div className="border-t border-[#e0d9cc]">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Category Showcase editor ──────────────────────────────────────────────────

function CategoryShowcaseEditor({ section, allCategories }: { section: Section | null; allCategories: Cat[] }) {
  const saved = (section?.bodyText ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const [selected, setSelected] = useState<string[]>(saved);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(section?.isActive ?? true);

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 6) { toast.error("Max 6 categories"); return prev; }
      return [...prev, slug];
    });
  }
  function moveUp(i: number) {
    if (i === 0) return;
    setSelected((prev) => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  }
  function moveDown(i: number) {
    if (i === selected.length - 1) return;
    setSelected((prev) => { const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });
  }

  async function save() {
    setSaving(true);
    const payload = { sectionType: "category_showcase", sortOrder: 0, bodyText: selected.join(","), isActive, title: null, subtitle: null, linkUrl: null, imageUrl: null, videoUrl: null };
    const url = section?.id ? `/api/homepage/sections/${section.id}` : "/api/homepage/sections";
    const res = await fetch(url, { method: section?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) toast.success("Saved");
    else toast.error("Failed to save");
  }

  return (
    <div className="p-6 space-y-5">
      <p className="text-xs text-[#6b6b6b]">Choose up to 6 categories to show in the grid after the hero.</p>
      {selected.length > 0 && (
        <div>
          <p className={labelCls}>Selected order ({selected.length}/6)</p>
          <div className="space-y-1">
            {selected.map((slug, i) => {
              const cat = allCategories.find((c) => c.slug === slug);
              return (
                <div key={slug} className="flex items-center gap-2 bg-[#f5f0e8] px-3 py-2">
                  <span className="flex-1 text-sm text-[#1a1a1a]">{cat?.name ?? slug}</span>
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0} className="p-0.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === selected.length - 1} className="p-0.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => toggle(slug)} className="p-0.5 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <p className={labelCls}>All categories — click to add / remove</p>
        <div className="flex flex-wrap gap-2">
          {allCategories.map((cat) => {
            const on = selected.includes(cat.slug);
            return (
              <button key={cat.slug} type="button" onClick={() => toggle(cat.slug)}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest border transition-colors ${on ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" : "bg-white text-[#6b6b6b] border-[#e0d9cc] hover:border-[#1a1a1a] hover:text-[#1a1a1a]"}`}>
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e0d9cc]">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#b5964e]" />
          Show on homepage
        </label>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          <Save size={13} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── Category Trio editor ──────────────────────────────────────────────────────

function CategoryTrioEditor({
  section,
  allCategories,
  sectionType = "category_trio",
  onSaved,
}: {
  section: Section | null;
  allCategories: Cat[];
  sectionType?: string;
  onSaved?: (updated: Section) => void;
}) {
  const saved = (section?.bodyText ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const [selected, setSelected] = useState<string[]>(saved.slice(0, 3));
  const [isActive, setIsActive] = useState(section?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  function toggle(slug: string) {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) { toast.error("Max 3 categories"); return prev; }
      return [...prev, slug];
    });
  }
  function moveUp(i: number) {
    if (i === 0) return;
    setSelected((prev) => { const a = [...prev]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; return a; });
  }
  function moveDown(i: number) {
    if (i === selected.length - 1) return;
    setSelected((prev) => { const a = [...prev]; [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; });
  }

  async function save() {
    setSaving(true);
    const payload = {
      sectionType, sortOrder: section?.sortOrder ?? 999,
      bodyText: selected.join(","), isActive,
      title: null, subtitle: null, linkUrl: null, imageUrl: null, videoUrl: null,
    };
    const url    = section?.id ? `/api/homepage/sections/${section.id}` : "/api/homepage/sections";
    const method = section?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      toast.success("Saved");
      onSaved?.(updated);
    } else {
      toast.error("Failed to save");
    }
  }

  const parents = allCategories.filter((c) => !c.parentId);
  const subs    = allCategories.filter((c) => !!c.parentId);
  const filtered = search.trim() ? allCategories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <div className="p-6 space-y-5">
      <p className="text-xs text-[#6b6b6b]">3-column editorial grid (image + title + description). Choose any 3 categories or subcategories.</p>
      {selected.length > 0 && (
        <div>
          <p className={labelCls}>Selected order ({selected.length}/3)</p>
          <div className="space-y-1">
            {selected.map((slug, i) => {
              const cat = allCategories.find((c) => c.slug === slug);
              const parent = cat?.parentId ? allCategories.find((c) => c.id === cat.parentId) : null;
              return (
                <div key={slug} className="flex items-center gap-2 bg-[#f5f0e8] px-3 py-2">
                  <span className="flex-1 text-sm text-[#1a1a1a]">
                    {parent ? <span className="text-[#6b6b6b]">{parent.name} / </span> : null}
                    {cat?.name ?? slug}
                  </span>
                  <button type="button" onClick={() => moveUp(i)} disabled={i === 0} className="p-0.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveDown(i)} disabled={i === selected.length - 1} className="p-0.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => toggle(slug)} className="p-0.5 text-red-400 hover:text-red-600"><Trash2 size={13} /></button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={inputCls} placeholder="Search categories…" />
        <div className="max-h-48 overflow-y-auto border border-[#e0d9cc] divide-y divide-[#f0ece4]">
          {(filtered ?? parents).map((cat) => {
            const isSelected = selected.includes(cat.slug);
            const children = filtered ? [] : subs.filter((s) => s.parentId === cat.id);
            return (
              <div key={cat.slug}>
                <button type="button" onClick={() => toggle(cat.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors ${isSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#f5f0e8] text-[#1a1a1a]"}`}>
                  <span>{cat.name}</span>
                  {isSelected && <span className="text-[10px] tracking-widest">✓ SELECTED</span>}
                </button>
                {children.map((sub) => {
                  const subSelected = selected.includes(sub.slug);
                  return (
                    <button key={sub.slug} type="button" onClick={() => toggle(sub.slug)}
                      className={`w-full flex items-center justify-between pl-7 pr-3 py-2 text-sm text-left transition-colors ${subSelected ? "bg-[#1a1a1a] text-white" : "hover:bg-[#f5f0e8] text-[#6b6b6b]"}`}>
                      <span>↳ {sub.name}</span>
                      {subSelected && <span className="text-[10px] tracking-widest">✓ SELECTED</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e0d9cc]">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#b5964e]" />
          Show on homepage
        </label>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          <Save size={13} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── Content Block editor ──────────────────────────────────────────────────────

function ContentBlockEditor({
  section,
  sectionType = "content_block",
  onSaved,
}: {
  section: Section | null;
  sectionType?: string;
  onSaved?: (updated: Section) => void;
}) {
  const initMode = (): "image_text" | "bg_image" | "video" | "text_only" => {
    if (section?.layout === "bg_image") return "bg_image";
    if (section?.videoUrl) return "video";
    if (section?.imageUrl) return "image_text";
    return "text_only";
  };
  const [mode, setMode] = useState<"image_text" | "bg_image" | "video" | "text_only">(initMode);
  const [form, setForm] = useState({
    title:      section?.title      ?? "",
    subtitle:   section?.subtitle   ?? "",
    excerpt:    section?.excerpt    ?? "",
    bodyText:   section?.bodyText   ?? "",
    linkUrl:    section?.linkUrl    ?? "",
    buttonText: section?.buttonText ?? "",
    videoUrl:   section?.videoUrl   ?? "",
    isActive:   section?.isActive   ?? true,
  });
  const [images, setImages] = useState<UploadedImage[]>(
    section?.imageUrl ? [{ imageUrl: section.imageUrl, isPrimary: true, sortOrder: 0 }] : []
  );
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    let resolvedLink = form.linkUrl.trim();

    // Auto-create page if title is set but no link provided
    if (!resolvedLink && form.title.trim()) {
      const slug = slugify(form.title.trim());
      const pageRes = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title: form.title.trim(), content: form.bodyText || "" }),
      });
      if (pageRes.ok) {
        const newPage = await pageRes.json();
        resolvedLink = `/pages/${newPage.slug}`;
        setForm((f) => ({ ...f, linkUrl: resolvedLink }));
        toast("Page auto-created at " + resolvedLink, { icon: "📄" });
      } else if (pageRes.status === 409) {
        resolvedLink = `/pages/${slug}`;
        setForm((f) => ({ ...f, linkUrl: resolvedLink }));
      }
    }

    // If linkUrl points to an auto-created page, keep its content in sync with bodyText
    if (resolvedLink.startsWith("/pages/")) {
      const pageSlug = resolvedLink.replace(/^\/pages\//, "");
      await fetch("/api/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: pageSlug, content: form.bodyText || "" }),
      });
    }

    const imageUrl = (mode === "image_text" || mode === "bg_image")
      ? (images[0]?.imageUrl ?? section?.imageUrl ?? null)
      : null;
    const payload = {
      sectionType, layout: mode,
      sortOrder:  section?.sortOrder ?? 999,
      title:      form.title      || null,
      subtitle:   form.subtitle   || null,
      excerpt:    form.excerpt    || null,
      bodyText:   form.bodyText   || null,
      linkUrl:    resolvedLink    || null,
      buttonText: form.buttonText || null,
      imageUrl,
      videoUrl: mode === "video" ? (form.videoUrl || null) : null,
      isActive: form.isActive,
    };
    const url    = section?.id ? `/api/homepage/sections/${section.id}` : "/api/homepage/sections";
    const method = section?.id ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      toast.success("Saved");
      onSaved?.(updated);
    } else {
      toast.error("Failed to save");
    }
  }

  const modes = [
    { key: "image_text" as const, label: "Image + Text" },
    { key: "bg_image"   as const, label: "Background Image" },
    { key: "video"      as const, label: "Full-Width Video" },
    { key: "text_only"  as const, label: "Text Only" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <p className={labelCls}>Layout</p>
        <div className="flex gap-0 border border-[#e0d9cc] w-fit flex-wrap">
          {modes.map((m) => (
            <button key={m.key} type="button" onClick={() => setMode(m.key)}
              className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${mode === m.key ? "bg-[#1a1a1a] text-white" : "bg-white text-[#6b6b6b] hover:bg-[#f5f0e8]"}`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Heading</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="Section heading" />
        </div>
        <div>
          <label className={labelCls}>Eyebrow / Subtitle</label>
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} placeholder="Small text above heading" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Homepage Description</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={3}
            className={inputCls + " resize-none"}
            placeholder="Short description shown on the homepage card (1–3 sentences)"
          />
          <p className="text-[10px] text-[#6b6b6b] mt-1">This text appears on the homepage. Keep it brief — full content goes in Body Text below.</p>
        </div>
        <div>
          <label className={labelCls}>Button Text</label>
          <input value={form.buttonText} onChange={(e) => set("buttonText", e.target.value)} className={inputCls} placeholder="e.g. Shop The Met, Read More, Explore" />
        </div>
        <div>
          <label className={labelCls}>Button Link URL</label>
          <input value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} className={inputCls} placeholder="Leave blank to auto-create a page from the heading" />
          <p className="text-[10px] text-[#6b6b6b] mt-1">Leave blank — a page will be created automatically from the heading.</p>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Body Text (full page content)</label>
          <RichTextEditor value={form.bodyText} onChange={(v) => set("bodyText", v)} placeholder="Full content shown on the linked page. Supports images, headings, lists…" />
        </div>
      </div>

      {(mode === "image_text" || mode === "bg_image") && (
        <div>
          <label className={labelCls}>{mode === "bg_image" ? "Background Image" : "Image (side)"}</label>
          <ImageUploader images={images} onChange={setImages} single />
        </div>
      )}
      {mode === "video" && (
        <div>
          <label className={labelCls}>Video URL</label>
          <input value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} className={inputCls} placeholder="https://youtube.com/watch?v=…  or  .mp4" />
          <p className="text-xs text-[#6b6b6b] mt-1">Supports YouTube, Vimeo, or a direct MP4. Autoplays muted and loops.</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-[#e0d9cc]">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="accent-[#b5964e]" />
          Show on homepage
        </label>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          <Save size={13} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── CTA Block editor ──────────────────────────────────────────────────────────

function CtaBlockEditor({ section }: { section: Section | null }) {
  const [form, setForm] = useState({
    title: section?.title ?? "", subtitle: section?.subtitle ?? "",
    bodyText: section?.bodyText ?? "", linkUrl: section?.linkUrl ?? "",
    isActive: section?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    const payload = { sectionType: "trade_cta", sortOrder: 9999, title: form.title || null, subtitle: form.subtitle || null, bodyText: form.bodyText || null, linkUrl: form.linkUrl || null, imageUrl: null, videoUrl: null, isActive: form.isActive };
    const url = section?.id ? `/api/homepage/sections/${section.id}` : "/api/homepage/sections";
    const res = await fetch(url, { method: section?.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) toast.success("Saved");
    else toast.error("Failed to save");
  }

  return (
    <div className="p-6 space-y-4">
      <p className="text-xs text-[#6b6b6b]">Dark section always shown at the bottom before the newsletter. Use it for a Trade Program, announcement, or call-to-action.</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Heading</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputCls} placeholder="e.g. Trade Program" />
        </div>
        <div>
          <label className={labelCls}>Eyebrow (small text above heading)</label>
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} placeholder="e.g. Exclusive Benefits" />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Description</label>
          <RichTextEditor value={form.bodyText} onChange={(v) => set("bodyText", v)} placeholder="Short description beneath the heading…" />
        </div>
        <div>
          <label className={labelCls}>Button Link URL</label>
          <input value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} className={inputCls} placeholder="/trade-program" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e0d9cc]">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="accent-[#b5964e]" />
          Show on homepage
        </label>
        <button type="button" onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          <Save size={13} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ── Dynamic section row ───────────────────────────────────────────────────────

function DynamicSectionRow({
  sec,
  index,
  total,
  allCategories,
  onMove,
  onDelete,
  onSaved,
}: {
  sec: Section;
  index: number;
  total: number;
  allCategories: Cat[];
  onMove: (id: number, dir: -1 | 1) => void;
  onDelete: (id: number) => void;
  onSaved: (updated: Section) => void;
}) {
  const [open, setOpen] = useState(!sec.id); // auto-open new (unsaved)
  const isBlock = sec.sectionType === "content_block";

  const label = isBlock
    ? `Content Block${sec.title ? ` — ${sec.title}` : ""}`
    : `Category Trio${sec.title ? ` — ${sec.title}` : ""}`;

  return (
    <div className="border border-[#e0d9cc] bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 hover:bg-[#f5f0e8] transition-colors">
        <GripVertical size={14} className="text-[#d0c9bc] shrink-0" />
        <span className={`shrink-0 p-1 rounded text-[#6b6b6b] ${isBlock ? "bg-[#f0ebe0]" : "bg-[#e8f0f5]"}`}>
          {isBlock ? <LayoutTemplate size={13} /> : <Grid3X3 size={13} />}
        </span>
        <button type="button" onClick={() => setOpen((o) => !o)} className="flex-1 text-left">
          <span className="text-sm font-medium text-[#1a1a1a]">{label}</span>
          <span className="ml-2 text-[10px] uppercase tracking-widest text-[#6b6b6b]">
            {isBlock ? "content block" : "category trio"}
          </span>
        </button>
        <div className="flex items-center gap-0.5 shrink-0">
          <button type="button" onClick={() => onMove(sec.id, -1)} disabled={index === 0}
            className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors">
            <ChevronUp size={14} />
          </button>
          <button type="button" onClick={() => onMove(sec.id, 1)} disabled={index === total - 1}
            className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30 transition-colors">
            <ChevronDown size={14} />
          </button>
          <button type="button" onClick={() => setOpen((o) => !o)}
            className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e] transition-colors">
            <Pencil size={14} />
          </button>
          <button type="button" onClick={() => onDelete(sec.id)}
            className="p-1.5 text-[#6b6b6b] hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#e0d9cc]">
          {isBlock
            ? <ContentBlockEditor section={sec} sectionType="content_block" onSaved={onSaved} />
            : <CategoryTrioEditor section={sec} allCategories={allCategories} sectionType="category_trio" onSaved={onSaved} />
          }
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomepageBuilder({
  initialSlides,
  initialSections,
  allCategories,
}: {
  initialSlides: Slide[];
  initialSections: Section[];
  allCategories: Cat[];
}) {
  const router = useRouter();

  // Hero slides
  const [slides, setSlides] = useState(initialSlides);
  const [editingSlide, setEditingSlide] = useState<EditingSlide | null>(null);
  const [slideImages, setSlideImages] = useState<UploadedImage[]>([]);
  const [saving, setSaving] = useState(false);

  // Fixed sections
  const categoryShowcase = initialSections.find((s) => s.sectionType === "category_showcase") ?? null;
  const tradeCta         = initialSections.find((s) => s.sectionType === "trade_cta")         ?? null;

  // Dynamic sections (all except fixed ones), sorted by sortOrder
  const [dynSections, setDynSections] = useState<Section[]>(
    initialSections
      .filter((s) => s.sectionType !== "category_showcase" && s.sectionType !== "trade_cta")
      .sort((a, b) => a.sortOrder - b.sortOrder)
  );

  const [showAddMenu, setShowAddMenu] = useState(false);

  // ── Slides ──────────────────────────────────────────────────────────────────

  function openNewSlide() {
    setEditingSlide({ title: "", subtitle: "", imageUrl: "", linkUrl: "", buttonText: "", sortOrder: slides.length, isActive: true });
    setSlideImages([]);
  }
  function openEditSlide(s: Slide) {
    setEditingSlide({ ...s });
    setSlideImages(s.imageUrl ? [{ imageUrl: s.imageUrl, isPrimary: true, sortOrder: 0 }] : []);
  }
  async function saveSlide() {
    if (!editingSlide) return;
    setSaving(true);
    const payload = { ...editingSlide, imageUrl: slideImages[0]?.imageUrl ?? editingSlide.imageUrl };
    const url = editingSlide.id ? `/api/homepage/slides/${editingSlide.id}` : "/api/homepage/slides";
    const res = await fetch(url, { method: editingSlide.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      toast.success(editingSlide.id ? "Slide updated" : "Slide created");
      setEditingSlide(null);
      router.refresh();
      const updated = await fetch("/api/homepage/slides").then((r) => r.json());
      setSlides(updated);
    } else {
      toast.error("Failed to save slide");
    }
  }
  async function deleteSlide(id: number) {
    if (!confirm("Delete this slide?")) return;
    await fetch(`/api/homepage/slides/${id}`, { method: "DELETE" });
    toast.success("Slide deleted");
    setSlides((s) => s.filter((sl) => sl.id !== id));
  }
  async function toggleSlide(s: Slide) {
    await fetch(`/api/homepage/slides/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...s, isActive: !s.isActive }) });
    setSlides((prev) => prev.map((sl) => (sl.id === s.id ? { ...sl, isActive: !sl.isActive } : sl)));
  }
  async function moveSlide(id: number, dir: -1 | 1) {
    const idx = slides.findIndex((s) => s.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= slides.length) return;
    const next = [...slides];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    const reordered = next.map((s, i) => ({ ...s, sortOrder: i }));
    setSlides(reordered);
    await Promise.all(reordered.map((s) => fetch(`/api/homepage/slides/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) })));
  }

  // ── Dynamic sections ────────────────────────────────────────────────────────

  async function addSection(type: "content_block" | "category_trio") {
    setShowAddMenu(false);
    const sortOrder = dynSections.length > 0 ? Math.max(...dynSections.map((s) => s.sortOrder)) + 1 : 100;
    const payload = { sectionType: type, layout: type === "content_block" ? "text_only" : null, sortOrder, title: null, subtitle: null, bodyText: null, linkUrl: null, imageUrl: null, videoUrl: null, isActive: true };
    const res = await fetch("/api/homepage/sections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (res.ok) {
      const created: Section = await res.json();
      setDynSections((prev) => [...prev, created]);
      toast.success(type === "content_block" ? "Content block added" : "Category trio added");
    } else {
      toast.error("Failed to add section");
    }
  }

  async function deleteSection(id: number) {
    if (!confirm("Delete this section?")) return;
    const res = await fetch(`/api/homepage/sections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDynSections((prev) => prev.filter((s) => s.id !== id));
      toast.success("Section deleted");
    } else {
      toast.error("Failed to delete");
    }
  }

  async function moveSection(id: number, dir: -1 | 1) {
    const idx = dynSections.findIndex((s) => s.id === id);
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= dynSections.length) return;
    const next = [...dynSections];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    const reordered = next.map((s, i) => ({ ...s, sortOrder: i + 100 }));
    setDynSections(reordered);
    await Promise.all(
      reordered.map((s) =>
        fetch(`/api/homepage/sections/${s.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) })
      )
    );
  }

  function handleSectionSaved(updated: Section) {
    setDynSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  }

  return (
    <div className="space-y-4">

      {/* ── HERO SLIDES ── */}
      <CollapsibleSection title="Hero Slides" description="Full-screen slides at the top of the homepage" defaultOpen>
        <div className="p-6 space-y-4">
          <div className="flex justify-end">
            <button onClick={openNewSlide} className="flex items-center gap-1.5 bg-[#1a1a1a] text-white px-3 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors">
              <Plus size={13} /> Add Slide
            </button>
          </div>
          <div className="space-y-3">
            {slides.length === 0 && <p className="text-sm text-[#6b6b6b]">No slides yet.</p>}
            {slides.map((s, i) => (
              <div key={s.id} className={`flex items-center gap-4 bg-white border p-4 ${s.isActive ? "border-[#e0d9cc]" : "border-dashed border-[#e0d9cc] opacity-60"}`}>
                <div className="w-20 h-12 bg-[#f5f0e8] relative overflow-hidden shrink-0">
                  {s.imageUrl && <Image src={s.imageUrl} alt={s.title ?? ""} fill className="object-cover" sizes="80px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[#1a1a1a] truncate">{s.title || "Untitled Slide"}</p>
                  <p className="text-xs text-[#6b6b6b] truncate">{s.subtitle ?? ""}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveSlide(s.id, -1)} disabled={i === 0} className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button onClick={() => moveSlide(s.id, 1)} disabled={i === slides.length - 1} className="p-1.5 text-[#6b6b6b] hover:text-[#1a1a1a] disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button onClick={() => toggleSlide(s)} className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e]">{s.isActive ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button onClick={() => openEditSlide(s)} className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e]"><Pencil size={14} /></button>
                  <button onClick={() => deleteSlide(s.id)} className="p-1.5 text-[#6b6b6b] hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          {editingSlide && (
            <div className="mt-4 bg-white border border-[#e0d9cc] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-[#1a1a1a]">{editingSlide.id ? "Edit Slide" : "New Slide"}</h3>
                <button onClick={() => setEditingSlide(null)} className="p-1 text-[#6b6b6b] hover:text-[#1a1a1a]"><X size={14} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={labelCls}>Title</label><input value={editingSlide.title ?? ""} onChange={(e) => setEditingSlide((s) => s && ({ ...s, title: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Subtitle</label><input value={editingSlide.subtitle ?? ""} onChange={(e) => setEditingSlide((s) => s && ({ ...s, subtitle: e.target.value }))} className={inputCls} /></div>
                <div><label className={labelCls}>Link URL</label><input value={editingSlide.linkUrl ?? ""} onChange={(e) => setEditingSlide((s) => s && ({ ...s, linkUrl: e.target.value }))} className={inputCls} placeholder="/collections/lighting" /></div>
                <div><label className={labelCls}>Button Text</label><input value={editingSlide.buttonText ?? ""} onChange={(e) => setEditingSlide((s) => s && ({ ...s, buttonText: e.target.value }))} className={inputCls} placeholder="Explore Collection" /></div>
              </div>
              <div><label className={labelCls}>Hero Image</label><ImageUploader images={slideImages} onChange={setSlideImages} single /></div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editingSlide.isActive} onChange={(e) => setEditingSlide((s) => s && ({ ...s, isActive: e.target.checked }))} className="accent-[#b5964e]" /> Active
              </label>
              <div className="flex gap-3">
                <button onClick={saveSlide} disabled={saving} className="bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
                <button onClick={() => setEditingSlide(null)} className="px-5 py-2 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a]">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* ── CATEGORY SHOWCASE ── */}
      <CollapsibleSection title="Category Showcase" description="Up to 6 categories shown in the grid after the hero">
        <CategoryShowcaseEditor section={categoryShowcase} allCategories={allCategories} />
      </CollapsibleSection>

      {/* ── DYNAMIC SECTIONS ── */}
      <div className="border border-[#e0d9cc] bg-white overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0d9cc]">
          <div>
            <h2 className="text-base font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Homepage Sections
            </h2>
            <p className="text-xs text-[#6b6b6b] mt-0.5">Content blocks and category trios in between — add, remove, reorder freely</p>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu((o) => !o)}
              className="flex items-center gap-1.5 bg-[#1a1a1a] text-white px-4 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
            >
              <Plus size={13} /> Add Section
            </button>
            {showAddMenu && (
              <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-[#e0d9cc] shadow-lg min-w-[180px]">
                <button
                  type="button"
                  onClick={() => addSection("content_block")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f0e8] transition-colors border-b border-[#f0ece4]"
                >
                  <LayoutTemplate size={14} className="text-[#b5964e]" />
                  Content Block
                </button>
                <button
                  type="button"
                  onClick={() => addSection("category_trio")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[#f5f0e8] transition-colors"
                >
                  <Grid3X3 size={14} className="text-[#b5964e]" />
                  Category Trio
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {dynSections.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#6b6b6b]">No sections yet.</p>
              <p className="text-xs text-[#aaa] mt-1">Click "Add Section" to add a content block or category trio.</p>
            </div>
          )}
          {dynSections.map((sec, i) => (
            <DynamicSectionRow
              key={sec.id}
              sec={sec}
              index={i}
              total={dynSections.length}
              allCategories={allCategories}
              onMove={moveSection}
              onDelete={deleteSection}
              onSaved={handleSectionSaved}
            />
          ))}
        </div>
      </div>

      {/* ── CTA BLOCK ── */}
      <CollapsibleSection title="CTA Block" description="Dark call-to-action section always shown before the newsletter">
        <CtaBlockEditor section={tradeCta} />
      </CollapsibleSection>

    </div>
  );
}
