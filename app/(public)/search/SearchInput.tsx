"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchInput({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(value.trim())}`);
      }}
      className="flex max-w-xl"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, SKUs, materials…"
        className="flex-1 border border-[#e0d9cc] px-4 py-3 text-sm focus:outline-none focus:border-[#b5964e] transition-colors"
        autoFocus
      />
      <button
        type="submit"
        className="px-5 bg-[#1a1a1a] text-white hover:bg-[#b5964e] transition-colors"
      >
        <Search size={18} strokeWidth={1.5} />
      </button>
    </form>
  );
}
