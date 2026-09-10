import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import PageForm from "@/components/admin/PageForm";

export const metadata: Metadata = { title: "Edit Page" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id: Number(id) } });
  if (!page) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Edit Page
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">{page.title}</p>
      </div>
      <PageForm
        page={{
          id: page.id,
          slug: page.slug,
          title: page.title,
          content: page.content,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
        }}
      />
    </div>
  );
}
