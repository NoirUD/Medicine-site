import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDoctor, getContacts } from "@/lib/data";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const doctor = await getDoctor();
  const contacts = await getContacts();

  return (
    <div className="flex min-h-full flex-col">
      <Header doctor={doctor} />
      <main className="flex-1">{children}</main>
      <Footer doctor={doctor} contacts={contacts} />
    </div>
  );
}
