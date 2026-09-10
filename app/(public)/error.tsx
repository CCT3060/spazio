"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-[#b5964e] mb-4">Error</p>
      <h1
        className="text-3xl font-semibold text-[#1a1a1a] mb-4"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Something went wrong
      </h1>
      <p className="text-[#6b6b6b] text-sm mb-10 max-w-md">
        We encountered an unexpected error. Please try again or contact us if the problem persists.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-[#1a1a1a] text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-[#e0d9cc] text-[#1a1a1a] px-8 py-3 text-xs uppercase tracking-widest hover:border-[#b5964e] hover:text-[#b5964e] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
