import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import MessageList from "./MessageList";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { submittedAt: "desc" },
  });

  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Messages
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">
          {messages.length} total · {unread} unread
        </p>
      </div>
      <MessageList initialMessages={messages} />
    </div>
  );
}
