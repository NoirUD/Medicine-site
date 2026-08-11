import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getSiteData } from "@/lib/storage";

export default async function AdminContentPage() {
  const site = await getSiteData();

  return (
    <AdminShell title="Контент сайта">
      <ContentEditor initialData={site} />
    </AdminShell>
  );
}
