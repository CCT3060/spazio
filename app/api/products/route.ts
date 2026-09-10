import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId");
  const isActive = searchParams.get("isActive");

  const where = {
    ...(search && {
      OR: [
        { name: { contains: search } },
        { sku: { contains: search } },
        { itemNumber: { contains: search } },
      ],
    }),
    ...(categoryId && { categoryId: Number(categoryId) }),
    ...(isActive !== null && { isActive: isActive === "true" }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  if (!data.slug) data.slug = slugify(data.name);

  const product = await prisma.product.create({
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
  });

  return NextResponse.json(product, { status: 201 });
}
