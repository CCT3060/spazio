import { prisma } from "@/lib/prisma";
import NavClient from "./NavClient";

async function getNavCategories() {
  try {
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
  } catch {
    return [];
  }
}

export default async function Header() {
  let categories: Awaited<ReturnType<typeof getNavCategories>> = [];
  let announcement = "";
  try {
    const [cats, announcementSetting] = await Promise.all([
      getNavCategories(),
      prisma.siteSetting.findUnique({ where: { key: "announcementBar" } }),
    ]);
    categories = cats;
    announcement = announcementSetting?.value ?? "";
  } catch {
    // DB unavailable — render with empty nav
  }

  return (
    <NavClient
      categories={categories}
      announcement={announcement}
    />
  );
}
