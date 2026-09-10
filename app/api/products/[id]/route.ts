import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
      category: true,
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  if (!data.slug) data.slug = slugify(data.name);

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      sku: data.sku,
      name: data.name,
      slug: data.slug,
      categoryId: data.categoryId ?? null,
      description: data.description ?? null,
      shortDescription: data.shortDescription ?? null,
      price: data.price,
      salePrice: data.salePrice ?? null,
      itemNumber: data.itemNumber ?? null,
      material: data.material ?? null,
      finish: data.finish ?? null,
      dimensions: data.dimensions ?? null,
      stockStatus: data.stockStatus,
      isFeatured: data.isFeatured,
      isActive: data.isActive,
      metaTitle: data.metaTitle ?? null,
      metaDescription: data.metaDescription ?? null,
    },
    include: { images: { orderBy: { sortOrder: "asc" } }, variants: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
