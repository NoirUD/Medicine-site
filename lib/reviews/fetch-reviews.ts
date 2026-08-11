import * as cheerio from "cheerio";
import { MIN_REVIEW_RATING, REVIEW_SOURCES } from "@/lib/defaults";
import type { ExternalReview, ReviewSource } from "@/lib/types";

const BROWSER_HEADERS: HeadersInit = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function fetchHtml(url: string, referer?: string): Promise<string> {
  const headers = new Headers(BROWSER_HEADERS);
  if (referer) headers.set("Referer", referer);

  const response = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function normalizeRating(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value > 5) return value / 20;
    if (value > 0 && value <= 5) return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(",", "."));
    if (!Number.isNaN(parsed)) return normalizeRating(parsed);
  }
  return null;
}

function passesRatingFilter(rating: number): boolean {
  return rating >= MIN_REVIEW_RATING;
}

function hashId(source: ReviewSource, author: string, text: string): string {
  const input = `${source}:${author}:${text.slice(0, 80)}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `${source}-${Math.abs(hash)}`;
}

function parseYandexReviews(html: string, sourceUrl: string): ExternalReview[] {
  const match = html.match(/m\.innerHTML='(\{[\s\S]*?\})'/);
  if (!match) return [];

  const jsonStr = match[1]
    .replace(/\\"/g, '"')
    .replace(/\\u002F/g, "/")
    .replace(/\\\\/g, "\\");

  const data = JSON.parse(jsonStr) as {
    review?: Array<{
      reviewBody?: string;
      reviewRating?: { ratingValue?: number };
      author?: { name?: string };
      datePublished?: string;
    }>;
  };

  return (data.review ?? [])
    .map((item) => {
      const rating = normalizeRating(item.reviewRating?.ratingValue) ?? 0;
      const text = (item.reviewBody ?? "").trim();
      const author = item.author?.name?.trim() || "Пациент";
      if (!text || !passesRatingFilter(rating)) return null;

      return {
        id: hashId("yandex", author, text),
        author,
        text,
        rating,
        date: item.datePublished ?? "",
        source: "yandex" as const,
        sourceUrl,
      };
    })
    .filter(Boolean) as ExternalReview[];
}

function parseJsonLdReviews(html: string, source: ReviewSource, sourceUrl: string): ExternalReview[] {
  const $ = cheerio.load(html);
  const results: ExternalReview[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const json = JSON.parse($(el).html() ?? "{}") as Record<string, unknown>;
      const items = Array.isArray(json) ? json : [json];

      for (const item of items) {
        const reviews = item.review;
        if (!Array.isArray(reviews)) continue;

        for (const review of reviews) {
          const r = review as {
            reviewBody?: string;
            reviewRating?: { ratingValue?: number };
            author?: { name?: string };
            datePublished?: string;
          };
          const rating = normalizeRating(r.reviewRating?.ratingValue) ?? 0;
          const text = (r.reviewBody ?? "").trim();
          const author = r.author?.name?.trim() || "Пациент";
          if (!text || !passesRatingFilter(rating)) continue;

          results.push({
            id: hashId(source, author, text),
            author,
            text,
            rating,
            date: r.datePublished ?? "",
            source,
            sourceUrl,
          });
        }
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  });

  return results;
}

function parseEmbeddedJsonReviews(
  html: string,
  source: ReviewSource,
  sourceUrl: string,
): ExternalReview[] {
  const patterns = [
    /"reviews"\s*:\s*(\[[\s\S]*?\])\s*,\s*"/,
    /"feedbacks"\s*:\s*(\[[\s\S]*?\])\s*,\s*"/,
    /"comments"\s*:\s*(\[[\s\S]*?\])\s*,\s*"/,
  ];

  const results: ExternalReview[] = [];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match) continue;

    try {
      const items = JSON.parse(match[1]) as Array<Record<string, unknown>>;
      for (const item of items) {
        const text = String(
          item.text ?? item.comment ?? item.reviewBody ?? item.body ?? "",
        ).trim();
        const author = String(
          item.author ?? item.userName ?? item.name ?? item.client_name ?? "Пациент",
        ).trim();
        const rating =
          normalizeRating(item.rating ?? item.rate ?? item.score ?? item.mark) ?? 0;
        const date = String(item.date ?? item.created_at ?? item.published_at ?? "");

        if (!text || !passesRatingFilter(rating)) continue;

        results.push({
          id: hashId(source, author, text),
          author,
          text,
          rating,
          date,
          source,
          sourceUrl,
        });
      }
    } catch {
      // try next pattern
    }
  }

  return results;
}

function parseProdoctorovReviews(html: string, sourceUrl: string): ExternalReview[] {
  if (html.includes("<h1>Forbidden</h1>")) return [];

  const $ = cheerio.load(html);
  const results: ExternalReview[] = [];

  $('[itemprop="review"], .b-review, .review-card, .Review').each((_, el) => {
    const block = $(el);
    const text = block
      .find('[itemprop="reviewBody"], .b-review__text, .review-text, .Review-Text')
      .text()
      .trim();
    const author = block
      .find('[itemprop="author"], .b-review__author, .review-author')
      .text()
      .trim();
    const ratingRaw =
      block.find('[itemprop="ratingValue"]').attr("content") ??
      block.find(".rating").attr("data-rate") ??
      block.find(".b-review__rating").text();
    const rating = normalizeRating(ratingRaw) ?? 0;
    const date = block.find("time").attr("datetime") ?? block.find("time").text().trim();

    if (!text || !passesRatingFilter(rating)) return;

    results.push({
      id: hashId("prodoctorov", author || "Пациент", text),
      author: author || "Пациент",
      text,
      rating,
      date,
      source: "prodoctorov",
      sourceUrl,
    });
  });

  return [
    ...parseJsonLdReviews(html, "prodoctorov", sourceUrl),
    ...parseEmbeddedJsonReviews(html, "prodoctorov", sourceUrl),
    ...results,
  ];
}

function parseDocdocReviews(html: string, sourceUrl: string): ExternalReview[] {
  if (html.includes("<h1>Forbidden</h1>")) return [];

  const $ = cheerio.load(html);
  const results: ExternalReview[] = [];

  $('[data-qa="review-item"], .review-item, .ReviewItem').each((_, el) => {
    const block = $(el);
    const text = block.find(".review-item__text, .ReviewItem-Text, p").first().text().trim();
    const author = block.find(".review-item__author, .ReviewItem-Author").text().trim();
    const ratingText = block.find(".rating, [data-rate]").attr("data-rate") ?? "";
    const rating = normalizeRating(ratingText) ?? 5;
    const date = block.find("time").text().trim();

    if (!text || !passesRatingFilter(rating)) return;

    results.push({
      id: hashId("docdoc", author || "Пациент", text),
      author: author || "Пациент",
      text,
      rating,
      date,
      source: "docdoc",
      sourceUrl,
    });
  });

  return [
    ...parseJsonLdReviews(html, "docdoc", sourceUrl),
    ...parseEmbeddedJsonReviews(html, "docdoc", sourceUrl),
    ...results,
  ];
}

function parseNapopravkuReviews(html: string, sourceUrl: string): ExternalReview[] {
  if (html.includes("js-challenge-loader")) {
    return parseEmbeddedJsonReviews(html, "napopravku", sourceUrl);
  }

  const $ = cheerio.load(html);
  const results: ExternalReview[] = [];

  $('[data-qa="review-card"], .review-card, .ReviewCard').each((_, el) => {
    const block = $(el);
    const text = block.find(".review-card__text, .ReviewCard-Text").text().trim();
    const author = block.find(".review-card__author, .ReviewCard-Author").text().trim();
    const rating = normalizeRating(block.find("[data-rate]").attr("data-rate")) ?? 5;
    const date = block.find("time").text().trim();

    if (!text || !passesRatingFilter(rating)) return;

    results.push({
      id: hashId("napopravku", author || "Пациент", text),
      author: author || "Пациент",
      text,
      rating,
      date,
      source: "napopravku",
      sourceUrl,
    });
  });

  return [
    ...parseJsonLdReviews(html, "napopravku", sourceUrl),
    ...parseEmbeddedJsonReviews(html, "napopravku", sourceUrl),
    ...results,
  ];
}

function dedupeReviews(reviews: ExternalReview[]): ExternalReview[] {
  const seen = new Set<string>();
  return reviews.filter((review) => {
    const key = `${review.source}:${review.text.slice(0, 120)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function scrapeSource(source: ReviewSource): Promise<{
  reviews: ExternalReview[];
  error?: string;
}> {
  const config = REVIEW_SOURCES[source];
  try {
    const html = await fetchHtml(config.url, "https://www.google.com/");
    let reviews: ExternalReview[] = [];

    switch (source) {
      case "yandex":
        reviews = parseYandexReviews(html, config.url);
        break;
      case "napopravku":
        reviews = parseNapopravkuReviews(html, config.url);
        break;
      case "docdoc":
        reviews = parseDocdocReviews(html, config.url);
        break;
      case "prodoctorov":
        reviews = parseProdoctorovReviews(html, config.url);
        break;
    }

    if (reviews.length === 0 && source !== "yandex") {
      return {
        reviews: [],
        error: "Не удалось получить отзывы (сайт может блокировать автоматические запросы)",
      };
    }

    return { reviews };
  } catch (error) {
    return {
      reviews: [],
      error: error instanceof Error ? error.message : "Ошибка загрузки",
    };
  }
}

export async function fetchAllExternalReviews(): Promise<{
  reviews: ExternalReview[];
  errors: Partial<Record<ReviewSource, string>>;
  updatedAt: string;
}> {
  const sources = Object.keys(REVIEW_SOURCES) as ReviewSource[];
  const results = await Promise.all(sources.map((source) => scrapeSource(source)));

  const errors: Partial<Record<ReviewSource, string>> = {};
  const reviews: ExternalReview[] = [];

  sources.forEach((source, index) => {
    const result = results[index];
    reviews.push(...result.reviews);
    if (result.error) errors[source] = result.error;
  });

  return {
    reviews: dedupeReviews(reviews).sort((a, b) => b.rating - a.rating),
    errors,
    updatedAt: new Date().toISOString(),
  };
}

export async function getExternalReviews(forceRefresh = false) {
  const { getReviewsCache, saveReviewsCache } = await import("@/lib/storage");
  const cache = await getReviewsCache();
  const cacheAgeMs = cache ? Date.now() - new Date(cache.updatedAt).getTime() : Infinity;

  if (!forceRefresh && cache && cacheAgeMs < 6 * 60 * 60 * 1000) {
    return cache;
  }

  const fresh = await fetchAllExternalReviews();
  const nextCache = {
    updatedAt: fresh.updatedAt,
    reviews: fresh.reviews,
    errors: fresh.errors,
  };

  if (fresh.reviews.length > 0 || !cache) {
    await saveReviewsCache(nextCache);
    return nextCache;
  }

  if (cache) {
    return {
      ...cache,
      errors: { ...cache.errors, ...fresh.errors },
    };
  }

  await saveReviewsCache(nextCache);
  return nextCache;
}
