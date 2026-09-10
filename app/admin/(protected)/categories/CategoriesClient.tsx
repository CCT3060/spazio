"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, ChevronDown, ChevronRight } from "lucide-react";
import DeleteButton from "./DeleteButton";

interface Cat {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  parentId: number | null;
  parent: { name: string } | null;
  _count: { products: number };
  children: Cat[];
}

export default function CategoriesClient({ parents }: { parents: Cat[] }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  function toggle(id: number) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="bg-white border border-[#e0d9cc] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[#f5f0e8] border-b border-[#e0d9cc]">
          <tr>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Name</th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Products</th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Order</th>
            <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Status</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#e0d9cc]">
          {parents.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-[#6b6b6b]">
                No categories yet.{" "}
                <Link href="/admin/categories/new" className="text-[#b5964e] underline">
                  Add one
                </Link>
              </td>
            </tr>
          )}

          {parents.map((cat) => {
            const hasChildren = cat.children.length > 0;
            const isOpen = !!open[cat.id];

            return [
              /* ── Parent row ── */
              <tr key={cat.id} className="hover:bg-[#fafaf9]">
                <td className="px-4 py-3 font-medium text-[#1a1a1a]">
                  <div className="flex items-center gap-2">
                    {/* Expand toggle */}
                    {hasChildren ? (
                      <button
                        onClick={() => toggle(cat.id)}
                        className="shrink-0 p-0.5 text-[#aaa] hover:text-[#b5964e] transition-colors"
                        title={isOpen ? "Collapse" : "Expand subcategories"}
                      >
                        {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      </button>
                    ) : (
                      <span className="w-[22px] shrink-0" />
                    )}
                    <span>{cat.name}</span>
                    {hasChildren && (
                      <span className="ml-1 text-[10px] text-[#aaa] tracking-wide">
                        ({cat.children.length})
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-[#6b6b6b]">{cat._count.products}</td>
                <td className="px-4 py-3 text-[#6b6b6b]">{cat.sortOrder}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                      cat.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e] transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </Link>
                    <DeleteButton id={cat.id} name={cat.name} />
                  </div>
                </td>
              </tr>,

              /* ── Subcategory rows (collapsible) ── */
              ...(isOpen
                ? cat.children.map((child) => (
                    <tr key={child.id} className="bg-[#fdf9f5] hover:bg-[#faf5ee]">
                      <td className="px-4 py-2.5 text-[#1a1a1a]">
                        <div className="flex items-center gap-2 pl-8">
                          <span className="text-[#d0c8be] mr-1">↳</span>
                          <span className="text-sm">{child.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[#6b6b6b] text-sm">{child._count.products}</td>
                      <td className="px-4 py-2.5 text-[#6b6b6b] text-sm">{child.sortOrder}</td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            child.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {child.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            href={`/admin/categories/${child.id}/edit`}
                            className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e] transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </Link>
                          <DeleteButton id={child.id} name={child.name} />
                        </div>
                      </td>
                    </tr>
                  ))
                : []),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
}
