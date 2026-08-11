import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteData, getUploadsDir, saveSiteData } from "@/lib/storage";
import type { DocumentItem } from "@/lib/types";

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!(file instanceof File) || !title) {
    return NextResponse.json({ error: "Файл и название обязательны" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json(
      { error: "Поддерживаются только JPG, PNG, WEBP и PDF" },
      { status: 400 },
    );
  }

  const uploadsDir = getUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".jpg");
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const doc: DocumentItem = {
    id: `doc-${Date.now()}`,
    title,
    description,
    fileUrl: `/uploads/documents/${fileName}`,
    fileName: file.name,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };

  const site = await getSiteData();
  site.documents = [doc, ...site.documents];
  await saveSiteData(site);

  return NextResponse.json(doc);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
  }

  const site = await getSiteData();
  const doc = site.documents.find((item) => item.id === id);
  if (!doc) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  if (doc.fileUrl?.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", doc.fileUrl);
    try {
      await fs.unlink(filePath);
    } catch {
      // file may already be removed
    }
  }

  site.documents = site.documents.filter((item) => item.id !== id);
  await saveSiteData(site);

  return NextResponse.json({ ok: true });
}
