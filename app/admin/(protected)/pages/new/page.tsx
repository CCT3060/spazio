import { Metadata } from "next";
import PageForm from "@/components/admin/PageForm";

export const metadata: Metadata = { title: "New Page" };

export default function NewPagePage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          New Page
        </h1>
      </div>
      <PageForm />
    </div>
  );
}
