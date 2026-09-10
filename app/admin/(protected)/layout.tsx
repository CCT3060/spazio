import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: { default: "Admin", template: "%s | Admin — Spazio" },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f0e8]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "13px", fontFamily: "Jost, sans-serif" },
          success: { iconTheme: { primary: "#b5964e", secondary: "#fff" } },
        }}
      />
    </div>
  );
}
