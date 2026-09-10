import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import SubscriberTable from "./SubscriberTable";

export const metadata: Metadata = { title: "Newsletter" };

export default async function NewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Newsletter Subscribers
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
      </div>
      <SubscriberTable initialSubscribers={subscribers} />
    </div>
  );
}
