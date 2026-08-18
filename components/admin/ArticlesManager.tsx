"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";

type ArticlesManagerProps = {
  initialArticles: Article[];
};

export function ArticlesManager({ initialArticles }: ArticlesManagerProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  async function create() {
    if (!title.trim()) {
      setMessage("Заголовок обязателен");
      setStatus("error");
      return;
    }

    setStatus("uploading");
    setMessage("");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, date }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Ошибка создания");
      }
      const article = (await res.json()) as Article;
      setArticles((prev) => [article, ...prev]);
      setTitle("");
      setContent("");
      setDate("");
      setStatus("idle");
      setMessage("Статья создана и опубликована на странице «Статьи»");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Ошибка создания");
    }
  }

  async function saveArticle(id: string) {
    setSavingId(id);
    try {
      const res = await fetch("/api/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editTitle, content: editContent, date: editDate }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? "Ошибка сохранения");
      }
      const updated = (await res.json()) as Article;
      setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
      setEditTitle("");
      setEditContent("");
      setEditDate("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось сохранить статью");
      setStatus("error");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Удалить статью?")) return;
    const res = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      setMessage(err.error ?? "Не удалось удалить статью");
      setStatus("error");
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) setEditingId(null);
    setMessage("");
    setStatus("idle");
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setEditTitle(article.title);
    setEditContent(article.content);
    setEditDate(article.date ? article.date.slice(0, 10) : "");
  }

  const inputClass =
    "w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">Новая статья</h2>
        <p className="mb-4 text-sm text-zinc-500">
          Статья сразу публикуется на странице «Статьи». Позже её можно изменить или удалить.
        </p>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Заголовок</span>
            <input
              className={inputClass}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Как укрепить иммунитет"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Содержание</span>
            <textarea
              className={inputClass}
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Текст статьи"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-zinc-600">Дата</span>
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={create}
            disabled={status === "uploading"}
            className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {status === "uploading" ? "Сохранение..." : "Опубликовать"}
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
          Опубликованные статьи ({articles.length})
        </h2>
        {articles.length === 0 ? (
          <p className="text-sm text-zinc-500">Статьи ещё не опубликованы.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <div key={article.id} className="rounded-xl border border-zinc-100 p-4">
                {editingId === article.id ? (
                  <div className="space-y-2">
                    <input
                      className={inputClass}
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Заголовок"
                    />
                    <textarea
                      className={inputClass}
                      rows={5}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Содержание"
                    />
                    <input
                      type="date"
                      className={inputClass}
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveArticle(article.id)}
                        disabled={savingId === article.id}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800 disabled:opacity-60"
                      >
                        {savingId === article.id ? "Сохранение..." : "Сохранить"}
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
                  <div className="flex h-full flex-col">
                    <h3 className="text-sm font-semibold text-zinc-900">{article.title}</h3>
                    {article.date && (
                      <p className="mt-1 text-xs text-zinc-400">
                        {new Date(article.date).toLocaleDateString("ru-RU")}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm text-zinc-600">
                      {article.content || <span className="text-zinc-400">Без содержания</span>}
                    </p>
                    <div className="mt-3 flex gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(article)}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(article.id)}
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