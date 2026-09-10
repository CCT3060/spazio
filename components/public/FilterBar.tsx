"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

interface Props {
  currentInStock?: boolean;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export default function FilterBar({ currentInStock, currentMinPrice, currentMaxPrice }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, start] = useTransition();
  const [minPrice, setMinPrice] = useState(currentMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice ?? "");

  function update(key: string, value: string | undefined) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    p.delete("page");
    start(() => router.push(`${pathname}?${p.toString()}`));
  }

  function applyPrice() {
    const p = new URLSearchParams(searchParams.toString());
    if (minPrice) p.set("minPrice", minPrice); else p.delete("minPrice");
    if (maxPrice) p.set("maxPrice", maxPrice); else p.delete("maxPrice");
    p.delete("page");
    start(() => router.push(`${pathname}?${p.toString()}`));
  }

  const hasFilters = currentInStock || currentMinPrice || currentMaxPrice;

  return (
    <div className="flex flex-wrap items-end gap-4 py-4 border-b border-[#e0d9cc] mb-6 text-sm">
      {/* Availability */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!currentInStock}
          onChange={(e) => update("inStock", e.target.checked ? "1" : undefined)}
          className="accent-[#b5964e] w-4 h-4"
        />
        <span className="text-sm text-[#1a1a1a]">In stock only</span>
      </label>

      {/* Price range */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-24 border border-[#e0d9cc] px-2 py-1.5 text-sm focus:outline-none focus:border-[#b5964e]"
          min={0}
        />
        <span className="text-[#6b6b6b]">–</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-24 border border-[#e0d9cc] px-2 py-1.5 text-sm focus:outline-none focus:border-[#b5964e]"
          min={0}
        />
        <button
          onClick={applyPrice}
          className="px-3 py-1.5 bg-[#1a1a1a] text-white text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
        >
          Apply
        </button>
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => {
            setMinPrice(""); setMaxPrice("");
            const p = new URLSearchParams(searchParams.toString());
            ["inStock", "minPrice", "maxPrice"].forEach((k) => p.delete(k));
            start(() => router.push(`${pathname}?${p.toString()}`));
          }}
          className="text-xs text-[#b5964e] underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
