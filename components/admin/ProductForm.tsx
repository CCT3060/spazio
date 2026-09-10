"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import ImageUploader, { UploadedImage } from "./ImageUploader";
import { slugify } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

interface Category { id: number; name: string }
interface Variant {
  id?: number;
  variantName: string;
  sku: string;
  price: string;
  stockStatus: string;
  imageUrl: string;
}

interface InitialProduct {
  id?: number;
  sku: string;
  name: string;
  slug: string;
  categoryId: number | null;
  description: string;
  shortDescription: string;
  price: string;
  salePrice: string;
  itemNumber: string;
  material: string;
  finish: string;
  dimensions: string;
  stockStatus: string;
  isFeatured: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  images: UploadedImage[];
  variants: Variant[];
}

const DEFAULT: InitialProduct = {
  sku: "", name: "", slug: "", categoryId: null,
  description: "", shortDescription: "", price: "",
  salePrice: "", itemNumber: "", material: "", finish: "",
  dimensions: "", stockStatus: "in_stock", isFeatured: false,
  isActive: true, metaTitle: "", metaDescription: "",
  images: [], variants: [],
};

interface Props {
  categories: Category[];
  initial?: Partial<InitialProduct> & { id?: number };
}

const inputCls =
  "w-full border border-[#e0d9cc] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";

