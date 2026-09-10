import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    salePrice?: string | number | null;
    stockStatus: string;
    images: { imageUrl: string; altText?: string | null; isPrimary: boolean }[];
    shortDescription?: string | null;
  };
}

const stockLabel: Record<string, { text: string; cls: string }> = {
  in_stock:      { text: "In Stock",       cls: "text-green-700" },
  out_of_stock:  { text: "Out of Stock",   cls: "text-red-500" },
  made_to_order: { text: "Made to Order",  cls: "text-amber-700" },
};

export default function ProductCard({ product }: Props) {
  const primary = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const badge = stockLabel[product.stockStatus] ?? { text: product.stockStatus, cls: "text-gray-500" };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square bg-[#f5f0e8] overflow-hidden mb-3">
        {primary ? (
          <Image
            src={primary.imageUrl}
            alt={primary.altText ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#e0d9cc] text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-[#6b6b6b] truncate">
          {product.shortDescription ?? ""}
        </p>
        <h3
          className="text-base font-medium text-[#1a1a1a] group-hover:text-[#b5964e] transition-colors line-clamp-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-medium text-red-600">{formatPrice(Number(product.salePrice))}</span>
              <span className="text-sm text-[#6b6b6b] line-through">{formatPrice(Number(product.price))}</span>
            </>
          ) : (
            <span className="text-sm text-[#1a1a1a]">{formatPrice(Number(product.price))}</span>
          )}
        </div>
        <p className={`text-xs ${badge.cls}`}>{badge.text}</p>
      </div>
    </Link>
  );
}
