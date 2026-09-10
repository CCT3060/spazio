import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export async function uploadFile(file: File): Promise<string> {
  // Abstracted upload function — swap internals for S3/Cloudinary without changing callers
  const { v4: uuidv4 } = await import("uuid");
  const ext = file.name.split(".").pop();
  const filename = `${uuidv4()}.${ext}`;
  // Local dev: files are written in the API route handler; this returns the public URL
  return `/uploads/${filename}`;
}
