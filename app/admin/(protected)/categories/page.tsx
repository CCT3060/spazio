import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { Plus } from "lucide-react";
import CategoriesClient from "./CategoriesClient";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  // Fetch all categories with their children nested
  const allCats = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });

  // Build parent → children tree
  const childMap = new Map<number, typeof allCats>();
  for (const cat of allCats) {
    if (cat.parentId) {
      if (!childMap.has(cat.parentId)) childMap.set(cat.parentId, []);
      childMap.get(cat.parentId)!.push(cat);
    }
  }

  // Only top-level parents, each with their children attached
  const parents = allCats
    .filter((c) => !c.parentId)
    .map((c) => ({
      ...c,
      children: (childMap.get(c.id) ?? []).map((child) => ({ ...child, children: [] })),
    }));

  const totalCount = allCats.length;
  const parentCount = parents.length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Categories
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1">
            {parentCount} parent {parentCount === 1 ? "category" : "categories"} · {totalCount} total
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
        >
          <Plus size={14} />
          Add Category
        </Link>
      </div>

      <CategoriesClient parents={parents} />
    </div>
  );
}
