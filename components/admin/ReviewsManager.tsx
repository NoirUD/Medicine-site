"use client";

import { useState } from "react";
import type { ReviewsCache } from "@/lib/types";
import { REVIEW_SOURCES } from "@/lib/defaults";

type ReviewsManagerProps = {
  initialCache: ReviewsCache;
};

export function ReviewsManager({ initialCache }: ReviewsManagerProps) {
  const [cache, setCache] = useState(initialCache);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", { method: "POST" });
      if (res.ok) {
        const data = (await res.json()) as ReviewsCache;
        setCache(data);
      }
    } finally {
      setLoading(false);
    }
  }

  const sourceCounts = cache.reviews.reduce<Record<string, number>>((acc, r) => {
    acc[r.source] = (acc[r.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Автозагрузка отзывов</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Отзывы с оценкой ≥ 4.5 из Яндекс.Медицина и других агрегаторов. Обновление раз в 6
              часов.
            </p>
            <p className="mt-2 text-xs text-zinc-400">
              Обновлено:{" "}
              {new Date(cache.updatedAt).toLocaleString("ru-RU")}
            </p>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Загрузка..." : "Обновить сейчас"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Статус источников</h2>
        <div className="space-y-3">
          {(Object.entries(REVIEW_SOURCES) as [string, { name: string; url: string }][]).map(
            ([key, src]) => {
              const count = sourceCounts[key] ?? 0;
              const error = cache.errors[key as keyof typeof cache.errors];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 p-4"
                >
                  <div>
                    <p className="font-medium text-zinc-900">{src.name}</p>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline"
                    >
                      Открыть страницу
                    </a>
                    {error && (
                      <p className="mt-1 text-xs text-amber-700">
                        {error} — сайт блокирует автоматические запросы
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      count > 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {count} отзывов
                  </span>
                </div>
              );
            },
          )}
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          НаПоправку, DocDoc и ПроДокторов используют защиту от ботов. Отзывы с них можно добавить
          вручную в разделе «Контент сайта» или посмотреть по ссылкам на сайте.
        </p>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Загруженные отзывы ({cache.reviews.length})
        </h2>
        {cache.reviews.length === 0 ? (
          <p className="text-sm text-zinc-500">Отзывы ещё не загружены.</p>
        ) : (
          <div className="space-y-3">
            {cache.reviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-zinc-100 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-900">{review.author}</span>
                  <span className="text-xs text-zinc-500">
                    {review.source} · {review.rating}★
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
