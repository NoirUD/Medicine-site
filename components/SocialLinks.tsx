import { getSocialLinks } from "@/lib/data";

const icons: Record<string, React.ReactNode> = {
  max: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <defs>
        <linearGradient id="max-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#471AFF" />
          <stop offset="50%" stopColor="#9500FF" />
          <stop offset="100%" stopColor="#00BFFF" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#max-gradient)" />
      <path
        fill="#fff"
        d="M6.5 16.5V7.5h2.1l2.4 4.8 2.4-4.8h2.1v9h-1.9v-5.6l-2.1 4.1h-1.2l-2.1-4.1v5.6H6.5zm10.2-6.3c0-1.8 1.2-2.9 3-2.9 1.9 0 3 1.1 3 2.9v3.6c0 1.8-1.1 2.9-3 2.9-1.8 0-3-1.1-3-2.9v-3.6zm1.9 3.5c0 .9.4 1.4 1.1 1.4.7 0 1.1-.5 1.1-1.4v-3.5c0-.9-.4-1.4-1.1-1.4-.7 0-1.1.5-1.1 1.4v3.5z"
      />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
    </svg>
  ),
  vk: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.08 14.27h-1.46c-.55 0-.72-.44-1.71-1.43-.86-.84-1.24-.95-1.46-.95-.3 0-.38.09-.38.52v1.31c0 .37-.12.59-1.09.59-1.6 0-3.38-.97-4.63-2.77-1.89-2.64-2.41-4.63-2.41-4.75 0-.21.09-.4.52-.4h1.46c.39 0 .53.18.68.6.74 2.15 1.98 4.03 2.49 4.03.19 0 .27-.09.27-.58V9.38c-.06-.97-.57-1.05-.57-1.42 0-.18.15-.36.39-.36h2.3c.33 0 .45.18.45.57v3.06c0 .33.15.45.24.45.19 0 .35-.12.69-.46 1.07-1.2 1.83-3.05 1.83-3.05.1-.21.27-.4.66-.4h1.46c.44 0 .53.23.44.57-.16.75-1.72 3.03-1.72 3.03-.14.23-.19.33 0 .59.14.19.61.59.92.95.57.67 1.01 1.23 1.13 1.62.12.39-.07.59-.46.59z" />
    </svg>
  ),
};

type SocialLinksProps = {
  variant?: "default" | "footer";
};

export async function SocialLinks({ variant = "default" }: SocialLinksProps) {
  const socialLinks = await getSocialLinks();
  const linkClass =
    variant === "footer"
      ? "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-800 text-emerald-100 transition-colors hover:bg-emerald-700 hover:text-white"
      : "flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-600 hover:text-white";

  return (
    <div className="flex flex-wrap gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.name}
          className={`${linkClass} ${link.icon === "max" && variant === "footer" ? "!bg-transparent" : ""}`}
        >
          {icons[link.icon] ?? (
            <span className="text-xs font-bold">{link.name.slice(0, 1)}</span>
          )}
        </a>
      ))}
    </div>
  );
}
