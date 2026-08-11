import { getContacts } from "@/lib/data";

export async function ContactSection() {
  const contacts = await getContacts();

  return (
    <section id="contacts" className="scroll-mt-24">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ContactCard
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          }
          label="Телефон"
          value={contacts.phone}
          href={`tel:${contacts.phone.replace(/\s/g, "")}`}
        />
        <ContactCard
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          label="Email"
          value={contacts.email}
          href={`mailto:${contacts.email}`}
        />
        <ContactCard
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          label="Адрес"
          value={contacts.address}
        />
        <ContactCard
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          label="Часы работы"
          value={contacts.workHours}
        />
      </div>
    </section>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        {icon}
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800">{value}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="rounded-2xl border border-emerald-100 bg-white p-5 transition-shadow hover:shadow-md"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
      {content}
    </div>
  );
}
