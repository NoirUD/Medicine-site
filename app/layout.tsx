import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getDoctor } from "@/lib/data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const doctor = await getDoctor();
  return {
    title: {
      default: `${doctor.name} — ${doctor.title}`,
      template: `%s | ${doctor.name}`,
    },
    description: doctor.shortBio,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900">{children}</body>
    </html>
  );
}
