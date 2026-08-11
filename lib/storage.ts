import { promises as fs } from "fs";
import path from "path";
import { defaultSiteData } from "./defaults";
import type { ReviewsCache, SiteData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_FILE = path.join(DATA_DIR, "site.json");
const REVIEWS_CACHE_FILE = path.join(DATA_DIR, "reviews-cache.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "documents");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export async function getSiteData(): Promise<SiteData> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(SITE_FILE, "utf8");
    return { ...defaultSiteData, ...JSON.parse(raw) };
  } catch {
    return defaultSiteData;
  }
}

export async function saveSiteData(data: SiteData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(SITE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export async function getReviewsCache(): Promise<ReviewsCache | null> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(REVIEWS_CACHE_FILE, "utf8");
    return JSON.parse(raw) as ReviewsCache;
  } catch {
    return null;
  }
}

export async function saveReviewsCache(cache: ReviewsCache): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(REVIEWS_CACHE_FILE, JSON.stringify(cache, null, 2), "utf8");
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}
