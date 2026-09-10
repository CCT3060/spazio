import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Spazio",
  description:
    "Spazio curates exceptional furniture and lighting for discerning interiors worldwide. Learn about our story, values, and commitment to craft.",
};

export default function AboutPage() {
  return (
    <>
      {/* Google Fonts — Jost for body */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&display=swap');`}</style>

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#f7f5f0] pt-32 pb-24 px-6 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-[10px] uppercase tracking-[0.4em] text-[#b5964e] mb-8"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Our Story
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1a1a1a] leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textWrap: "balance" }}
            >
              Curated for<br />
              <em className="not-italic text-[#b5964e]">those who know</em><br />
              the difference.
            </h1>

            <div className="lg:pb-3">
              <p
                className="text-[15px] text-[#5a5248] leading-[1.85] max-w-md"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
              >
                Spazio was founded on a single conviction: that the objects we live with
                shape the quality of our lives. We source, curate, and present furniture and
                lighting that reward attention — pieces built to last a generation, chosen to
                endure beyond every season.
              </p>
              <div className="mt-8 w-12 h-px bg-[#b5964e]" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DIVIDER IMAGE BAND ────────────────────────────────────────────── */}
      <div className="h-[2px] bg-[#e8e2d8]" />

      {/* ── 3. STORY SPLIT ───────────────────────────────────────────────────── */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 items-start">
          {/* Left — pull quote */}
          <div className="lg:sticky lg:top-32">
            <blockquote
              className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-snug"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textWrap: "balance" }}
            >
              "Every room tells a story. We help you tell it with precision."
            </blockquote>
            <p
              className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#8a7f72]"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              — Spazio, est. 2008
            </p>
          </div>

          {/* Right — narrative */}
          <div
            className="space-y-6 text-[14.5px] text-[#5a5248] leading-[1.9]"
            style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
          >
            <p>
              We began in a single showroom with a modest collection of European lighting and a
              belief that Indian homes deserved access to the same calibre of design that had
              long defined interiors in Milan, Paris, and New York. That first room drew
              architects, interior designers, and homeowners who were searching for the same
              thing we were: objects that carried real intention.
            </p>
            <p>
              Over the years, the collection has grown — but the method has not changed.
              Every brand we carry is vetted for its commitment to material honesty, considered
              proportion, and lasting construction. We do not chase volume. We choose slowly,
              present carefully, and stand behind everything we offer.
            </p>
            <p>
              Today, Spazio represents over 200 international brands across furniture,
              lighting, rugs, and accessories. Our clients range from private homeowners
              completing a single room to hospitality and commercial projects spanning
              entire properties. In each case, the approach is the same: listen first,
              then curate.
            </p>
            <p>
              We also work closely with the trade. Architects and interior designers who
              partner with us through our Trade Program gain access to exclusive pricing,
              early previews of new arrivals, and a dedicated project-support team.
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. VALUES ────────────────────────────────────────────────────────── */}
      <section className="bg-[#f7f5f0] px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto">
          <p
            className="text-[10px] uppercase tracking-[0.4em] text-[#b5964e] mb-14"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            What guides us
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[#e8e2d8]">
            {[
              {
                label: "Curation",
                body: "We edit relentlessly. Of every brand we consider, fewer than one in ten makes it into the collection. What remains is chosen because it is genuinely the best of its kind — not merely available.",
              },
              {
                label: "Craft",
                body: "We prioritise makers who still do things the slow way: hand-applied finishes, joinery over fasteners, upholstery that can be re-covered in twenty years. Craft is not a marketing word here; it is a specification.",
              },
              {
                label: "Longevity",
                body: "We are not interested in furniture that photographs well once. We want pieces that improve with age, that become part of a home's memory, and that will outlast every trend cycle around them.",
              },
            ].map((v) => (
              <div
                key={v.label}
                className="border-b md:border-b-0 md:border-r border-[#e8e2d8] last:border-0 py-10 md:pr-10 md:pl-0 first:pl-0 [&:not(:first-child)]:md:pl-10"
              >
                <h3
                  className="text-xl font-semibold text-[#1a1a1a] mb-4"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {v.label}
                </h3>
                <p
                  className="text-[13.5px] text-[#6b6560] leading-[1.85]"
                  style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-[#2e2b26] px-6 md:px-16 lg:px-24 py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { num: "15+", label: "Years in operation" },
            { num: "200+", label: "International brands" },
            { num: "40+", label: "Countries of origin" },
            { num: "5,000+", label: "Products available" },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-4xl md:text-5xl font-semibold text-[#b5964e] mb-2 tabular-nums"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {s.num}
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.25em] text-[#9a9083]"
                style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400 }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. TRADE PROGRAM CALLOUT ─────────────────────────────────────────── */}
      <section className="bg-white px-6 md:px-16 lg:px-24 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.4em] text-[#b5964e] mb-6"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              For the trade
            </p>
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-snug mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", textWrap: "balance" }}
            >
              A dedicated programme for architects &amp; interior designers.
            </h2>
            <p
              className="text-[14px] text-[#6b6560] leading-[1.85] mb-8 max-w-md"
              style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300 }}
            >
              Trade members receive exclusive net pricing, priority project support, early
              access to new arrivals, and a personal account manager. The programme is open
              to registered professionals.
            </p>
            <Link
              href="/pages/trade-program"
              className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#1a1a1a] border-b border-[#1a1a1a] pb-0.5 hover:text-[#b5964e] hover:border-[#b5964e] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Learn about the Trade Program
            </Link>
          </div>

          {/* Right — decorative rule grid */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square border border-[#e8e2d8]"
                style={{ opacity: 0.4 + (i % 3) * 0.2 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CTA ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#f7f5f0] px-6 md:px-16 lg:px-24 py-24 border-t border-[#e8e2d8]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] leading-snug max-w-md"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", textWrap: "balance" }}
          >
            The collection is waiting.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/collections"
              className="inline-block bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.3em] px-10 py-4 hover:bg-[#b5964e] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Explore Collections
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-[#1a1a1a] text-[#1a1a1a] text-[10px] uppercase tracking-[0.3em] px-10 py-4 hover:border-[#b5964e] hover:text-[#b5964e] transition-colors"
              style={{ fontFamily: "'Jost', sans-serif" }}
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
