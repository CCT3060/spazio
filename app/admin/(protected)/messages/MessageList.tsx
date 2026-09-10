"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  productName: string | null;
  productSku: string | null;
  message: string;
  isRead: boolean;
  submittedAt: Date;
}

export default function MessageList({ initialMessages }: { initialMessages: Message[] }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const visible = filter === "unread" ? messages.filter((m) => !m.isRead) : messages;

  async function toggleRead(m: Message) {
    const res = await fetch(`/api/messages/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: !m.isRead }),
    });
    if (res.ok) {
      setMessages((prev) => prev.map((msg) => msg.id === m.id ? { ...msg, isRead: !msg.isRead } : msg));
      router.refresh();
    }
  }

  async function deleteMessage(id: number, name: string) {
    if (!confirm(`Delete message from "${name}"?`)) return;
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (expanded === id) setExpanded(null);
      router.refresh();
    } else {
      toast.error("Failed to delete message");
    }
  }

  function handleExpand(id: number, isRead: boolean) {
    setExpanded(expanded === id ? null : id);
    if (!isRead) {
      const m = messages.find((msg) => msg.id === id);
      if (m) toggleRead(m);
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e0d9cc]">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
              filter === f
                ? "border-[#b5964e] text-[#1a1a1a] font-medium"
                : "border-transparent text-[#6b6b6b] hover:text-[#1a1a1a]"
            }`}
          >
            {f === "all" ? `All (${messages.length})` : `Unread (${messages.filter((m) => !m.isRead).length})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-[#6b6b6b] py-12 text-center">
          {filter === "unread" ? "No unread messages." : "No messages yet."}
        </p>
      ) : (
        <div className="space-y-2">
          {visible.map((m) => (
            <div
              key={m.id}
              className={`border transition-colors ${
                m.isRead ? "border-[#e0d9cc] bg-white" : "border-[#b5964e]/30 bg-[#fdf9f3]"
              }`}
            >
              {/* Row header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer select-none"
                onClick={() => handleExpand(m.id, m.isRead)}
              >
                <div className="shrink-0 text-[#b5964e]">
                  {m.isRead ? <MailOpen size={16} className="text-[#b0a898]" /> : <Mail size={16} />}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                  <div className="min-w-0">
                    <p className={`text-sm truncate ${m.isRead ? "text-[#1a1a1a]" : "font-semibold text-[#1a1a1a]"}`}>{m.name}</p>
                    <p className="text-xs text-[#6b6b6b] truncate">{m.email}</p>
                  </div>
                  <div className="min-w-0">
                    {m.productName ? (
                      <p className="text-xs text-[#6b6b6b] truncate">Re: {m.productName}</p>
                    ) : (
                      <p className="text-xs text-[#6b6b6b] truncate italic">General enquiry</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#6b6b6b]">
                      {new Date(m.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleRead(m); }}
                    className="p-1.5 text-[#6b6b6b] hover:text-[#b5964e] transition-colors"
                    title={m.isRead ? "Mark unread" : "Mark read"}
                  >
                    {m.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteMessage(m.id, m.name); }}
                    className="p-1.5 text-[#6b6b6b] hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expanded === m.id ? <ChevronUp size={14} className="text-[#6b6b6b]" /> : <ChevronDown size={14} className="text-[#6b6b6b]" />}
                </div>
              </div>

              {/* Expanded body */}
              {expanded === m.id && (
                <div className="px-5 pb-5 border-t border-[#e0d9cc] pt-4 space-y-4">
                  <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#b5964e] mb-1">From</p>
                      <p className="text-[#1a1a1a]">{m.name}</p>
                      <a href={`mailto:${m.email}`} className="text-[#6b6b6b] hover:text-[#b5964e] transition-colors">{m.email}</a>
                      {m.phone && <p className="text-[#6b6b6b] mt-0.5">{m.phone}</p>}
                    </div>
                    {m.productName && (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-[#b5964e] mb-1">Product</p>
                        <p className="text-[#1a1a1a]">{m.productName}</p>
                        {m.productSku && <p className="text-[#6b6b6b] text-xs font-mono">SKU: {m.productSku}</p>}
                      </div>
                    )}
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#b5964e] mb-1">Received</p>
                      <p className="text-[#1a1a1a]">
                        {new Date(m.submittedAt).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}
                      </p>
                      <p className="text-[#6b6b6b] text-xs">
                        {new Date(m.submittedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#b5964e] mb-2">Message</p>
                    <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap bg-[#f5f0e8] px-4 py-3">{m.message}</p>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={`mailto:${m.email}?subject=Re: ${m.productName ? `Enquiry about ${m.productName}` : "Your enquiry"}`}
                      className="bg-[#1a1a1a] text-white px-5 py-2 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
                    >
                      Reply by Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
