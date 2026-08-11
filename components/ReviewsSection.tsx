import { getExternalReviews } from "@/lib/reviews/fetch-reviews";
import { getReviews } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";
import { ExternalReviewCard, ReviewSourceLinks } from "@/components/ExternalReviewCard";
import type { ExternalReview, Review } from "@/lib/types";

function mergeReviews(local: Review[], external: ExternalReview[]) {
  const seen = new Set<string>();
  const merged: (Review | ExternalReview)[] = [];

  for (const review of [...external, ...local]) {
    const key = review.text.slice(0, 120).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(review);
  }

  return merged.sort((a, b) => b.rating - a.rating);
}

export async function ReviewsSection() {
  const localReviews = await getReviews();
  const cache = await getExternalReviews();
  const reviews = mergeReviews(localReviews, cache.reviews);

  return (
    <section className="bg-emerald-50/60 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle
          title="Отзывы пациентов"
          subtitle="Реальные отзывы с агрегаторов и нашего сайта"
          centered
        />

        {reviews.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            Отзывы загружаются. Попробуйте обновить страницу через минуту.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ExternalReviewCard key={String(review.id)} review={review} />
            ))}
          </div>
        )}

        <ReviewSourceLinks />

        {Object.keys(cache.errors).length > 0 && (
          <p className="mt-6 text-center text-xs text-zinc-400">
            Больше отзывов можно посмотреть по ссылкам выше.
          </p>
        )}
      </div>
    </section>
  );
}
