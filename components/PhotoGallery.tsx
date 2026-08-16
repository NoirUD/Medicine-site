"use client";

import { useState } from "react";
import type { GalleryPhoto } from "@/lib/types";

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
  emptyMessage?: string;
};

export function PhotoGallery({ photos, emptyMessage }: PhotoGalleryProps) {
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">
        {emptyMessage ?? "Фотографии скоро будут добавлены."}
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <article
            key={photo.id}
            className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setLightbox(photo)}
              className="relative block w-full overflow-hidden bg-zinc-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.fileUrl}
                alt={photo.description || "Фото галереи"}
                className="h-56 w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
            {photo.description && (
              <div className="p-4">
                <p className="text-sm leading-relaxed text-zinc-600">{photo.description}</p>
              </div>
            )}
          </article>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Закрыть"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-h-[90vh] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.fileUrl}
              alt={lightbox.description || "Фото"}
              className="max-h-[75vh] w-full rounded-lg object-contain"
            />
            {lightbox.description && (
              <p className="mt-4 text-center text-sm text-white/90">{lightbox.description}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
