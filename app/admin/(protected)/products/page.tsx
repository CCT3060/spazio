import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Plus, Pencil } from "lucide-react";
import ProductDeleteButton from "./ProductDeleteButton";
import ProductSearch from "./ProductSearch";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = { title: "Products" };

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string; categoryId?: string }>;
}

const LIMIT = 20;

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const search = sp.search ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));
  const categoryId = sp.categoryId ? Number(sp.categoryId) : undefined;

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { sku: { contains: search } },
        { itemNumber: { contains: search } },
      ],
    }),
    ...(categoryId && { categoryId }),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * LIMIT,
      take: LIMIT,
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / LIMIT);

  const stockBadge = (s: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      in_stock: { label: "In Stock", cls: "bg-green-50 text-green-700" },
      out_of_stock: { label: "Out of Stock", cls: "bg-red-50 text-red-700" },
      made_to_order: { label: "MTO", cls: "bg-amber-50 text-amber-700" },
    };
    return map[s] ?? { label: s, cls: "bg-gray-100 text-gray-500" };
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1a1a1a]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Products
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{total} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <ProductSearch categories={categories} currentSearch={search} currentCategory={sp.categoryId} />

      {/* Table */}
      <div className="bg-white border border-[#e0d9cc] overflow-x-auto mt-4">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-[#f5f0e8] border-b border-[#e0d9cc]">
            <tr>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium w-16">Image</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">SKU</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Category</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Price</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Stock</th>
              <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Status</th>
              <th className="px-4 py-3 w-20" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e0d9cc]">
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[#6b6b6b]">
                  No products found.{" "}
                  <Link href="/admin/products/new" className="text-[#b5964e] underline">
                    Add one
                  </Link>
                </td>
              </tr>
            )}
            {products.map((p) => {
              const badge = stockBadge(p.stockStatus);
              const thumb = p.images[0]?.imageUrl;
              return (
                <tr key={p.id} className="hover:bg-[#fafaf9]">
                  <td className="px-4 py-2">
                    <div className="w-10 h-10 bg-[#f5f0e8] rounded overflow-hidden relative">
                      {thumb ? (
                        <Image src={thumb} alt={p.name} fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#e0d9cc] text-xs">—</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#1a1a1a] max-w-[200px] truncate">{p.name}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{p.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-[#1a1a1a]">
                    {p.salePrice ? (
                      <span>
                        <span className="text-red-600">{formatPrice(Number(p.salePrice))}</span>{" "}
                        <span className="line-through text-[#6b6b6b] text-xs">{formatPrice(Number(p.price))}</span>
                      </span>
                    ) : (
                      formatPrice(Number(p.price))
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e]" title="Edit">
                        <Pencil size={14} />
                      </Link>
                      <ProductDeleteButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-4 text-sm">
          {page > 1 && (
            <Link href={`?search=${search}&page=${page - 1}`} className="px-3 py-1.5 border border-[#e0d9cc] hover:border-[#b5964e] text-[#1a1a1a]">
              ← Prev
            </Link>
          )}
          <span className="text-[#6b6b6b]">Page {page} of {totalPages}</span>
          {page < totalPages && (
            <Link href={`?search=${search}&page=${page + 1}`} className="px-3 py-1.5 border border-[#e0d9cc] hover:border-[#b5964e] text-[#1a1a1a]">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
