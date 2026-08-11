import { getDoctor, getServices, getContacts } from "@/lib/data";
import { SectionTitle } from "@/components/SectionTitle";
import { BookingModal } from "@/components/BookingModal";
import { BookingForm } from "@/components/BookingForm";

export async function generateMetadata() {
  const doctor = await getDoctor();
  return {
    title: "Услуги",
    description: `Услуги ${doctor.name} — консультации, составление меню и сопровождение`,
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ru-RU").format(price);
}

export default async function ServicesPage() {
  const [services, contacts] = await Promise.all([getServices(), getContacts()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <SectionTitle
        title="Услуги"
        subtitle="Выберите подходящий формат консультации и запишитесь онлайн"
        centered
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <article
            key={service.id}
            className="flex flex-col rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-zinc-900">{service.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-500">
              {service.description}
            </p>

            <div className="mt-4 flex items-end justify-between border-t border-zinc-100 pt-4">
              <div>
                <p className="text-2xl font-bold text-emerald-700">
                  {formatPrice(service.price)} ₽
                </p>
                {service.duration !== "—" && (
                  <p className="text-xs text-zinc-400">{service.duration}</p>
                )}
              </div>
              <BookingModal
                serviceName={service.name}
                serviceId={service.id}
                contactEmail={contacts.email}
              />
            </div>
          </article>
        ))}
      </div>

      <section className="mt-16 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 sm:p-10">
        <SectionTitle
          title="Записаться на консультацию"
          subtitle="Заполните форму — я свяжусь с вами для подтверждения записи"
          centered
        />
        <div className="mx-auto max-w-lg">
          <BookingForm contactEmail={contacts.email} />
        </div>
      </section>
    </div>
  );
}
