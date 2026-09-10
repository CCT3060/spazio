import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import SiteSettingsForm from "./SiteSettingsForm";

export const metadata: Metadata = { title: "Site Settings" };

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Site Settings
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">
          Global configuration used across the public site.
        </p>
      </div>
      <SiteSettingsForm initialSettings={settings} />
    </div>
  );
}
