"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PageDeleteButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/pages/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Page deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete page");
    }
  }

  return (
    <button onClick={handleDelete} className="text-xs text-[#6b6b6b] hover:text-red-500 uppercase tracking-widest transition-colors">
      Delete
    </button>
  );
}
