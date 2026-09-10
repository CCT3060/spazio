import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Edit Category" };

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    prisma.category.findUnique({ where: { id: Number(id) } }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!category) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-6">
        <Link href="/admin/categories" className="hover:text-[#b5964e]">Categories</Link>
        <ChevronRight size={12} />
        <span className="text-[#1a1a1a]">{category.name}</span>
      </div>

      <h1
        className="text-2xl font-semibold text-[#1a1a1a] mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Edit Category
      </h1>

      <CategoryForm
        categories={categories}
        initial={{
          id: category.id,
          name: category.name,
          slug: category.slug,
          parentId: category.parentId,
          description: category.description ?? "",
          imageUrl: category.imageUrl,
          sortOrder: category.sortOrder,
          isActive: category.isActive,
        }}
      />
    </div>
  );
}
