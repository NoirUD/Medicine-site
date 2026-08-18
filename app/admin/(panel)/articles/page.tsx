import { AdminShell } from "@/components/admin/AdminShell";
import { ArticlesManager } from "@/components/admin/ArticlesManager";
import { getSiteData } from "@/lib/storage";

export default async function AdminArticlesPage() {
  const site = await getSiteData();

  return (
    <AdminShell title="Статьи">
      <ArticlesManager initialArticles={site.articles} />
    </AdminShell>
  );
}