function Field({ label, children, half }: { label: string; children: React.ReactNode; half?: boolean }) {
  return (
    <div className={half ? "" : "col-span-2"}>
      <label className="block text-xs font-medium uppercase tracking-widest text-[#6b6b6b] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProductForm({ categories, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<InitialProduct>({ ...DEFAULT, ...initial });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"main" | "images" | "variants" | "seo">("main");

  function set(field: keyof InitialProduct, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  // Variants helpers
  function addVariant() {
    set("variants", [...form.variants, { variantName: "", sku: "", price: "", stockStatus: "", imageUrl: "" }]);
  }
  function removeVariant(i: number) {
    set("variants", form.variants.filter((_, idx) => idx !== i));
  }
  function setVariant(i: number, field: keyof Variant, value: string) {
    const next = [...form.variants];
    next[i] = { ...next[i], [field]: value };
    set("variants", next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const productPayload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: parseFloat(form.price) || 0,
      salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
      categoryId: form.categoryId || null,
    };

    const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload),
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err?.error?.formErrors?.[0] ?? "Something went wrong");
      setLoading(false);
      return;
    }

    const product = await res.json();
    const productId = product.id;

    // Sync images
    if (form.images.length > 0) {
      // Delete all existing images first (simple replace strategy)
      if (isEdit) {
        const existing = initial?.images ?? [];
        for (const img of existing) {
          if (img.id) await fetch(`/api/products/${productId}/images`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ imageId: img.id }) });
        }
      }
      for (const img of form.images) {
        await fetch(`/api/products/${productId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: img.imageUrl, altText: img.altText, isPrimary: img.isPrimary }),
        });
      }
    }

    // Sync variants (simple: delete old, create new)
    if (isEdit) {
      const existing = initial?.variants ?? [];
      for (const v of existing) {
        if (v.id) await fetch(`/api/products/${productId}/variants`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantId: v.id }) });
      }
    }
    for (const v of form.variants) {
      if (!v.variantName || !v.sku) continue;
      await fetch(`/api/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantName: v.variantName, sku: v.sku, price: v.price ? parseFloat(v.price) : null, stockStatus: v.stockStatus || null, imageUrl: v.imageUrl || null }),
      });
    }

    toast.success(isEdit ? "Product updated" : "Product created");
    router.push("/admin/products");
    router.refresh();
    setLoading(false);
  }

  const tabs = [
    { key: "main", label: "Details" },
    { key: "images", label: "Images" },
    { key: "variants", label: `Variants (${form.variants.length})` },
    { key: "seo", label: "SEO" },
  ] as const;

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className="flex border-b border-[#e0d9cc] mb-6 gap-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2.5 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              activeTab === t.key
                ? "border-[#b5964e] text-[#1a1a1a] font-medium"
                : "border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── MAIN TAB ── */}
      {activeTab === "main" && (
        <div className="grid grid-cols-2 gap-5 max-w-3xl">
          <Field label="Product Name *">
            <input required value={form.name} onChange={(e) => { set("name", e.target.value); if (!isEdit) set("slug", slugify(e.target.value)); }} className={inputCls} />
          </Field>
          <Field label="Slug" half>
            <input value={form.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} placeholder="auto-generated" />
          </Field>
          <Field label="SKU *" half>
            <input required value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Item Number" half>
            <input value={form.itemNumber} onChange={(e) => set("itemNumber", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Category">
            <select value={form.categoryId ?? ""} onChange={(e) => set("categoryId", e.target.value ? Number(e.target.value) : null)} className={inputCls}>
              <option value="">Uncategorised</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Price (₹) *" half>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} placeholder="0.00" />
          </Field>
          <Field label="Sale Price (₹)" half>
            <input type="number" min="0" step="0.01" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} className={inputCls} placeholder="Leave blank if no sale" />
          </Field>
          <Field label="Material" half>
            <input value={form.material} onChange={(e) => set("material", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Finish" half>
            <input value={form.finish} onChange={(e) => set("finish", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Dimensions" half>
            <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} className={inputCls} placeholder="W: 120cm | H: 90cm" />
          </Field>
          <Field label="Stock Status" half>
            <select value={form.stockStatus} onChange={(e) => set("stockStatus", e.target.value)} className={inputCls}>
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="made_to_order">Made to Order</option>
            </select>
          </Field>
          <Field label="Short Description">
            <textarea value={form.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className={inputCls + " resize-none"} placeholder="One-line teaser shown on product cards" />
          </Field>
          <Field label="Description (rich text)">
            <RichTextEditor value={form.description} onChange={(v) => set("description", v)} placeholder="Full product description…" />
          </Field>
          <div className="col-span-2 flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="accent-[#b5964e] w-4 h-4" />
              Featured product
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="accent-[#b5964e] w-4 h-4" />
              Active (visible on site)
            </label>
          </div>
        </div>
      )}

      {/* ── IMAGES TAB ── */}
      {activeTab === "images" && (
        <div className="max-w-3xl">
          <p className="text-sm text-[#6b6b6b] mb-4">Upload product images. Star = primary image shown first. Drag to reorder.</p>
          <ImageUploader images={form.images} onChange={(imgs) => set("images", imgs)} />
        </div>
      )}

      {/* ── VARIANTS TAB ── */}
      {activeTab === "variants" && (
        <div className="max-w-3xl space-y-4">
          <p className="text-sm text-[#6b6b6b]">Add finish/size variants. Each variant can override price, stock status, and image.</p>
          {form.variants.map((v, i) => (
            <div key={i} className="border border-[#e0d9cc] p-4 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1">Variant Name *</label>
                <input value={v.variantName} onChange={(e) => setVariant(i, "variantName", e.target.value)} placeholder="e.g. Brass / Large" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1">SKU *</label>
                <input value={v.sku} onChange={(e) => setVariant(i, "sku", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1">Price Override</label>
                <input type="number" min="0" step="0.01" value={v.price} onChange={(e) => setVariant(i, "price", e.target.value)} placeholder="Leave blank to inherit" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1">Stock Status</label>
                <select value={v.stockStatus} onChange={(e) => setVariant(i, "stockStatus", e.target.value)} className={inputCls}>
                  <option value="">Inherit from product</option>
                  <option value="in_stock">In Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="made_to_order">Made to Order</option>
                </select>
              </div>
              <div className="col-span-2 flex justify-end">
                <button type="button" onClick={() => removeVariant(i)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                  <Trash2 size={12} /> Remove variant
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addVariant} className="flex items-center gap-2 px-4 py-2 border border-dashed border-[#e0d9cc] text-sm text-[#6b6b6b] hover:border-[#b5964e] hover:text-[#b5964e] transition-colors">
            <Plus size={14} /> Add variant
          </button>
        </div>
      )}

      {/* ── SEO TAB ── */}
      {activeTab === "seo" && (
        <div className="max-w-2xl space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Meta Title</label>
            <input value={form.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} placeholder="Defaults to product name" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[#6b6b6b] mb-1.5">Meta Description</label>
            <textarea value={form.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} className={inputCls + " resize-none"} placeholder="~155 characters" />
            <p className="text-xs text-[#6b6b6b] mt-1">{form.metaDescription.length} chars</p>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3 mt-8 pt-6 border-t border-[#e0d9cc]">
        <button type="submit" disabled={loading} className="bg-[#1a1a1a] text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60">
          {loading ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a] transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
