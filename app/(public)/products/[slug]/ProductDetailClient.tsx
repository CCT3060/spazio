"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import VariantSelector from "@/components/public/VariantSelector";
import EnquireButton from "@/components/public/EnquireButton";

interface Variant {
  id: number;
  variantName: string;
  sku: string;
  price: number | null;
  stockStatus: string | null;
}

interface Props {
  product: {
    id: number;
    name: string;
    sku: string;
    price: number;
    salePrice: number | null;
    stockStatus: string;
    description: string;
    shortDescription: string;
    itemNumber: string;
    variants: Variant[];
    attributes: { label: string; value: string | null | undefined }[];
    badge: { label: string; cls: string };
  };
}

export default function ProductDetailClient({ product }: Props) {
  const [selectedVariant, setSelectedVariant] = useState<{
    price: number;
    sku: string;
    stockStatus: string | null;
  } | null>(null);

  const displayPrice = selectedVariant?.price ?? (product.salePrice ?? product.price);
  const displayOriginalPrice = selectedVariant ? null : (product.salePrice ? product.price : null);
  const displaySku = selectedVariant?.sku ?? product.sku;
  const displayStock = selectedVariant?.stockStatus ?? product.stockStatus;

  const stockMap: Record<string, { label: string; cls: string }> = {
    in_stock:      { label: "In Stock",       cls: "bg-green-50 text-green-700 border border-green-200" },
    out_of_stock:  { label: "Out of Stock",   cls: "bg-red-50 text-red-700 border border-red-200" },
    made_to_order: { label: "Made to Order",  cls: "bg-amber-50 text-amber-700 border border-amber-200" },
  };
  const badge = stockMap[displayStock] ?? product.badge;

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <h1
          className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-tight mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {product.name}
        </h1>
        {product.shortDescription && (
          <p className="text-[#6b6b6b] text-sm">{product.shortDescription}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium text-[#1a1a1a]">{formatPrice(displayPrice)}</span>
        {displayOriginalPrice && (
          <span className="text-base text-[#6b6b6b] line-through">{formatPrice(displayOriginalPrice)}</span>
        )}
      </div>

      {/* Stock + SKU */}
      <div className="flex items-center gap-4">
        <span className={`inline-block px-3 py-1 text-xs rounded-full ${badge.cls}`}>{badge.label}</span>
        <span className="text-xs text-[#6b6b6b] font-mono">SKU: {displaySku}</span>
        {product.itemNumber && (
          <span className="text-xs text-[#6b6b6b]">Item: {product.itemNumber}</span>
        )}
      </div>

      {/* Variants */}
      {product.variants.length > 0 && (
        <VariantSelector
          variants={product.variants}
          basePrice={product.price}
          baseSku={product.sku}
          onSelect={setSelectedVariant}
        />
      )}

      {/* Enquire CTA */}
      <div className="pt-2">
        <EnquireButton productName={product.name} productSku={displaySku} />
        <p className="text-xs text-center text-[#6b6b6b] mt-3">
          No transactions on this site — contact us to arrange purchase
        </p>
      </div>

      {/* Attributes */}
      {product.attributes.length > 0 && (
        <div className="border-t border-[#e0d9cc] pt-6 space-y-2">
          {product.attributes.map((a) => (
            <div key={a.label} className="flex gap-4 text-sm">
              <span className="text-[#6b6b6b] w-28 shrink-0">{a.label}</span>
              <span className="text-[#1a1a1a]">{a.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div className="border-t border-[#e0d9cc] pt-6">
          <h3
            className="text-sm font-medium uppercase tracking-widest text-[#6b6b6b] mb-3"
          >
            Description
          </h3>
          <div
            className="prose-luxury text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}
    </div>
  );
}
