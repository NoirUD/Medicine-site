import type { ExternalReview, Review, ReviewSource } from "@/lib/types";
import { REVIEW_SOURCES } from "@/lib/defaults";

const SOURCE_LABELS: Record<ReviewSource, string> = {
  yandex: "Яндекс",
  napopravku: "НаПоправку",
  docdoc: "DocDoc",
  prodoctorov: "ПроДокторов",
};

type ReviewItem = Review | ExternalReview;

function formatDate(date: string) {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    }
  } catch {
    // keep original
  }
  return date;
}

export function ExternalReviewCard({ review }: { review: ReviewItem }) {
  const source = "source" in review ? review.source : null;
  const sourceUrl = "sourceUrl" in review ? review.sourceUrl : null;
  const sourceLabel = source ? SOURCE_LABELS[source] : "Сайт";

  return (
    <article className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < Math.round(review.rating) ? "text-amber-400" : "text-zinc-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
          >
            {sourceLabel}
          </a>
        ) : (
          <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
            {sourceLabel}
          </span>
        )}
      </div>
      <p className="flex-1 text-sm leading-relaxed text-zinc-600">&ldquo;{review.text}&rdquo;</p>
      <footer className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="text-sm font-medium text-zinc-900">{review.author}</span>
        {review.date && (
          <span className="text-xs text-zinc-400">{formatDate(review.date)}</span>
        )}
      </footer>
    </article>
  );
}

export function ReviewSourceLinks() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {(Object.entries(REVIEW_SOURCES) as [ReviewSource, { name: string; url: string }][]).map(
        ([key, src]) => (
          <a
            key={key}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
          >
            Отзывы на {src.name}
          </a>
        ),
      )}
    </div>
  );
}
