import { promises as fs } from "fs";
import path from "path";
import { defaultSiteData } from "./defaults";
import type { ReviewsCache, SiteData } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const SITE_FILE = path.join(DATA_DIR, "site.json");
const REVIEWS_CACHE_FILE = path.join(DATA_DIR, "reviews-cache.json");
const DOCUMENTS_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "documents");
const GALLERY_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(DOCUMENTS_UPLOADS_DIR, { recursive: true });
  await fs.mkdir(GALLERY_UPLOADS_DIR, { recursive: true });
}

function migrateSiteData(raw: Partial<SiteData> & { documents?: SiteData["educationalDocuments"] }): SiteData {
  const educational =
    raw.educationalDocuments ??
    raw.documents?.map((doc) => ({ ...doc, category: "educational" as const })) ??
    defaultSiteData.educationalDocuments;

  const legal = raw.legalDocuments ?? defaultSiteData.legalDocuments;
  const galleryPhotos = raw.galleryPhotos ?? defaultSiteData.galleryPhotos;
  const articles = raw.articles ?? defaultSiteData.articles;

  return {
    ...defaultSiteData,
    ...raw,
    doctor: { ...defaultSiteData.doctor, ...raw.doctor },
    contacts: { ...defaultSiteData.contacts, ...raw.contacts },
    educationalDocuments: educational,
    legalDocuments: legal,
    galleryPhotos,
    articles,
  };
}

export async function getSiteData(): Promise<SiteData> {
  await ensureDataDir();
  try {
    const raw = JSON.parse(await fs.readFile(SITE_FILE, "utf8")) as Partial<SiteData> & {
      documents?: SiteData["educationalDocuments"];
    };
    return migrateSiteData(raw);
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

export function getDocumentsUploadsDir() {
  return DOCUMENTS_UPLOADS_DIR;
}

export function getGalleryUploadsDir() {
  return GALLERY_UPLOADS_DIR;
}
