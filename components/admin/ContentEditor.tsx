"use client";

import { useState } from "react";
import type { SiteData } from "@/lib/types";

type ContentEditorProps = {
  initialData: SiteData;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900">{title}</h2>
      {children}
    </section>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export function ContentEditor({ initialData }: ContentEditorProps) {
  const [data, setData] = useState<SiteData>(initialData);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function save() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      setStatus("saved");
      setMessage("Изменения сохранены");
    } catch {
      setStatus("error");
      setMessage("Не удалось сохранить изменения");
    }
  }

  return (
    <div className="space-y-6">
      <Section title="О враче">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">ФИО</span>
            <input
              className={inputClass}
              value={data.doctor.name}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, name: e.target.value } })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Специализация</span>
            <input
              className={inputClass}
              value={data.doctor.title}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, title: e.target.value } })
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-zinc-600">Краткое описание</span>
            <textarea
              className={inputClass}
              rows={2}
              value={data.doctor.shortBio}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, shortBio: e.target.value } })
              }
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm text-zinc-600">Полное описание</span>
            <textarea
              className={inputClass}
              rows={4}
              value={data.doctor.fullBio}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, fullBio: e.target.value } })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Фото (URL)</span>
            <input
              className={inputClass}
              value={data.doctor.photo}
              onChange={(e) =>
                setData({ ...data, doctor: { ...data.doctor, photo: e.target.value } })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Опыт (лет)</span>
            <input
              type="number"
              className={inputClass}
              value={data.doctor.experienceYears}
              onChange={(e) =>
                setData({
                  ...data,
                  doctor: { ...data.doctor, experienceYears: Number(e.target.value) },
                })
              }
            />
          </label>
        </div>
      </Section>

      <Section title="Контакты">
        <div className="grid gap-4 sm:grid-cols-2">
          {(["phone", "email", "address", "workHours"] as const).map((field) => (
            <label key={field} className="block">
              <span className="mb-1 block text-sm text-zinc-600">
                {field === "phone"
                  ? "Телефон"
                  : field === "email"
                    ? "Email"
                    : field === "address"
                      ? "Адрес"
                      : "Часы работы"}
              </span>
              <input
                className={inputClass}
                value={data.contacts[field]}
                onChange={(e) =>
                  setData({
                    ...data,
                    contacts: { ...data.contacts, [field]: e.target.value },
                  })
                }
              />
            </label>
          ))}
        </div>
      </Section>

      <Section title="Услуги">
        <div className="space-y-4">
          {data.services.map((service, index) => (
            <div key={service.id} className="rounded-xl border border-zinc-100 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Название"
                  value={service.name}
                  onChange={(e) => {
                    const services = [...data.services];
                    services[index] = { ...service, name: e.target.value };
                    setData({ ...data, services });
                  }}
                />
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Цена"
                  value={service.price}
                  onChange={(e) => {
                    const services = [...data.services];
                    services[index] = { ...service, price: Number(e.target.value) };
                    setData({ ...data, services });
                  }}
                />
                <textarea
                  className={`${inputClass} sm:col-span-2`}
                  rows={2}
                  placeholder="Описание"
                  value={service.description}
                  onChange={(e) => {
                    const services = [...data.services];
                    services[index] = { ...service, description: e.target.value };
                    setData({ ...data, services });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Длительность"
                  value={service.duration}
                  onChange={(e) => {
                    const services = [...data.services];
                    services[index] = { ...service, duration: e.target.value };
                    setData({ ...data, services });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Ручные отзывы (дополнительно к автозагрузке)">
        <div className="space-y-4">
          {data.reviews.map((review, index) => (
            <div key={review.id} className="rounded-xl border border-zinc-100 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className={inputClass}
                  placeholder="Автор"
                  value={review.author}
                  onChange={(e) => {
                    const reviews = [...data.reviews];
                    reviews[index] = { ...review, author: e.target.value };
                    setData({ ...data, reviews });
                  }}
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={0.5}
                  className={inputClass}
                  placeholder="Оценка"
                  value={review.rating}
                  onChange={(e) => {
                    const reviews = [...data.reviews];
                    reviews[index] = { ...review, rating: Number(e.target.value) };
                    setData({ ...data, reviews });
                  }}
                />
                <textarea
                  className={`${inputClass} sm:col-span-2`}
                  rows={2}
                  placeholder="Текст отзыва"
                  value={review.text}
                  onChange={(e) => {
                    const reviews = [...data.reviews];
                    reviews[index] = { ...review, text: e.target.value };
                    setData({ ...data, reviews });
                  }}
                />
                <input
                  className={inputClass}
                  placeholder="Дата"
                  value={review.date}
                  onChange={(e) => {
                    const reviews = [...data.reviews];
                    reviews[index] = { ...review, date: e.target.value };
                    setData({ ...data, reviews });
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const reviews = data.reviews.filter((_, i) => i !== index);
                    setData({ ...data, reviews });
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setData({
                ...data,
                reviews: [
                  ...data.reviews,
                  {
                    id: Date.now(),
                    author: "",
                    text: "",
                    rating: 5,
                    date: "",
                  },
                ],
              })
            }
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            + Добавить отзыв
          </button>
        </div>
      </Section>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {status === "saving" ? "Сохранение..." : "Сохранить изменения"}
        </button>
        {message && (
          <span
            className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-700"}`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
