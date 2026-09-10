import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${uuidv4()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error("Supabase upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from("uploads").getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
