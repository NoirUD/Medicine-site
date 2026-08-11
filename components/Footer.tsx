import Link from "next/link";
import { navLinks } from "@/lib/constants";
import { SocialLinks } from "./SocialLinks";
import type { SiteData } from "@/lib/types";

type FooterProps = {
  doctor: SiteData["doctor"];
  contacts: SiteData["contacts"];
};

export function Footer({ doctor, contacts }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-emerald-100 bg-emerald-950 text-emerald-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-semibold text-white">{doctor.name}</p>
          <p className="mt-1 text-sm text-emerald-200">{doctor.title}</p>
          <div className="mt-4">
            <SocialLinks variant="footer" />
          </div>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Навигация</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-emerald-200 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">Контакты</p>
          <ul className="space-y-2 text-sm text-emerald-200">
            <li>
              <a href={`tel:${contacts.phone.replace(/\s/g, "")}`}>{contacts.phone}</a>
            </li>
            <li>
              <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
            </li>
            <li>{contacts.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-800 py-4 text-center text-xs text-emerald-400">
        © {new Date().getFullYear()} {doctor.name}. Все права защищены.
      </div>
    </footer>
  );
}
