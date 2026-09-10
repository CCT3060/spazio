"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  Home,
  FileText,
  MessageSquare,
  Mail,
  Settings,
  Users,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Categories", href: "/admin/categories", icon: FolderOpen },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Homepage", href: "/admin/homepage", icon: Home },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
  { label: "Admin Users", href: "/admin/users", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-full bg-[#1a1a1a] flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <span
          className="text-white text-lg font-semibold tracking-wide"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Spazio
        </span>
        <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">
          Admin
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-sm transition-colors",
                active
                  ? "bg-[#b5964e] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-6 py-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 text-white/50 hover:text-white text-sm transition-colors w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
