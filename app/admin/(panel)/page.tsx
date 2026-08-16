import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSiteData } from "@/lib/storage";

export default async function AdminOverviewPage() {
  const site = await getSiteData();

  return (
    <AdminShell title="Обзор">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Документы"
          value={site.educationalDocuments.length + site.legalDocuments.length}
          href="/admin/documents"
        />
        <StatCard label="Услуги" value={site.services.length} href="/admin/content" />
        <StatCard label="Галерея" value={site.galleryPhotos.length} href="/admin/gallery" />
        <StatCard label="Ручные отзывы" value={site.reviews.length} href="/admin/content" />
        <StatCard label="Опыт" value={`${site.doctor.experienceYears} лет`} href="/admin/content" />
      </div>

      <section className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-zinc-900">Быстрые действия</h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link href="/admin/content" className="text-emerald-700 hover:underline">
              Редактировать текст и контакты
            </Link>
          </li>
          <li>
            <Link href="/admin/documents" className="text-emerald-700 hover:underline">
              Загрузить диплом или сертификат
            </Link>
          </li>
          <li>
            <Link href="/admin/gallery" className="text-emerald-700 hover:underline">
              Загрузить фото в галерею
            </Link>
          </li>
          <li>
            <Link href="/admin/reviews" className="text-emerald-700 hover:underline">
              Обновить отзывы с агрегаторов
            </Link>
          </li>
          <li>
            <Link href="/" className="text-emerald-700 hover:underline" target="_blank">
              Открыть сайт
            </Link>
          </li>
        </ul>
      </section>
    </AdminShell>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-zinc-900">{value}</p>
    </Link>
  );
}
