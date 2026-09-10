export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/public/ProductCard";
import SortDropdown from "@/components/public/SortDropdown";
import FilterBar from "@/components/public/FilterBar";
import Link from "next/link";

const PAGE_SIZE = 24;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    page?: string;
    inStock?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description ?? `Browse our ${cat.name} collection`,
  };
}

function buildOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":  return { price: "asc" };
    case "price_desc": return { price: "desc" };
    case "name_asc":   return { name: "asc" };
    case "name_desc":  return { name: "desc" };
    case "newest":     return { createdAt: "desc" };
    case "featured":
    default:           return { isFeatured: "desc" };
  }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));
  const sort = sp.sort ?? "featured";
  const inStock = sp.inStock === "1";
  const minPrice = sp.minPrice ? parseFloat(sp.minPrice) : undefined;
  const maxPrice = sp.maxPrice ? parseFloat(sp.maxPrice) : undefined;

  // Fetch the category + its children IDs (for nested collection support)
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: { children: { where: { isActive: true }, select: { id: true } }, parent: { select: { name: true, slug: true } } },
  });
  if (!category) notFound();

  const categoryIds = [category.id, ...category.children.map((c) => c.id)];

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    categoryId: { in: categoryIds },
    ...(inStock && { stockStatus: "in_stock" }),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? { price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) } }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        stockStatus: true,
        shortDescription: true,
        images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true, altText: true, isPrimary: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const q = new URLSearchParams({ ...(sort !== "featured" && { sort }), ...(sp.inStock && { inStock: sp.inStock }), ...(sp.minPrice && { minPrice: sp.minPrice }), ...(sp.maxPrice && { maxPrice: sp.maxPrice }), ...(p > 1 && { page: String(p) }) });
    return `?${q.toString()}`;
  }

  return (
    <div className="px-6 md:px-10 lg:px-16 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-6">
        <Link href="/" className="hover:text-[#b5964e]">Home</Link>
        <span>/</span>
        {category.parent && (
          <>
            <Link href={`/collections/${category.parent.slug}`} className="hover:text-[#b5964e]">
              {category.parent.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1a1a1a]">{category.name}</span>
      </nav>

      {/* Heading + sub-collections */}
      <div className="mb-6">
        <h1
          className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {category.name}
        </h1>
        {category.description && (
          <p className="text-[#6b6b6b] text-sm max-w-2xl">{category.description}</p>
        )}
        {/* Sub-category chips */}
        {category.children.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {category.children.map(async (child) => {
              const c = await prisma.category.findUnique({ where: { id: child.id }, select: { name: true, slug: true } });
              if (!c) return null;
              return (
                <Link
                  key={child.id}
                  href={`/collections/${c.slug}`}
                  className="px-4 py-1.5 border border-[#e0d9cc] text-xs uppercase tracking-widest text-[#1a1a1a] hover:border-[#b5964e] hover:text-[#b5964e] transition-colors"
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Filters + sort toolbar */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-2">
        <FilterBar
          currentInStock={inStock}
          currentMinPrice={sp.minPrice}
          currentMaxPrice={sp.maxPrice}
        />
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-[#6b6b6b]">{total} {total === 1 ? "item" : "items"}</span>
          <SortDropdown current={sort} />
        </div>
      </div>

      {/* Grid */}
      {products.length === 0 ? (
        <div className="py-24 text-center text-[#6b6b6b]">
          <p className="text-lg mb-2">No products found</p>
          <p className="text-sm">Try adjusting or clearing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                ...p,
                price: Number(p.price),
                salePrice: p.salePrice ? Number(p.salePrice) : null,
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-16">
          {page > 1 && (
            <Link href={pageUrl(page - 1)} className="px-4 py-2 border border-[#e0d9cc] text-sm text-[#1a1a1a] hover:border-[#b5964e] transition-colors">
              ← Previous
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
            .map((p, idx, arr) => (
              <>
                {idx > 0 && arr[idx - 1] !== p - 1 && <span key={`ellipsis-${p}`} className="text-[#6b6b6b]">…</span>}
                <Link
                  key={p}
                  href={pageUrl(p)}
                  className={`px-4 py-2 border text-sm transition-colors ${p === page ? "border-[#b5964e] bg-[#b5964e] text-white" : "border-[#e0d9cc] text-[#1a1a1a] hover:border-[#b5964e]"}`}
                >
                  {p}
                </Link>
              </>
            ))}
          {page < totalPages && (
            <Link href={pageUrl(page + 1)} className="px-4 py-2 border border-[#e0d9cc] text-sm text-[#1a1a1a] hover:border-[#b5964e] transition-colors">
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
