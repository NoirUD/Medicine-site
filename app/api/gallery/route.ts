import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getGalleryUploadsDir, getSiteData, saveSiteData } from "@/lib/storage";
import type { GalleryPhoto } from "@/lib/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function revalidateGallery() {
  revalidatePath("/gallery");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const description = String(formData.get("description") ?? "").trim();

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Выберите фотографию" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Поддерживаются только JPG, PNG и WEBP" },
      { status: 400 },
    );
  }

  const uploadsDir = getGalleryUploadsDir();
  await fs.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.name) || ".jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  const photo: GalleryPhoto = {
    id: `photo-${Date.now()}`,
    description,
    fileUrl: `/uploads/gallery/${fileName}`,
    fileName: file.name,
    mimeType: file.type,
    uploadedAt: new Date().toISOString(),
  };

  const site = await getSiteData();
  site.galleryPhotos = [photo, ...site.galleryPhotos];
  await saveSiteData(site);
  revalidateGallery();

  return NextResponse.json(photo);
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string; description?: string };
  const id = body.id?.trim();
  const description = String(body.description ?? "").trim();

  if (!id) {
    return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
  }

  const site = await getSiteData();
  const index = site.galleryPhotos.findIndex((p) => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Фото не найдено" }, { status: 404 });
  }

  site.galleryPhotos[index] = { ...site.galleryPhotos[index], description };
  await saveSiteData(site);
  revalidateGallery();

  return NextResponse.json(site.galleryPhotos[index]);
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
  const photo = site.galleryPhotos.find((item) => item.id === id);
  if (!photo) {
    return NextResponse.json({ error: "Фото не найдено" }, { status: 404 });
  }

  if (photo.fileUrl?.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", photo.fileUrl);
    try {
      await fs.unlink(filePath);
    } catch {
      // file may already be removed
    }
  }

  site.galleryPhotos = site.galleryPhotos.filter((item) => item.id !== id);
  await saveSiteData(site);
  revalidateGallery();

  return NextResponse.json({ ok: true });
}
