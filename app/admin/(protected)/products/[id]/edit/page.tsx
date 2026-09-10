import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    }),
    prisma.category.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="flex items-center gap-1.5 text-xs text-[#6b6b6b] mb-6">
        <Link href="/admin/products" className="hover:text-[#b5964e]">Products</Link>
        <ChevronRight size={12} />
        <span className="text-[#1a1a1a]">{product.name}</span>
      </div>
      <h1
        className="text-2xl font-semibold text-[#1a1a1a] mb-8"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Edit Product
      </h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          sku: product.sku,
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          description: product.description ?? "",
          shortDescription: product.shortDescription ?? "",
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() ?? "",
          itemNumber: product.itemNumber ?? "",
          material: product.material ?? "",
          finish: product.finish ?? "",
          dimensions: product.dimensions ?? "",
          stockStatus: product.stockStatus,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          images: product.images.map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText ?? "",
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
          variants: product.variants.map((v) => ({
            id: v.id,
            variantName: v.variantName,
            sku: v.sku,
            price: v.price?.toString() ?? "",
            stockStatus: v.stockStatus ?? "",
            imageUrl: v.imageUrl ?? "",
          })),
        }}
      />
    </div>
  );
}
