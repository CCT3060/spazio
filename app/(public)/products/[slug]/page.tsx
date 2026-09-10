export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/public/ProductGallery";
import EnquireButton from "@/components/public/EnquireButton";
import ProductCard from "@/components/public/ProductCard";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.shortDescription ?? undefined,
  };
}

const stockBadge: Record<string, { label: string; cls: string }> = {
  in_stock:      { label: "In Stock",       cls: "bg-green-50 text-green-700 border border-green-200" },
  out_of_stock:  { label: "Out of Stock",   cls: "bg-red-50 text-red-700 border border-red-200" },
  made_to_order: { label: "Made to Order",  cls: "bg-amber-50 text-amber-700 border border-amber-200" },
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: { include: { parent: { select: { name: true, slug: true } } } },
    },
  });
  if (!product) notFound();

  // Related products — same category, exclude self
  const related = product.categoryId
    ? await prisma.product.findMany({
        where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
        take: 4,
        orderBy: { isFeatured: "desc" },
        select: {
          id: true, name: true, slug: true, price: true, salePrice: true,
          stockStatus: true, shortDescription: true,
          images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true, altText: true, isPrimary: true } },
        },
      })
    : [];

  const badge = stockBadge[product.stockStatus] ?? { label: product.stockStatus, cls: "bg-gray-100 text-gray-600" };
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];

  const attributes = [
    { label: "Item Number", value: product.itemNumber },
    { label: "Material",    value: product.material },
    { label: "Finish",      value: product.finish },
    { label: "Dimensions",  value: product.dimensions },
  ].filter((a) => a.value);

  return (
    <div className="px-6 md:px-10 lg:px-16 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-8 flex-wrap">
        <Link href="/" className="hover:text-[#b5964e]">Home</Link>
        <span>/</span>
        {product.category?.parent && (
          <>
            <Link href={`/collections/${product.category.parent.slug}`} className="hover:text-[#b5964e]">{product.category.parent.name}</Link>
            <span>/</span>
          </>
        )}
        {product.category && (
          <>
            <Link href={`/collections/${product.category.slug}`} className="hover:text-[#b5964e]">{product.category.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#1a1a1a] truncate">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
        {/* Gallery */}
        <ProductGallery
          images={product.images.map((i) => ({
            imageUrl: i.imageUrl,
            altText: i.altText,
            isPrimary: i.isPrimary,
          }))}
          productName={product.name}
        />

        {/* Details — client island handles variant selection */}
        <ProductDetailClient
          product={{
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: Number(product.price),
            salePrice: product.salePrice ? Number(product.salePrice) : null,
            stockStatus: product.stockStatus,
            description: product.description ?? "",
            shortDescription: product.shortDescription ?? "",
            itemNumber: product.itemNumber ?? "",
            variants: product.variants.map((v) => ({
              id: v.id,
              variantName: v.variantName,
              sku: v.sku,
              price: v.price ? Number(v.price) : null,
              stockStatus: v.stockStatus,
            })),
            attributes,
            badge,
          }}
        />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="border-t border-[#e0d9cc] pt-16">
          <h2
            className="text-2xl font-semibold text-[#1a1a1a] mb-8"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={{ ...p, price: Number(p.price), salePrice: p.salePrice ? Number(p.salePrice) : null }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
