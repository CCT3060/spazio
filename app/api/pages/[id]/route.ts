import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id: Number(id) } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const conflict = await prisma.page.findFirst({
    where: { slug: parsed.data.slug, id: { not: Number(id) } },
  });
  if (conflict) return NextResponse.json({ error: "Slug already exists" }, { status: 409 });

  const page = await prisma.page.update({ where: { id: Number(id) }, data: parsed.data });
  return NextResponse.json(page);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.page.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
