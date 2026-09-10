import SessionProvider from "@/components/providers/SessionProvider";

// Thin wrapper — session provider for all admin routes.
// Auth enforcement is in app/admin/(protected)/layout.tsx and middleware.ts
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
