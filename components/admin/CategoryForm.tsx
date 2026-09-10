"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ImageUploader, { UploadedImage } from "./ImageUploader";
import { slugify } from "@/lib/utils";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[]; // for parent selector
  initial?: {
    id?: number;
    name: string;
    slug: string;
    parentId: number | null;
    description: string;
    imageUrl: string | null;
    sortOrder: number;
    isActive: boolean;
  };
}

const DEFAULT: Props["initial"] = {
  name: "",
  slug: "",
  parentId: null,
  description: "",
  imageUrl: null,
  sortOrder: 0,
  isActive: true,
};

type FormState = Required<Omit<NonNullable<Props["initial"]>, "id">> & { id?: number };

const inputCls =
  "w-full border border-[#e0d9cc] px-3 py-2.5 text-sm focus:outline-none focus:border-[#b5964e] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-widest text-[#6b6b6b] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CategoryForm({ categories, initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    parentId: initial?.parentId ?? null,
    description: initial?.description ?? "",
    imageUrl: initial?.imageUrl ?? null,
    sortOrder: initial?.sortOrder ?? 0,
    isActive: initial?.isActive ?? true,
    ...(initial?.id ? { id: initial.id } : {}),
  });
  const [images, setImages] = useState<UploadedImage[]>(
    initial?.imageUrl ? [{ imageUrl: initial.imageUrl, isPrimary: true, sortOrder: 0 }] : []
  );
  const [loading, setLoading] = useState(false);

  function set(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      imageUrl: images[0]?.imageUrl ?? null,
    };

    const url = isEdit ? `/api/categories/${initial!.id}` : "/api/categories";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      toast.success(isEdit ? "Category updated" : "Category created");
      router.push("/admin/categories");
      router.refresh();
    } else {
      try {
        const err = await res.json();
        toast.error(err?.error?.formErrors?.[0] ?? err?.error ?? "Something went wrong");
      } catch {
        toast.error(`Error ${res.status}: ${res.statusText || "Something went wrong"}`);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Field label="Name *">
        <input
          required
          value={form.name}
          onChange={(e) => {
            set("name", e.target.value);
            if (!isEdit) set("slug", slugify(e.target.value));
          }}
          className={inputCls}
        />
      </Field>

      <Field label="Slug">
        <input
          value={form.slug}
          onChange={(e) => set("slug", e.target.value)}
          className={inputCls}
          placeholder="auto-generated from name"
        />
      </Field>

      <Field label="Parent Category">
        <select
          value={form.parentId ?? ""}
          onChange={(e) => set("parentId", e.target.value ? Number(e.target.value) : null)}
          className={inputCls}
        >
          <option value="">None (top-level)</option>
          {categories
            .filter((c) => c.id !== initial?.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputCls + " resize-none"}
        />
      </Field>

      <Field label="Sort Order">
        <input
          type="number"
          value={form.sortOrder}
          onChange={(e) => set("sortOrder", Number(e.target.value))}
          className={inputCls}
          min={0}
        />
      </Field>

      <Field label="Image">
        <ImageUploader images={images} onChange={setImages} single />
      </Field>

      <Field label="Status">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
            className="accent-[#b5964e] w-4 h-4"
          />
          <span className="text-sm">Active (visible on site)</span>
        </label>
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#1a1a1a] text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors disabled:opacity-60"
        >
          {loading ? "Saving…" : isEdit ? "Update Category" : "Create Category"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-xs uppercase tracking-widest border border-[#e0d9cc] text-[#6b6b6b] hover:border-[#1a1a1a] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
