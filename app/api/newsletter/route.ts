import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    await prisma.newsletterSubscriber.create({
      data: { email: parsed.data.email },
    });
    return NextResponse.json({ success: true });
  } catch {
    // Unique constraint = already subscribed
    return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
  }
}
