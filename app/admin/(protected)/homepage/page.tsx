import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import HomepageBuilder from "./HomepageBuilder";

export const metadata: Metadata = { title: "Homepage Builder" };

export default async function HomepagePage() {
  const [slides, sections, categories] = await Promise.all([
    prisma.homepageSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: { id: true, name: true, slug: true, parentId: true } }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Homepage Builder
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Manage hero slides and homepage content sections. Changes are live immediately.
        </p>
      </div>
      <HomepageBuilder initialSlides={slides} initialSections={sections} allCategories={categories} />
    </div>
  );
}
