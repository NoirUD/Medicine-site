"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import type { SiteData } from "@/lib/types";

type HeaderProps = {
  doctor: SiteData["doctor"];
};

export function Header({ doctor }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            {doctor.name
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-zinc-900 group-hover:text-emerald-700">
              {doctor.name}
            </p>
            <p className="text-xs text-zinc-500">{doctor.title}</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-600 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
