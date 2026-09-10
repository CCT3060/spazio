export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return { title: "Not Found" };
  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? undefined,
  };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Breadcrumb */}
      <p className="text-xs uppercase tracking-[0.3em] text-[#b5964e] mb-6">Information</p>

      <h1
        className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-10"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {page.title}
      </h1>

      {page.content ? (
        <div
          className="prose-luxury"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-[#6b6b6b]">No content yet.</p>
      )}
    </div>
  );
}
