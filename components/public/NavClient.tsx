"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Search, X, ChevronRight, Menu, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavCategory {
  id: number;
  name: string;
  slug: string;
  children: { id: number; name: string; slug: string }[];
}

export default function NavClient({
  categories,
  announcement,
}: {
  categories: NavCategory[];
  announcement: string;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);
  const [openKey, setOpenKey] = useState(0);
  const lastY = useRef(0);

  useEffect(() => {
    if (!isHomePage) { setScrolled(true); return; }
    setScrolled(window.scrollY > 40);
    setHidden(false);
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 80) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  useEffect(() => {
    if (isHomePage) return;
    function onScroll() {
      const y = window.scrollY;
      if (y > 80) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) setExpandedCat(null);
    else setOpenKey((k) => k + 1);
  }, [menuOpen]);

  const isTransparent = isHomePage && !scrolled;

  const navBgClass = isTransparent
    ? "bg-transparent border-transparent"
    : "bg-white/95 backdrop-blur-sm border-b border-[#e0d9cc]";

  const activeCat = categories.find((c) => c.id === expandedCat) ?? null;

  return (
    <>
      {/* Announcement bar */}
      {announcement && !menuOpen && (
        <div className="fixed top-0 left-0 right-0 z-[70] bg-[#1a1a1a] text-white text-center py-2 text-xs tracking-widest">
          {announcement}
        </div>
      )}

      {/* Main header */}
      <header
        className={cn(
          "fixed left-0 right-0 z-[60] transition-all duration-300",
          announcement && !menuOpen ? "top-8" : "top-0",
          navBgClass,
          !menuOpen && hidden ? "-translate-y-full" : "translate-y-0"
        )}
      >
        <div className="flex items-center justify-between px-6 md:px-10 lg:px-16 h-16">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className={cn(
                "flex items-center p-1 transition-colors",
                isTransparent ? "text-white" : "text-[#1a1a1a]"
              )}
            >
              {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "shrink-0 text-xl font-semibold tracking-wide transition-colors",
                isTransparent ? "text-white" : "text-[#1a1a1a]"
              )}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Spazio
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/search"
              className={cn(
                "p-2 transition-colors",
                isTransparent ? "text-white hover:text-white/70" : "text-[#1a1a1a] hover:text-[#b5964e]"
              )}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href="/contact"
              className={cn(
                "hidden sm:inline-flex items-center px-4 py-2 text-xs uppercase tracking-widest transition-colors",
                isTransparent
                  ? "border border-white text-white hover:bg-white hover:text-[#1a1a1a]"
                  : "border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white"
              )}
            >
              Enquire
            </Link>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={cn(
          "fixed inset-0 z-[55] bg-black/60 backdrop-blur-[3px] transition-opacity duration-400",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* ── Dark luxury drawer ── */}
      <div
        className={cn(
          "fixed top-0 left-0 z-[65] h-full w-[300px] bg-[#0f0f0f] flex flex-col transition-transform duration-350 ease-in-out",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <style>{`
          @keyframes navItemReveal {
            from { opacity: 0; transform: translateX(-12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          .nav-item-animate {
            opacity: 0;
            animation: navItemReveal 0.42s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .nav-link-inner { transition: transform 0.2s ease; }
          .nav-link-btn:hover .nav-link-inner,
          .nav-link-anchor:hover .nav-link-inner { transform: translateX(4px); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>

        {/* Drawer header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-6 border-b border-white/8">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-white text-lg font-semibold tracking-wide hover:text-[#b5964e] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Spazio
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="p-1.5 text-white/30 hover:text-white transition-colors"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Category list */}
        <nav className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-4" key={openKey}>
          {categories.map((cat, i) => {
            const hasChildren = cat.children.length > 0;
            const isActive = expandedCat === cat.id;
            const idx = String(i + 1).padStart(2, "0");

            return (
              <div
                key={cat.id}
                className="nav-item-animate"
                style={{ animationDelay: `${i * 38}ms` }}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={() => setExpandedCat(isActive ? null : cat.id)}
                    className={cn(
                      "nav-link-btn w-full flex items-center gap-4 px-7 py-4 text-left border-l-2 transition-all duration-200",
                      isActive
                        ? "border-[#b5964e] bg-white/4 text-[#b5964e]"
                        : "border-transparent text-white/50 hover:text-white hover:border-white/20"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] tabular-nums font-light shrink-0 transition-colors",
                      isActive ? "text-[#b5964e]" : "text-white/20"
                    )}>
                      {idx}
                    </span>
                    <span className="nav-link-inner flex-1 text-[11.5px] uppercase tracking-[0.28em] font-light">
                      {cat.name}
                    </span>
                    <ChevronRight
                      size={12}
                      strokeWidth={1.5}
                      className={cn(
                        "shrink-0 transition-all duration-200",
                        isActive ? "text-[#b5964e] translate-x-1" : "text-white/20"
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "nav-link-anchor flex items-center gap-4 px-7 py-4 border-l-2 border-transparent text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
                    )}
                  >
                    <span className="text-[10px] tabular-nums font-light shrink-0 text-white/20">{idx}</span>
                    <span className="nav-link-inner text-[11.5px] uppercase tracking-[0.28em] font-light">
                      {cat.name}
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* Thin divider */}
        <div className="mx-7 h-px bg-white/8" />

        {/* Footer links */}
        <div
          className="px-7 py-6 flex flex-col gap-3 nav-item-animate"
          style={{ animationDelay: `${categories.length * 38 + 50}ms` }}
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 mb-1">Explore</p>
          {[
            { label: "About Us", href: "/pages/about-us" },
            { label: "Trade Program", href: "/pages/trade-program" },
            { label: "Contact", href: "/contact" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="text-[10px] uppercase tracking-[0.25em] text-white/35 hover:text-[#b5964e] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Dark subcategory flyout ── */}
      <div
        className={cn(
          "fixed top-0 left-[300px] z-[65] h-full w-[260px] bg-[#181818] flex flex-col transition-all duration-300 ease-in-out",
          activeCat
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-4 pointer-events-none"
        )}
      >
        {activeCat && (
          <>
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 pt-7 pb-6 border-b border-white/8">
              <button
                type="button"
                onClick={() => setExpandedCat(null)}
                className="p-1 text-white/30 hover:text-white transition-colors shrink-0"
                aria-label="Back"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
              </button>
              <span
                className="text-[11px] uppercase tracking-[0.35em] text-white/60 font-light"
              >
                {activeCat.name}
              </span>
            </div>

            {/* View all + subcategories */}
            <nav className="flex-1 overflow-y-auto no-scrollbar py-4">
              {/* View All row */}
              <Link
                href={`/collections/${activeCat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-4 px-6 py-4 border-l-2 border-[#b5964e] mb-2 transition-all hover:bg-white/4"
              >
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#b5964e] font-light">
                  View All
                </span>
                <ChevronRight size={11} strokeWidth={1.5} className="text-[#b5964e] ml-auto opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Subcategory links */}
              {activeCat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collections/${child.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-4 px-6 py-3.5 border-l-2 border-transparent hover:border-white/20 text-white/40 hover:text-white/85 hover:bg-white/4 transition-all duration-200"
                >
                  <span className="text-[11px] uppercase tracking-[0.22em] font-light">
                    {child.name}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Panel footer */}
            <div className="px-6 py-5 border-t border-white/8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/15">
                Spazio
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
