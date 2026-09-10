import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { parent: true, children: true },
  });
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  if (!data.slug) data.slug = slugify(data.name);

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      slug: data.slug,
      parentId: data.parentId ?? null,
      description: data.description ?? null,
      imageUrl: (body.imageUrl as string) ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
    },
  });

  return NextResponse.json(category);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.category.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
