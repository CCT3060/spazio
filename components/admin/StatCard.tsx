import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#e0d9cc] p-6",
        accent && "border-l-4 border-l-[#b5964e]"
      )}
    >
      <p className="text-xs uppercase tracking-widest text-[#6b6b6b] mb-2">{label}</p>
      <p
        className="text-4xl font-semibold text-[#1a1a1a]"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs text-[#6b6b6b] mt-1">{sub}</p>}
    </div>
  );
}
