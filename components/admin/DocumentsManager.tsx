"use client";

import { useState } from "react";
import type { DocumentCategory, DocumentItem } from "@/lib/types";

type DocumentsManagerProps = {
  initialEducational: DocumentItem[];
  initialLegal: DocumentItem[];
};

export function DocumentsManager({
  initialEducational,
  initialLegal,
}: DocumentsManagerProps) {
  const [educational, setEducational] = useState(initialEducational);
  const [legal, setLegal] = useState(initialLegal);
  const [category, setCategory] = useState<DocumentCategory>("educational");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function upload() {
    if (!file || !title.trim()) {
      setMessage("Укажите название и выберите файл");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);

    try {
      const res = await fetch("/api/documents", { method: "POST", body: formData });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Ошибка загрузки");
      }
      const doc = (await res.json()) as DocumentItem;
      if (category === "legal") {
        setLegal((prev) => [doc, ...prev]);
      } else {
        setEducational((prev) => [doc, ...prev]);
      }
      setTitle("");
      setDescription("");
      setFile(null);
      setStatus("idle");
      setMessage("Документ загружен и появится на сайте");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Ошибка загрузки");
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить документ?")) return;
    const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setEducational((prev) => prev.filter((d) => d.id !== id));
      setLegal((prev) => prev.filter((d) => d.id !== id));
    }
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Загрузить документ</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Поддерживаются JPG, PNG, WEBP и PDF. Образовательные документы — витрина на странице «Обо
          мне». Юридические — витрина на странице «Услуги».
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory("educational")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              category === "educational"
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Образовательные
          </button>
          <button
            type="button"
            onClick={() => setCategory("legal")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              category === "legal"
                ? "bg-emerald-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            }`}
          >
            Юридические
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Название</span>
            <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Описание</span>
            <input
              className={inputClass}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-zinc-600">Файл</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={upload}
            disabled={status === "uploading"}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {status === "uploading" ? "Загрузка..." : "Загрузить"}
          </button>
          {message && (
            <span className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}>
              {message}
            </span>
          )}
        </div>
      </section>

      <DocumentList
        title="Образовательные документы"
        hint="Дипломы, сертификаты — страница «Обо мне»"
        documents={educational}
        onRemove={remove}
      />
      <DocumentList
        title="Юридические документы"
        hint="Договоры, оферты — страница «Услуги»"
        documents={legal}
        onRemove={remove}
      />
    </div>
  );
}

function DocumentList({
  title,
  hint,
  documents,
  onRemove,
}: {
  title: string;
  hint: string;
  documents: DocumentItem[];
  onRemove: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-zinc-900">
        {title} ({documents.length})
      </h2>
      <p className="mt-1 text-sm text-zinc-500">{hint}</p>
      {documents.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">Документы ещё не загружены.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 p-4"
            >
              <div className="flex items-center gap-4">
                {doc.fileUrl?.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doc.fileUrl}
                    alt={doc.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-emerald-50 text-sm font-medium text-emerald-700">
                    PDF
                  </div>
                )}
                <div>
                  <p className="font-medium text-zinc-900">{doc.title}</p>
                  {doc.description && (
                    <p className="text-sm text-zinc-500">{doc.description}</p>
                  )}
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-700 hover:underline"
                    >
                      Открыть
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(doc.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
