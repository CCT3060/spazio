"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Download, Trash2 } from "lucide-react";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: Date;
}

export default function SubscriberTable({ initialSubscribers }: { initialSubscribers: Subscriber[] }) {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [search, setSearch] = useState("");

  const visible = search
    ? subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()))
    : subscribers;

  async function deleteSubscriber(id: number, email: string) {
    if (!confirm(`Remove "${email}" from the list?`)) return;
    const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Subscriber removed");
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    } else {
      toast.error("Failed to remove subscriber");
    }
  }

  function exportCsv() {
    const rows = [
      ["Email", "Subscribed At"],
      ...subscribers.map((s) => [s.email, new Date(s.subscribedAt).toISOString()]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email…"
          className="border border-[#e0d9cc] px-3 py-2 text-sm w-72 focus:outline-none focus:border-[#b5964e] transition-colors"
        />
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 border border-[#e0d9cc] px-4 py-2 text-xs uppercase tracking-widest text-[#1a1a1a] hover:border-[#b5964e] hover:text-[#b5964e] transition-colors disabled:opacity-40"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-[#6b6b6b] py-12 text-center">
          {search ? "No subscribers match your search." : "No subscribers yet."}
        </p>
      ) : (
        <div className="bg-white border border-[#e0d9cc] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#f5f0e8] border-b border-[#e0d9cc]">
              <tr>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">#</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Email</th>
                <th className="text-left px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium">Subscribed</th>
                <th className="px-5 py-3 text-xs uppercase tracking-widest text-[#6b6b6b] font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0d9cc]">
              {visible.map((s, i) => (
                <tr key={s.id} className="hover:bg-[#faf8f5]">
                  <td className="px-5 py-3.5 text-[#b0a898] text-xs">{i + 1}</td>
                  <td className="px-5 py-3.5 text-[#1a1a1a]">{s.email}</td>
                  <td className="px-5 py-3.5 text-[#6b6b6b] text-xs">
                    {new Date(s.subscribedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => deleteSubscriber(s.id, s.email)}
                      className="p-1.5 text-[#6b6b6b] hover:text-red-500 transition-colors"
                      title="Remove subscriber"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {search && (
            <div className="px-5 py-3 border-t border-[#e0d9cc] bg-[#f5f0e8] text-xs text-[#6b6b6b]">
              Showing {visible.length} of {subscribers.length} subscribers
            </div>
          )}
        </div>
      )}
    </div>
  );
}
