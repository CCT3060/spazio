import { prisma } from "@/lib/prisma";
import CategoryForm from "@/components/admin/CategoryForm";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "New Category" };

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-6">
        <Link href="/admin/categories" className="hover:text-[#b5964e]">Categories</Link>
        <ChevronRight size={12} />
        <span className="text-[#1a1a1a]">New</span>
      </div>

      <h1
        className="text-2xl font-semibold text-[#1a1a1a] mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        New Category
      </h1>

      <CategoryForm categories={categories} />
    </div>
  );
}
