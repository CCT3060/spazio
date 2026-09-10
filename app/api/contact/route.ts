import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;
  await prisma.contactSubmission.create({
    data: {
      name: d.name,
      email: d.email,
      phone: d.phone ?? null,
      productName: d.productName ?? null,
      productSku: d.productSku ?? null,
      message: d.message,
    },
  });

  return NextResponse.json({ success: true });
}
