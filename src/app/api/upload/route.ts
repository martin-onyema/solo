import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type))
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });

    if (file.size > 10 * 1024 * 1024)
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400 });

    const ext = path.extname(file.name) || ".jpg";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${uniqueName}`, file, { access: "public" });
      return NextResponse.json({ url: blob.url, success: true });
    }

    // Local dev fallback (filesystem)
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, uniqueName), buffer);
    return NextResponse.json({ url: `/images/uploads/${uniqueName}`, success: true });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Set BLOB_READ_WRITE_TOKEN in Vercel → Storage → Blob.", success: false },
      { status: 500 }
    );
  }
}
