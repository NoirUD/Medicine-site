"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Неверный пароль");
        return;
      }

      window.location.href = from;
    } catch {
      setError("Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-zinc-900">Вход в админ-панель</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Введите пароль для управления контентом сайта.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700">Пароль</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Пароль администратора"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? "Вход..." : "Войти"}
        </button>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Пароль задаётся через переменную окружения ADMIN_PASSWORD
        </p>
      </form>
    </div>
  );
}
