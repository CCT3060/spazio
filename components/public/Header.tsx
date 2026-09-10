import { prisma } from "@/lib/prisma";
import NavClient from "./NavClient";

async function getNavCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      },
    },
  });
  return categories;
}

export default async function Header() {
  const [categories, announcementSetting] = await Promise.all([
    getNavCategories(),
    prisma.siteSetting.findUnique({ where: { key: "announcementBar" } }),
  ]);

  return (
    <NavClient
      categories={categories}
      announcement={announcementSetting?.value ?? ""}
    />
  );
}
