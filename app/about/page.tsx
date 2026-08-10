import { doctor, education, documents, workPlaces, professionalAchievements, personalAchievements } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";

export const metadata = {
  title: "Обо мне",
  description: `Профессиональный путь ${doctor.name} — образование, опыт работы и достижения`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Header */}
      <div className="mb-12 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-emerald-100 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={doctor.photo} alt={doctor.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">{doctor.name}</h1>
          <p className="mt-1 text-lg text-emerald-700">{doctor.title}</p>
          <p className="mt-3 max-w-2xl text-zinc-600">{doctor.fullBio}</p>
        </div>
      </div>

      {/* Profession */}
      <section className="mb-14">
        <SectionTitle title="Профессия" />
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
          <p className="text-lg font-semibold text-zinc-900">{doctor.title}</p>
          <p className="mt-2 text-zinc-600">
            Специализируюсь на клинической диетологии, нутрициологии и коррекции пищевого
            поведения. Работаю с пациентами всех возрастов.
          </p>
          <p className="mt-3 text-sm font-medium text-emerald-700">
            Общий стаж: {doctor.experienceYears} лет
          </p>
        </div>
      </section>

      {/* Education */}
      <section className="mb-14">
        <SectionTitle title="Образование" />
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.institution}
              className="flex flex-col gap-1 rounded-2xl border border-emerald-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-zinc-900">{item.institution}</p>
                <p className="text-sm text-zinc-500">{item.degree}</p>
              </div>
              <span className="text-sm font-medium text-emerald-700">{item.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="mb-14">
        <SectionTitle title="Дипломы и документы" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc.title}
              className="flex items-start gap-4 rounded-2xl border border-emerald-100 bg-white p-5"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zinc-900">{doc.title}</p>
                <p className="mt-1 text-sm text-zinc-500">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work places */}
      <section className="mb-14">
        <SectionTitle title="Места работы" subtitle="Профессиональный путь" />
        <div className="relative space-y-0">
          {workPlaces.map((work, index) => (
            <div key={work.place} className="relative flex gap-6 pb-8 last:pb-0">
              {index < workPlaces.length - 1 && (
                <div className="absolute left-[19px] top-10 h-full w-0.5 bg-emerald-200" />
              )}
              <div className="relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div className="flex-1 rounded-2xl border border-emerald-100 bg-white p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-semibold text-zinc-900">{work.place}</p>
                  <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {work.years}
                  </span>
                </div>
                <p className="mt-1 text-sm text-emerald-700">{work.role}</p>
                <p className="mt-1 text-xs text-zinc-400">{work.period}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <SectionTitle title="Профессиональные достижения" />
          <ul className="space-y-3">
            {professionalAchievements.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4"
              >
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-zinc-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle title="Личные достижения" />
          <ul className="space-y-3">
            {personalAchievements.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-white p-4"
              >
                <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-zinc-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
