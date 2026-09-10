export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ProductCard from "@/components/public/ProductCard";
import SearchInput from "./SearchInput";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Spazio catalog of luxury furniture and lighting.",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const products = query
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query } },
            { sku: { contains: query } },
            { description: { contains: query } },
            { itemNumber: { contains: query } },
          ],
        },
        take: 48,
        orderBy: { isFeatured: "desc" },
        select: {
          id: true, name: true, slug: true, price: true, salePrice: true,
          stockStatus: true, shortDescription: true,
          images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true, altText: true, isPrimary: true } },
        },
      })
    : [];

  return (
    <div className="px-6 md:px-10 lg:px-16 py-12">
      <h1
        className="text-3xl font-semibold text-[#1a1a1a] mb-6"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Search
      </h1>

      <SearchInput defaultValue={query} />

      {query && (
        <p className="text-sm text-[#6b6b6b] mt-4 mb-8">
          {products.length === 0
            ? `No results for "${query}"`
            : `${products.length} result${products.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }}
            />
          ))}
        </div>
      )}

      {!query && (
        <p className="text-[#6b6b6b] text-center py-20">Enter a search term above to find products.</p>
      )}
    </div>
  );
}
