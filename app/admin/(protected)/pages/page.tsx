import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageDeleteButton from "./PageDeleteButton";

export const metadata: Metadata = { title: "Static Pages" };

export default async function AdminPagesPage() {
  const pages = await prisma.page.findMany({ orderBy: { title: "asc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Static Pages
          </h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/pages/new" className="flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors">
          <Plus size={14} /> New Page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="text-center py-20 text-[#6b6b6b]">
          <p className="text-sm">No pages yet.</p>
          <Link href="/admin/pages/new" className="inline-block mt-4 text-[#b5964e] text-xs uppercase tracking-widest hover:underline">Create your first page →</Link>
        </div>
      ) : (
        <div className="bg-white border border-[#e0d9cc] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f0e8] border-b border-[#e0d9cc]">
              <tr>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Title</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Slug</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Updated</th>
                <th className="px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0d9cc]">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-[#faf8f5]">
                  <td className="px-5 py-4 font-medium text-[#1a1a1a]">{p.title}</td>
                  <td className="px-5 py-4 text-[#6b6b6b] font-mono text-xs">/{p.slug}</td>
                  <td className="px-5 py-4 text-[#6b6b6b] text-xs">{new Date(p.updatedAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/pages/${p.slug}`} target="_blank" className="text-xs text-[#6b6b6b] hover:text-[#b5964e] uppercase tracking-widest transition-colors">View</Link>
                      <Link href={`/admin/pages/${p.id}/edit`} className="text-xs text-[#6b6b6b] hover:text-[#b5964e] uppercase tracking-widest transition-colors">Edit</Link>
                      <PageDeleteButton id={p.id} title={p.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
