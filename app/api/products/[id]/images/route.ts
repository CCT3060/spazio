import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

// POST: add images, PATCH: reorder + set primary
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as { imageUrl: string; altText?: string; isPrimary?: boolean };

  const image = await prisma.productImage.create({
    data: {
      productId: Number(id),
      imageUrl: body.imageUrl,
      altText: body.altText ?? null,
      isPrimary: body.isPrimary ?? false,
      sortOrder: 0,
    },
  });
  return NextResponse.json(image, { status: 201 });
}

// PUT: bulk-update image order + primary flag
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as { images: { id: number; sortOrder: number; isPrimary: boolean }[] };

  await Promise.all(
    body.images.map((img) =>
      prisma.productImage.updateMany({
        where: { id: img.id, productId: Number(id) },
        data: { sortOrder: img.sortOrder, isPrimary: img.isPrimary },
      })
    )
  );

  const images = await prisma.productImage.findMany({
    where: { productId: Number(id) },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(images);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { imageId } = await req.json() as { imageId: number };

  await prisma.productImage.delete({ where: { id: imageId, productId: Number(id) } });
  return NextResponse.json({ success: true });
}
