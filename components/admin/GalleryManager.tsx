"use client";

import { useState } from "react";
import type { GalleryPhoto } from "@/lib/types";

type GalleryManagerProps = {
  initialPhotos: GalleryPhoto[];
};

export function GalleryManager({ initialPhotos }: GalleryManagerProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function upload() {
    if (!file) {
      setMessage("Выберите фотографию");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", description.trim());

    try {
      const res = await fetch("/api/gallery", { method: "POST", body: formData });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Ошибка загрузки");
      }
      const photo = (await res.json()) as GalleryPhoto;
      setPhotos((prev) => [photo, ...prev]);
      setDescription("");
      setFile(null);
      setStatus("idle");
      setMessage("Фото загружено и появится в галерее");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Ошибка загрузки");
    }
  }

  async function saveDescription(id: string) {
    setSavingId(id);
    try {
      const res = await fetch("/api/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, description: editDescription }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      const updated = (await res.json()) as GalleryPhoto;
      setPhotos((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setEditingId(null);
      setEditDescription("");
    } catch {
      setMessage("Не удалось сохранить описание");
      setStatus("error");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить фотографию?")) return;
    const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) setEditingId(null);
    }
  }

  function startEdit(photo: GalleryPhoto) {
    setEditingId(photo.id);
    setEditDescription(photo.description);
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Загрузить фото</h2>
        <p className="mb-4 text-sm text-zinc-500">
          JPG, PNG или WEBP. Фотографии отображаются на странице «Галерея».
        </p>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Описание</span>
            <textarea
              className={inputClass}
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Необязательное описание фотографии"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Файл</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
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

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Фотографии в галерее ({photos.length})
        </h2>
        {photos.length === 0 ? (
          <p className="text-sm text-zinc-500">Фотографии ещё не загружены.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {photos.map((photo) => (
              <div key={photo.id} className="rounded-xl border border-zinc-100 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.fileUrl}
                  alt={photo.description || "Фото"}
                  className="h-40 w-full rounded-lg object-cover"
                />
                {editingId === photo.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      className={inputClass}
                      rows={2}
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveDescription(photo.id)}
                        disabled={savingId === photo.id}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-60"
                      >
                        {savingId === photo.id ? "Сохранение..." : "Сохранить"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-sm text-zinc-500 hover:text-zinc-700"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-sm text-zinc-600">
                      {photo.description || <span className="text-zinc-400">Без описания</span>}
                    </p>
                    <div className="mt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(photo)}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        Изменить описание
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(photo.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
