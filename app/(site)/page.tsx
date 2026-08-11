import Link from "next/link";
import { getDoctor } from "@/lib/data";
import { SocialLinks } from "@/components/SocialLinks";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ContactSection } from "@/components/ContactSection";
import { SectionTitle } from "@/components/SectionTitle";

export default async function HomePage() {
  const doctor = await getDoctor();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 sm:px-6 lg:flex-row lg:py-28">
          <div className="flex-shrink-0">
            <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-white/30 shadow-2xl sm:h-56 sm:w-56">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={doctor.photo}
                alt={doctor.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1 text-center lg:text-left">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-200">
              {doctor.title}
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {doctor.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-emerald-100">
              {doctor.shortBio}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/services"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                Записаться на консультацию
              </Link>
              <Link
                href="/about"
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Подробнее обо мне
              </Link>
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <SocialLinks />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          title="О специалисте"
          subtitle="Индивидуальный подход к каждому пациенту"
          centered
        />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-zinc-600">{doctor.fullBio}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            <Stat value={`${doctor.experienceYears}+`} label="лет опыта" />
            <Stat value="500+" label="довольных клиентов" />
            <Stat value="4.9" label="средняя оценка" />
          </div>
        </div>
      </section>

      <ReviewsSection />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          title="Контакты"
          subtitle="Свяжитесь со мной удобным способом"
          centered
        />
        <ContactSection />
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-emerald-700">{value}</p>
      <p className="mt-1 text-sm text-zinc-500">{label}</p>
    </div>
  );
}
