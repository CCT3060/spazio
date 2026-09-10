"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProductDeleteButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
    }
  }

  return (
    <button onClick={handleDelete} className="p-1.5 text-[#6b6b6b] hover:text-red-500 transition-colors" title="Delete">
      <Trash2 size={14} />
    </button>
  );
}
