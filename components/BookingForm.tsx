"use client";

import { useState } from "react";
import { contacts } from "@/lib/data";

type BookingFormProps = {
  serviceName?: string;
  serviceId?: string;
};

export function BookingForm({ serviceName, serviceId }: BookingFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    message: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Запись на консультацию${serviceName ? `: ${serviceName}` : ""}`,
    );
    const body = encodeURIComponent(
      [
        `Имя: ${form.name}`,
        `Телефон: ${form.phone}`,
        `Email: ${form.email}`,
        `Желаемая дата: ${form.date || "не указана"}`,
        serviceName ? `Услуга: ${serviceName}` : "",
        serviceId ? `ID услуги: ${serviceId}` : "",
        form.message ? `\nКомментарий:\n${form.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );

    window.location.href = `mailto:${contacts.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Заявка отправлена</h3>
        <p className="mt-2 text-sm text-zinc-600">
          Почтовый клиент открыт — отправьте письмо, и я свяжусь с вами в ближайшее время.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-emerald-700 hover:text-emerald-800"
        >
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serviceName && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm">
          <span className="text-zinc-500">Услуга: </span>
          <span className="font-medium text-emerald-800">{serviceName}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ваше имя" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            placeholder="Иван Иванов"
          />
        </Field>
        <Field label="Телефон" required>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
            placeholder="+7 (999) 000-00-00"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            placeholder="email@example.com"
          />
        </Field>
        <Field label="Желаемая дата">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Комментарий">
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={inputClass}
          placeholder="Расскажите о вашем запросе..."
        />
      </Field>

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Записаться на консультацию
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";
