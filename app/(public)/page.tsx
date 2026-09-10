export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/public/HeroSlider";
import NewsletterForm from "@/components/public/NewsletterForm";

type Cat = { id: number; name: string; slug: string; imageUrl: string | null; description: string | null };

async function getData() {
  try {
    const [slides, sections, allCategories] = await Promise.all([
      prisma.homepageSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.homepageSection.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true, imageUrl: true, description: true },
      }),
    ]);

    const showcaseSection = sections.find((s) => s.sectionType === "category_showcase") ?? null;
    const tradeCta        = sections.find((s) => s.sectionType === "trade_cta")         ?? null;

    const dynamicSections = sections.filter(
      (s) => s.sectionType !== "category_showcase" && s.sectionType !== "trade_cta"
    );

    let showcaseCats: Cat[] = [];
    if (showcaseSection?.bodyText) {
      const slugs = showcaseSection.bodyText.split(",").map((s) => s.trim()).filter(Boolean);
      showcaseCats = slugs
        .map((sl) => allCategories.find((c) => c.slug === sl))
        .filter((c): c is Cat => !!c)
        .slice(0, 6);
    } else {
      showcaseCats = allCategories.slice(0, 6);
    }

    return { slides, showcaseCats, tradeCta, dynamicSections, allCategories };
  } catch {
    // DB unreachable — return empty state instead of crashing
    return { slides: [], showcaseCats: [], tradeCta: null, dynamicSections: [], allCategories: [] };
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

function embedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&muted=1&loop=1&playlist=${yt[1]}&controls=0&rel=0`;
  const vim = url.match(/vimeo\.com\/(\d+)/);
  if (vim) return `https://player.vimeo.com/video/${vim[1]}?autoplay=1&muted=1&loop=1&background=1`;
  return url;
}

