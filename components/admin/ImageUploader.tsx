"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, GripVertical, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id?: number;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface Props {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  single?: boolean; // single image mode (for categories)
}

export default function ImageUploader({ images, onChange, single }: Props) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (single) accepted = accepted.slice(0, 1);
      setUploading(true);
      const uploaded: UploadedImage[] = [];

      for (const file of accepted) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (json.url) {
          uploaded.push({
            imageUrl: json.url,
            isPrimary: images.length === 0 && uploaded.length === 0,
            sortOrder: images.length + uploaded.length,
          });
        }
      }

      onChange(single ? uploaded : [...images, ...uploaded]);
      setUploading(false);
    },
    [images, onChange, single]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: !single,
  });

  function remove(index: number) {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({
      ...img,
      sortOrder: i,
      isPrimary: i === 0 ? true : img.isPrimary && i === 0,
    }));
    // ensure exactly one primary
    if (next.length > 0 && !next.some((i) => i.isPrimary)) next[0].isPrimary = true;
    onChange(next);
  }

  function setPrimary(index: number) {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((img, i) => ({ ...img, sortOrder: i })));
  }

  function moveDown(index: number) {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((img, i) => ({ ...img, sortOrder: i })));
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {(!single || images.length === 0) && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded p-6 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-[#b5964e] bg-[#f5f0e8]"
              : "border-[#e0d9cc] hover:border-[#b5964e]"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <p className="text-sm text-[#6b6b6b]">Uploading…</p>
          ) : (
            <p className="text-sm text-[#6b6b6b]">
              {isDragActive ? "Drop to upload" : "Drag & drop images here, or click to select"}
            </p>
          )}
          <p className="text-xs text-[#6b6b6b] mt-1">JPG, PNG, WebP — max 10 MB each</p>
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className={cn("grid gap-3", single ? "grid-cols-1 max-w-xs" : "grid-cols-3 sm:grid-cols-4")}>
          {images.map((img, i) => (
            <div
              key={img.imageUrl + i}
              className={cn(
                "relative border rounded overflow-hidden group",
                img.isPrimary ? "border-[#b5964e]" : "border-[#e0d9cc]"
              )}
            >
              <div className="relative aspect-square bg-[#f5f0e8]">
                <Image
                  src={img.imageUrl}
                  alt={img.altText ?? ""}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
              </div>

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {!single && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveUp(i)}
                      title="Move left"
                      className="p-1 bg-white/90 rounded text-[#1a1a1a] hover:bg-white"
                    >
                      <GripVertical size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimary(i)}
                      title="Set as primary"
                      className={cn(
                        "p-1 rounded",
                        img.isPrimary
                          ? "bg-[#b5964e] text-white"
                          : "bg-white/90 text-[#1a1a1a] hover:bg-[#b5964e] hover:text-white"
                      )}
                    >
                      <Star size={14} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove"
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>

              {img.isPrimary && (
                <span className="absolute bottom-0 left-0 right-0 text-center text-[10px] bg-[#b5964e] text-white py-0.5">
                  PRIMARY
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
