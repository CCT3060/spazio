import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[#b5964e] mb-4">404</p>
      <h1
        className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-4"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Page Not Found
      </h1>
      <p className="text-[#6b6b6b] text-sm mb-10 max-w-md">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="bg-[#1a1a1a] text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/contact"
          className="border border-[#e0d9cc] text-[#1a1a1a] px-8 py-3 text-xs uppercase tracking-widest hover:border-[#b5964e] hover:text-[#b5964e] transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
