"use client";

import { useState } from "react";
import type { DocumentItem } from "@/lib/types";

type DocumentGalleryProps = {
  documents: DocumentItem[];
};

export function DocumentGallery({ documents }: DocumentGalleryProps) {
  const [lightbox, setLightbox] = useState<DocumentItem | null>(null);

  if (documents.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500">
        Документы скоро будут добавлены.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => {
          const isImage =
            doc.mimeType?.startsWith("image/") ||
            doc.fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i);
          const isPdf = doc.mimeType === "application/pdf" || doc.fileUrl?.endsWith(".pdf");

          return (
            <article
              key={doc.id}
              className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {doc.fileUrl && isImage ? (
                <button
                  type="button"
                  onClick={() => setLightbox(doc)}
                  className="relative block w-full overflow-hidden bg-zinc-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={doc.fileUrl}
                    alt={doc.title}
                    className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </button>
              ) : (
                <div className="flex h-48 items-center justify-center bg-emerald-50">
                  {isPdf ? (
                    <svg className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="h-16 w-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
              )}

              <div className="p-5">
                <h3 className="font-semibold text-zinc-900">{doc.title}</h3>
                {doc.description && (
                  <p className="mt-1 text-sm text-zinc-500">{doc.description}</p>
                )}
                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    {isPdf ? "Открыть PDF" : "Открыть файл"}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
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
              alt={lightbox.title}
              className="max-h-[80vh] w-full rounded-lg object-contain"
            />
            <p className="mt-3 text-center text-sm text-white">{lightbox.title}</p>
          </div>
        </div>
      )}
    </>
  );
}
