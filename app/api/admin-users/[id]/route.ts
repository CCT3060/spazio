import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

type Params = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "editor"]).optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  if (parsed.data.email) {
    const conflict = await prisma.adminUser.findFirst({
      where: { email: parsed.data.email, id: { not: Number(id) } },
    });
    if (conflict) return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.email) data.email = parsed.data.email;
  if (parsed.data.role) data.role = parsed.data.role;
  if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.adminUser.update({
    where: { id: Number(id) },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const count = await prisma.adminUser.count();
  if (count <= 1) return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 });

  await prisma.adminUser.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
