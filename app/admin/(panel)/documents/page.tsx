import { AdminShell } from "@/components/admin/AdminShell";
import { DocumentsManager } from "@/components/admin/DocumentsManager";
import { getSiteData } from "@/lib/storage";

export default async function AdminDocumentsPage() {
  const site = await getSiteData();

  return (
    <AdminShell title="Документы">
      <DocumentsManager
        initialEducational={site.educationalDocuments}
        initialLegal={site.legalDocuments}
      />
    </AdminShell>
  );
}
