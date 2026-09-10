"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc",   label: "Name: A – Z" },
  { value: "name_desc",  label: "Name: Z – A" },
];

export default function SortDropdown({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, start] = useTransition();

  function handleChange(value: string) {
    const p = new URLSearchParams(searchParams.toString());
    p.set("sort", value);
    p.delete("page");
    start(() => router.push(`${pathname}?${p.toString()}`));
  }

  return (
    <select
      defaultValue={current ?? "featured"}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-[#e0d9cc] px-3 py-2 text-sm focus:outline-none focus:border-[#b5964e] transition-colors bg-white"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
