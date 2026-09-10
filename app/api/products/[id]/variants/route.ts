import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const variant = await prisma.productVariant.create({
    data: {
      productId: Number(id),
      variantName: body.variantName,
      sku: body.sku,
      price: body.price ?? null,
      stockStatus: body.stockStatus ?? null,
      imageUrl: body.imageUrl ?? null,
    },
  });
  return NextResponse.json(variant, { status: 201 });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json() as { variantId: number; variantName: string; sku: string; price?: number; stockStatus?: string; imageUrl?: string };

  const variant = await prisma.productVariant.update({
    where: { id: body.variantId, productId: Number(id) },
    data: {
      variantName: body.variantName,
      sku: body.sku,
      price: body.price ?? null,
      stockStatus: (body.stockStatus as "in_stock" | "out_of_stock" | "made_to_order") ?? null,
      imageUrl: body.imageUrl ?? null,
    },
  });
  return NextResponse.json(variant);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { variantId } = await req.json() as { variantId: number };

  await prisma.productVariant.delete({ where: { id: variantId, productId: Number(id) } });
  return NextResponse.json({ success: true });
}
