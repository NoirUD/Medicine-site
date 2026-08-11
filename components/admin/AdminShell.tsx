"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Обзор" },
  { href: "/admin/content", label: "Контент сайта" },
  { href: "/admin/documents", label: "Документы" },
  { href: "/admin/reviews", label: "Отзывы" },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Админ-панель
            </p>
            <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-zinc-600 hover:text-emerald-700">
              На сайт
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-3">
          <nav className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 text-sm font-medium ${
                    active
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
