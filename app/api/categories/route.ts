import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      include: { parent: { select: { name: true } }, _count: { select: { products: true } } },
    });
    return NextResponse.json(categories);
  } catch (e) {
    console.error("[GET /api/categories]", e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  if (!data.slug) data.slug = slugify(data.name);

  const category = await prisma.category.create({
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

  return NextResponse.json(category, { status: 201 });
}
