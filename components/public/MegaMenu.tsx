"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavCategory {
  id: number;
  name: string;
  slug: string;
  children: { id: number; name: string; slug: string }[];
}

interface Props {
  categories: NavCategory[];
}

export default function MegaMenu({ categories }: Props) {
  const [open, setOpen] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {/* Desktop nav */}
      <nav ref={menuRef} className="hidden md:flex items-center gap-0 relative" aria-label="Main navigation">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onMouseEnter={() => setOpen(cat.id)}
            onMouseLeave={() => setOpen(null)}
            className="relative"
          >
            <Link
              href={`/collections/${cat.slug}`}
              className={cn(
                "flex items-center gap-1 px-4 py-2 text-xs uppercase tracking-widest transition-colors",
                open === cat.id ? "text-[#b5964e]" : "text-[#1a1a1a] hover:text-[#b5964e]"
              )}
              onClick={() => setOpen(null)}
            >
              {cat.name}
              {cat.children.length > 0 && (
                <ChevronDown size={12} className={cn("transition-transform", open === cat.id && "rotate-180")} />
              )}
            </Link>

            {/* Dropdown */}
            {cat.children.length > 0 && open === cat.id && (
              <div className="absolute top-full left-0 min-w-[200px] bg-white border border-[#e0d9cc] shadow-lg z-50 py-2">
                {cat.children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/collections/${child.slug}`}
                    onClick={() => setOpen(null)}
                    className="block px-5 py-2.5 text-sm text-[#1a1a1a] hover:bg-[#f5f0e8] hover:text-[#b5964e] transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
                <div className="border-t border-[#e0d9cc] mt-1 pt-1">
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={() => setOpen(null)}
                    className="block px-5 py-2 text-xs uppercase tracking-widest text-[#b5964e] hover:text-[#9a7d3a]"
                  >
                    View All {cat.name} →
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden p-2 text-[#1a1a1a]"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          {/* Panel */}
          <div className="absolute top-0 left-0 bottom-0 w-72 bg-white overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#e0d9cc]">
              <span
                className="text-lg font-semibold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Spazio
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-[#6b6b6b]">
                <X size={20} />
              </button>
            </div>
            <nav className="py-4">
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between px-6 py-3">
                    <Link
                      href={`/collections/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm font-medium text-[#1a1a1a] uppercase tracking-widest"
                    >
                      {cat.name}
                    </Link>
                    {cat.children.length > 0 && (
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === cat.id ? null : cat.id)
                        }
                        className="p-1 text-[#6b6b6b]"
                      >
                        <ChevronDown
                          size={14}
                          className={cn(
                            "transition-transform",
                            mobileExpanded === cat.id && "rotate-180"
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {mobileExpanded === cat.id && cat.children.length > 0 && (
                    <div className="bg-[#fafaf9] py-1">
                      {cat.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/collections/${child.slug}`}
                          onClick={() => setMobileOpen(false)}
                          className="block px-10 py-2.5 text-sm text-[#6b6b6b] hover:text-[#b5964e]"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-[#e0d9cc] mt-4 pt-4 px-6 space-y-3">
                {["About Us", "Trade Program", "Contact"].map((label) => (
                  <Link
                    key={label}
                    href={
                      label === "Contact"
                        ? "/contact"
                        : `/pages/${label.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-[#6b6b6b] hover:text-[#b5964e]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
