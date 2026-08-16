import { AdminShell } from "@/components/admin/AdminShell";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { getSiteData } from "@/lib/storage";

export default async function AdminGalleryPage() {
  const site = await getSiteData();

  return (
    <AdminShell title="Галерея">
      <GalleryManager initialPhotos={site.galleryPhotos} />
    </AdminShell>
  );
}
