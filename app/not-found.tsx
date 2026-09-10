import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-[#f5f0e8]">
      <p className="text-xs uppercase tracking-[0.3em] text-[#b5964e] mb-4">404</p>
      <h1
        className="text-4xl md:text-5xl font-semibold text-[#1a1a1a] mb-4"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        Page Not Found
      </h1>
      <p className="text-[#6b6b6b] text-sm mb-10">
        The page you are looking for may have been moved or no longer exists.
      </p>
      <Link
        href="/"
        className="bg-[#1a1a1a] text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#b5964e] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
