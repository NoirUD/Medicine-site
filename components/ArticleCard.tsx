"use client";

import { useState } from "react";
import type { Article } from "@/lib/types";

type ArticleCardProps = {
  article: Article;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = article.content.length > 280;

  return (
    <article className="flex flex-col rounded-2xl border border-emerald-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="p-5">
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">{article.title}</h2>
        {article.date && (
          <p className="mt-1 text-xs text-zinc-400">
            {new Date(article.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
        <div className="mt-3">
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
            {expanded ? article.content : article.content.slice(0, 280)}
            {!expanded && isLong ? "…" : ""}
          </p>
        </div>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            {expanded ? "Свернуть" : "Читать полностью"}
          </button>
        )}
      </div>
    </article>
  );
}