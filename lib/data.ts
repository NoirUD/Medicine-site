import { getSiteData } from "./storage";

export async function getDoctor() {
  const site = await getSiteData();
  return site.doctor;
}

export async function getContacts() {
  const site = await getSiteData();
  return site.contacts;
}

export async function getSocialLinks() {
  const site = await getSiteData();
  return site.socialLinks;
}

export async function getReviews() {
  const site = await getSiteData();
  return site.reviews;
}

export async function getEducation() {
  const site = await getSiteData();
  return site.education;
}

export async function getEducationalDocuments() {
  const site = await getSiteData();
  return site.educationalDocuments;
}

export async function getLegalDocuments() {
  const site = await getSiteData();
  return site.legalDocuments;
}

export async function getGalleryPhotos() {
  const site = await getSiteData();
  return site.galleryPhotos;
}

export async function getWorkPlaces() {
  const site = await getSiteData();
  return site.workPlaces;
}

export async function getProfessionalAchievements() {
  const site = await getSiteData();
  return site.professionalAchievements;
}

export async function getPersonalAchievements() {
  const site = await getSiteData();
  return site.personalAchievements;
}

export async function getServices() {
  const site = await getSiteData();
  return site.services;
}
