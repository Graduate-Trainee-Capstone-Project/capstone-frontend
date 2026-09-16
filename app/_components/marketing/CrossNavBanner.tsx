import Link from "next/link";

interface CrossNavLink {
  label: string;
  href: string;
  emphasis?: boolean;
}

interface CrossNavBannerProps {
  title: string;
  description: string;
  links: CrossNavLink[];
}

/** Light "explore other Group solutions" footer banner shared across subsidiary pages. */
export function CrossNavBanner({title, description, links}: CrossNavBannerProps) {
  return (
    <section className="bg-primary-75">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-primary-900">{title}</h3>
          <p className="text-sm text-grey-600">{description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-900 shadow-[0_1px_1px_rgba(0,0,0,0.05)] transition-colors duration-150 ${
                link.emphasis ? "bg-primary-50 hover:bg-white" : "bg-white hover:bg-primary-90"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
