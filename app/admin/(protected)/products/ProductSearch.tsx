"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

interface Props {
  categories: { id: number; name: string }[];
  currentSearch?: string;
  currentCategory?: string;
}

export default function ProductSearch({ categories, currentSearch, currentCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      startTransition(() => router.push(`${pathname}?${params.toString()}`));
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]" />
        <input
          defaultValue={currentSearch}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Search by name, SKU, item number…"
          className="w-full border border-[#e0d9cc] pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors"
        />
      </div>
      <select
        defaultValue={currentCategory ?? ""}
        onChange={(e) => update("categoryId", e.target.value)}
        className="border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors"
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}
