export const dynamic = "force-dynamic";

import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import { Toaster } from "react-hot-toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Spacer pushes non-hero page content below the fixed header.
          Hero sections use -mt-16 to pull back up and cover full viewport. */}
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontSize: "13px", fontFamily: "Jost, sans-serif" },
        }}
      />
    </div>
  );
}
