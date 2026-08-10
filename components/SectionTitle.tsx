type SectionTitleProps = {
  title: string;
  subtitle?: string;
  centered?: boolean;
};

export function SectionTitle({ title, subtitle, centered }: SectionTitleProps) {
  return (
    <div className={centered ? "mb-10 text-center" : "mb-8"}>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-zinc-500 ${centered ? "mx-auto max-w-xl" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
