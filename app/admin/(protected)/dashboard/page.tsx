import { prisma } from "@/lib/prisma";
import StatCard from "@/components/admin/StatCard";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    totalProducts,
    totalCategories,
    unreadMessages,
    subscribers,
    outOfStock,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.newsletterSubscriber.count(),
    prisma.product.count({
      where: { stockStatus: { in: ["out_of_stock"] }, isActive: true },
    }),
  ]);

  return { totalProducts, totalCategories, unreadMessages, subscribers, outOfStock };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Dashboard
        </h1>
        <p className="text-sm text-[#6b6b6b] mt-1">Welcome back. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        <StatCard label="Active Products" value={stats.totalProducts} />
        <StatCard label="Categories" value={stats.totalCategories} />
        <StatCard
          label="Unread Messages"
          value={stats.unreadMessages}
          accent={stats.unreadMessages > 0}
        />
        <StatCard label="Subscribers" value={stats.subscribers} />
        <StatCard
          label="Out of Stock"
          value={stats.outOfStock}
          accent={stats.outOfStock > 0}
          sub="products need attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <QuickLinks />
      </div>
    </div>
  );
}

async function RecentMessages() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { submittedAt: "desc" },
    take: 5,
  });

  return (
    <div className="bg-white border border-[#e0d9cc] p-6">
      <h2
        className="text-base font-semibold mb-4 text-[#1a1a1a]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Recent Messages
      </h2>
      {messages.length === 0 ? (
        <p className="text-sm text-[#6b6b6b]">No messages yet.</p>
      ) : (
        <div className="divide-y divide-[#e0d9cc]">
          {messages.map((m) => (
            <div key={m.id} className="py-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-sm font-medium ${!m.isRead ? "text-[#1a1a1a]" : "text-[#6b6b6b]"}`}>
                  {m.name}
                </p>
                <p className="text-xs text-[#6b6b6b] truncate">{m.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!m.isRead && (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#b5964e]" />
                )}
                <span className="text-xs text-[#6b6b6b]">
                  {new Date(m.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <a
        href="/admin/messages"
        className="inline-block mt-4 text-xs uppercase tracking-widest text-[#b5964e] hover:underline"
      >
        View All →
      </a>
    </div>
  );
}

function QuickLinks() {
  const links = [
    { label: "Add New Product", href: "/admin/products/new" },
    { label: "Add New Category", href: "/admin/categories/new" },
    { label: "Edit Homepage", href: "/admin/homepage" },
    { label: "Manage Pages", href: "/admin/pages" },
    { label: "Site Settings", href: "/admin/settings" },
  ];

  return (
    <div className="bg-white border border-[#e0d9cc] p-6">
      <h2
        className="text-base font-semibold mb-4 text-[#1a1a1a]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Quick Actions
      </h2>
      <div className="flex flex-col gap-2">
        {links.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="flex items-center justify-between px-4 py-3 border border-[#e0d9cc] text-sm text-[#1a1a1a] hover:border-[#b5964e] hover:bg-[#f5f0e8] transition-colors group"
          >
            {label}
            <span className="text-[#b5964e] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
