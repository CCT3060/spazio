import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const slides = await prisma.homepageSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(slides);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const slide = await prisma.homepageSlide.create({
    data: {
      title: body.title ?? null,
      subtitle: body.subtitle ?? null,
      imageUrl: body.imageUrl,
      linkUrl: body.linkUrl ?? null,
      buttonText: body.buttonText ?? null,
      sortOrder: body.sortOrder ?? 0,
      isActive: body.isActive ?? true,
    },
  });
  return NextResponse.json(slide, { status: 201 });
}
