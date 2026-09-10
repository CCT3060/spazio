"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef, useState } from "react";
import {
  Bold, Italic, List, ListOrdered, Heading2, Heading3,
  Link as LinkIcon, Undo, Redo, ImageIcon, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Custom Image extension that persists inline style (for user-set widths)
const ResizableImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => el.style.width || null,
        renderHTML: (attrs) =>
          attrs.width ? { style: `width:${attrs.width};height:auto;` } : {},
      },
    };
  },
});

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const SIZE_OPTIONS = [
  { label: "S", value: "25%" },
  { label: "M", value: "50%" },
  { label: "L", value: "75%" },
  { label: "Full", value: "100%" },
];

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? "Write something…" }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-luxury min-h-[180px] p-3 focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  async function handleImageFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        editor?.chain().focus().setImage({ src: data.url }).run();
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!editor) return null;

  const imageActive = editor.isActive("image");

  const ToolBtn = ({
    active,
    onClick,
    title,
    children,
    disabled,
  }: {
    active?: boolean;
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded transition-colors disabled:opacity-40",
        active ? "bg-[#b5964e] text-white" : "text-[#6b6b6b] hover:bg-[#f5f0e8]"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-[#e0d9cc] rounded overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#e0d9cc] bg-[#fafaf9]">
        <ToolBtn active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <Bold size={14} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <Italic size={14} />
        </ToolBtn>
        <div className="w-px h-4 bg-[#e0d9cc] mx-1" />
        <ToolBtn active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 size={14} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 size={14} />
        </ToolBtn>
        <div className="w-px h-4 bg-[#e0d9cc] mx-1" />
        <ToolBtn active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          <List size={14} />
        </ToolBtn>
        <ToolBtn active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered list">
          <ListOrdered size={14} />
        </ToolBtn>
        <div className="w-px h-4 bg-[#e0d9cc] mx-1" />
        <ToolBtn
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          title="Link"
        >
          <LinkIcon size={14} />
        </ToolBtn>

        {/* Image upload */}
        <ToolBtn
          onClick={() => fileInputRef.current?.click()}
          title="Insert image"
          disabled={uploading}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImageIcon size={14} />}
        </ToolBtn>

        {/* Image size controls — only shown when image is selected */}
        {imageActive && (
          <>
            <div className="w-px h-4 bg-[#e0d9cc] mx-1" />
            <span className="text-[9px] uppercase tracking-widest text-[#aaa] px-1">Size:</span>
            {SIZE_OPTIONS.map(({ label, value: w }) => (
              <button
                key={w}
                type="button"
                title={`Set image width to ${w}`}
                onClick={() => editor.chain().focus().updateAttributes("image", { width: w }).run()}
                className="px-2 py-0.5 text-[10px] text-[#6b6b6b] hover:bg-[#f5f0e8] rounded border border-[#e0d9cc] transition-colors"
              >
                {label}
              </button>
            ))}
          </>
        )}

        <div className="w-px h-4 bg-[#e0d9cc] mx-1 ml-auto" />
        <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo size={14} />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo size={14} />
        </ToolBtn>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />

      {/* Editor content */}
      <EditorContent editor={editor} />
    </div>
  );
}
