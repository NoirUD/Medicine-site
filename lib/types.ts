export type SocialLink = {
  name: string;
  href: string;
  icon: string;
};

export type Review = {
  id: number | string;
  author: string;
  text: string;
  rating: number;
  date: string;
};

export type ExternalReview = {
  id: string;
  author: string;
  text: string;
  rating: number;
  date: string;
  source: ReviewSource;
  sourceUrl: string;
};

export type ReviewSource = "yandex" | "napopravku" | "docdoc" | "prodoctorov";

export type Education = {
  institution: string;
  degree: string;
  year: string;
};

export type DocumentCategory = "educational" | "legal";

export type DocumentItem = {
  id: string;
  title: string;
  description: string;
  category?: DocumentCategory;
  fileUrl?: string;
  fileName?: string;
  mimeType?: string;
  uploadedAt?: string;
};

export type GalleryPhoto = {
  id: string;
  description: string;
  fileUrl: string;
  fileName?: string;
  mimeType?: string;
  uploadedAt?: string;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type WorkPlace = {
  place: string;
  role: string;
  period: string;
  years: string;
};

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
};

export type SiteData = {
  doctor: {
    name: string;
    title: string;
    shortBio: string;
    fullBio: string;
    photo: string;
    experienceYears: number;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
    workHours: string;
  };
  socialLinks: SocialLink[];
  reviews: Review[];
  education: Education[];
  educationalDocuments: DocumentItem[];
  legalDocuments: DocumentItem[];
  galleryPhotos: GalleryPhoto[];
  articles: Article[];
  workPlaces: WorkPlace[];
  professionalAchievements: string[];
  personalAchievements: string[];
  services: Service[];
};

export type ReviewsCache = {
  updatedAt: string;
  reviews: ExternalReview[];
  errors: Partial<Record<ReviewSource, string>>;
};
