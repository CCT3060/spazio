import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const section = await prisma.homepageSection.update({
    where: { id: Number(id) },
    data: {
      sectionType: body.sectionType,
      layout:     body.layout     ?? null,
      title:      body.title      ?? null,
      subtitle:   body.subtitle   ?? null,
      excerpt:    body.excerpt    ?? null,
      bodyText:   body.bodyText   ?? null,
      imageUrl:   body.imageUrl   ?? null,
      videoUrl:   body.videoUrl   ?? null,
      linkUrl:    body.linkUrl    ?? null,
      buttonText: body.buttonText ?? null,
      sortOrder:  body.sortOrder  ?? 0,
      isActive:   body.isActive   ?? true,
    } as any,
  });
  return NextResponse.json(section);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.homepageSection.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
