import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import AdminUsersClient from "./AdminUsersClient";

export const metadata: Metadata = { title: "Admin Users" };

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Admin Users
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">{users.length} user{users.length !== 1 ? "s" : ""}</p>
      </div>
      <AdminUsersClient initialUsers={users} />
    </div>
  );
}
