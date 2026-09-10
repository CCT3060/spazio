import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validations";

export async function GET() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });
  return NextResponse.json(pages);
}

// Partial update by slug — used to sync auto-created pages with their source content block
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, content } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.page.update({
    where: { slug },
    data: { content: content ?? page.content },
  });
  return NextResponse.json(updated);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const existing = await prisma.page.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const page = await prisma.page.create({ data: parsed.data });
  return NextResponse.json(page, { status: 201 });
}