function isDirectVideo(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

function resolveCats(bodyText: string | null, all: Cat[]): Cat[] {
  if (!bodyText) return [];
  const slugs = bodyText.split(",").map((s) => s.trim()).filter(Boolean);
  return slugs
    .map((sl) => all.find((c) => c.slug === sl))
    .filter((c): c is Cat => !!c)
    .slice(0, 3);
}

// ── Content Block ─────────────────────────────────────────────────────────────

type Sec = {
  layout?: string | null;
  title: string | null;
  subtitle: string | null;
  excerpt?: string | null;
  bodyText: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  linkUrl: string | null;
  buttonText?: string | null;
};

function ContentBlock({ s, imageLeft }: { s: Sec; imageLeft?: boolean }) {
  // VIDEO
  if (s.videoUrl) {
    const raw = s.videoUrl.match(/^https?:\/\//i) ? s.videoUrl : `https://${s.videoUrl}`;
    const direct = isDirectVideo(raw);
    return (
      <section className="relative w-full min-h-[380px] md:min-h-[460px] overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-0">
          {direct
            ? <video src={raw} autoPlay muted loop playsInline className="w-full h-full object-cover" />
            : <iframe src={embedUrl(raw)} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full border-0 scale-105" title={s.title ?? "Video"} />
          }
        </div>
        {(s.title || s.subtitle || s.bodyText || s.linkUrl) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end h-full min-h-[380px] md:min-h-[460px] px-8 md:px-16 lg:px-24 py-16">
              <div className="max-w-xl">
                {s.subtitle && <p className="text-white/60 text-[10px] uppercase tracking-[0.35em] mb-4">{s.subtitle}</p>}
                {s.title && <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h2>}
                {s.excerpt && <p className="text-white/70 text-sm leading-relaxed mb-8">{s.excerpt}</p>}
                {s.linkUrl && <Link href={s.linkUrl} className="inline-block border border-white text-white text-[10px] uppercase tracking-[0.25em] px-8 py-3.5 hover:bg-white hover:text-[#1a1a1a] transition-colors">{s.buttonText || "Explore"}</Link>}
              </div>
            </div>
          </>
        )}
      </section>
    );
  }

  // BACKGROUND IMAGE
  if (s.layout === "bg_image" && s.imageUrl) {
    return (
      <section className="relative w-full min-h-[560px] md:min-h-[640px] overflow-hidden bg-[#1a1a1a]">
        <Image src={s.imageUrl} alt={s.title ?? ""} fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full min-h-[560px] md:min-h-[640px] px-8 md:px-16 lg:px-24 py-20 text-center">
          <div className="max-w-2xl">
            {s.subtitle && <p className="text-white/60 text-[10px] uppercase tracking-[0.35em] mb-4">{s.subtitle}</p>}
            {s.title && <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h2>}
            {s.excerpt && <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-lg mx-auto">{s.excerpt}</p>}
            {s.linkUrl && <Link href={s.linkUrl} className="inline-block border border-white text-white text-[10px] uppercase tracking-[0.25em] px-8 py-3.5 hover:bg-white hover:text-[#1a1a1a] transition-colors">{s.buttonText || "Explore"}</Link>}
          </div>
        </div>
      </section>
    );
  }

  // IMAGE + TEXT
  if (s.imageUrl) {
    const textOrder  = imageLeft ? "order-2 md:order-2" : "order-2 md:order-1";
    const imageOrder = imageLeft ? "order-1 md:order-1" : "order-1 md:order-2";
    return (
      <section className="bg-[#f5f0e8]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
          <div className={`relative min-h-[360px] md:min-h-0 ${imageOrder}`}>
            <Image src={s.imageUrl} alt={s.title ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className={`flex items-center px-10 lg:px-20 py-20 ${textOrder}`}>
            <div className="max-w-md">
              {s.subtitle && <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5964e] mb-4">{s.subtitle}</p>}
              {s.title && <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h2>}
              {s.excerpt && <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">{s.excerpt}</p>}
              {s.linkUrl && <Link href={s.linkUrl} className="inline-block bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.25em] px-8 py-3.5 hover:bg-[#b5964e] transition-colors">{s.buttonText || "Read More"}</Link>}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // TEXT ONLY
  if (s.title || s.excerpt) {
    return (
      <section className="bg-[#f5f0e8] py-20 px-8 md:px-16 lg:px-24">
        <div className="max-w-2xl mx-auto">
          {s.subtitle && <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5964e] mb-4">{s.subtitle}</p>}
          {s.title && <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{s.title}</h2>}
          {s.excerpt && <p className="text-[#6b6b6b] text-sm leading-relaxed mb-8">{s.excerpt}</p>}
          {s.linkUrl && <Link href={s.linkUrl} className="inline-block bg-[#1a1a1a] text-white text-[10px] uppercase tracking-[0.25em] px-8 py-3.5 hover:bg-[#b5964e] transition-colors">{s.buttonText || "Learn More"}</Link>}
        </div>
      </section>
    );
  }

  return null;
}

// ── Trio Section ──────────────────────────────────────────────────────────────

function TrioSection({ cats }: { cats: Cat[] }) {
  return (
    <section className="bg-[#f5f0e8] px-6 md:px-10 lg:px-16 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {cats.map((cat) => (
          <Link key={cat.id} href={`/collections/${cat.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden mb-5 bg-[#e0d9cc]">
              {cat.imageUrl ? (
                <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#d5ccc0] to-[#c5bfb5]" />
              )}
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#1a1a1a] mb-2 group-hover:text-[#b5964e] transition-colors">{cat.name}</p>
            {cat.description && <p className="text-sm text-[#6b6b6b] leading-relaxed">{cat.description}</p>}
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { slides, showcaseCats, tradeCta, dynamicSections, allCategories } = await getData();

  return (
    <>
      {/* 1 ── HERO */}
      {slides.length > 0 ? (
        <HeroSlider slides={slides} />
      ) : (
        <div className="relative w-full h-screen min-h-[600px] -mt-16 bg-[#1a1a1a] flex items-center justify-center">
          <div className="text-center text-white px-8">
            <h2 className="text-5xl md:text-7xl font-semibold mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Spazio</h2>
            <p className="text-white/60 text-[10px] tracking-[0.35em] uppercase mt-4">Curating exceptional furniture &amp; lighting</p>
          </div>
        </div>
      )}

      {/* 2 ── CATEGORY SHOWCASE */}
      {showcaseCats.length > 0 && (
        <section className="grid grid-cols-3 gap-3 px-6 py-12">
          {showcaseCats.map((cat) => (
            <Link key={cat.id} href={`/collections/${cat.slug}`} className="group relative block overflow-hidden aspect-[3/4] bg-[#1a1a1a]">
              {cat.imageUrl ? (
                <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute bottom-6 left-6 text-white text-[11px] tracking-[0.3em] uppercase font-light drop-shadow">{cat.name}</span>
            </Link>
          ))}
        </section>
      )}

      {/* 3 ── DYNAMIC SECTIONS */}
      {dynamicSections.map((sec, i) => {
        if (sec.sectionType === "category_trio") {
          const cats = resolveCats(sec.bodyText, allCategories);
          if (cats.length === 0) return null;
          return <TrioSection key={sec.id} cats={cats} />;
        }
        // content_block (and any legacy numbered variants)
        return <ContentBlock key={sec.id} s={sec} imageLeft={i % 2 !== 0} />;
      })}

      {/* 4 ── CTA BLOCK */}
      {tradeCta && (
        <section className="bg-[#1a1a1a] py-24 px-6 md:px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            {tradeCta.subtitle && <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5964e] mb-4">{tradeCta.subtitle}</p>}
            {tradeCta.title && <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{tradeCta.title}</h2>}
            {tradeCta.bodyText && <div className="text-white/60 text-sm leading-relaxed mb-10 max-w-lg mx-auto" dangerouslySetInnerHTML={{ __html: tradeCta.bodyText }} />}
            {tradeCta.linkUrl && <Link href={tradeCta.linkUrl} className="inline-block border border-white text-white text-[10px] uppercase tracking-[0.25em] px-10 py-4 hover:bg-white hover:text-[#1a1a1a] transition-colors">{tradeCta.subtitle || "Learn More"}</Link>}
          </div>
        </section>
      )}

      {/* 5 ── NEWSLETTER */}
      <section className="bg-[#f5f0e8] py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#b5964e] mb-4">Stay Connected</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Experience Luxury First</h2>
          <p className="text-sm text-[#6b6b6b] leading-relaxed mb-10 max-w-md mx-auto">Subscribe for early access to new collections, exclusive events, and curated stories from the world of luxury design.</p>
          <div className="flex justify-center"><NewsletterForm /></div>
        </div>
      </section>
    </>
  );
}
