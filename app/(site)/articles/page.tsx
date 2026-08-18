import { getDoctor, getArticles } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";
import { ArticleCard } from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const doctor = await getDoctor();
  return {
    title: "Статьи",
    description: `Статьи о здоровье и питании от ${doctor.name}`,
  };
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle
        title="Статьи"
        subtitle="Полезные материалы о здоровье, питании и профилактике"
        centered
      />
      {articles.length === 0 ? (
        <p className="text-center text-sm text-zinc-500">
          Статьи скоро появятся. Добавьте их через админ-панель.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}