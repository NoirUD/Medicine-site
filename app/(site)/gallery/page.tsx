import { getDoctor, getGalleryPhotos } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";
import { PhotoGallery } from "@/components/PhotoGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const doctor = await getDoctor();
  return {
    title: "Галерея",
    description: `Фотогалерея ${doctor.name}`,
  };
}

export default async function GalleryPage() {
  const photos = await getGalleryPhotos();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle
        title="Галерея"
        subtitle="Фотографии из практики, клиники и повседневной работы"
        centered
      />
      <PhotoGallery
        photos={photos}
        emptyMessage="Фотографии скоро будут добавлены. Загрузите их через админ-панель."
      />
    </div>
  );
}
