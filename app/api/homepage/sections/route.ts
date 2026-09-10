import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sections = await prisma.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const section = await prisma.homepageSection.create({
    data: {
      sectionType: body.sectionType ?? "custom",
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
  return NextResponse.json(section, { status: 201 });
}
