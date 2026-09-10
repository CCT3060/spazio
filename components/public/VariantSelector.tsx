"use client";

import { useState } from "react";
import { cn, formatPrice } from "@/lib/utils";

interface Variant {
  id: number;
  variantName: string;
  sku: string;
  price: number | null;
  stockStatus: string | null;
}

interface Props {
  variants: Variant[];
  basePrice: number;
  baseSku: string;
  onSelect: (v: { price: number; sku: string; stockStatus: string | null } | null) => void;
}

export default function VariantSelector({ variants, basePrice, baseSku, onSelect }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  function select(v: Variant) {
    if (selected === v.id) {
      setSelected(null);
      onSelect(null);
    } else {
      setSelected(v.id);
      onSelect({ price: v.price ?? basePrice, sku: v.sku, stockStatus: v.stockStatus });
    }
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-2">Select Option</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => select(v)}
            className={cn(
              "px-4 py-2 border text-sm transition-colors",
              selected === v.id
                ? "border-[#b5964e] bg-[#b5964e] text-white"
                : "border-[#e0d9cc] text-[#1a1a1a] hover:border-[#b5964e]"
            )}
          >
            <span>{v.variantName}</span>
            {v.price && v.price !== basePrice && (
              <span className="ml-2 text-xs opacity-75">{formatPrice(v.price)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
