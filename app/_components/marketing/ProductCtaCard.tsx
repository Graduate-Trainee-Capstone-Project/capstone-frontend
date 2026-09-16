import Link from "next/link";

interface ProductCtaCardProps {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  ctaLabel?: string;
}

export function ProductCtaCard({title, description, bullets, href, ctaLabel = "Open account"}: ProductCtaCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white p-6">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-grey-900">{title}</h3>
        <p className="text-sm text-grey-600">{description}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-grey-700">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-400" />
            {bullet}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary-400 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
      >
        {ctaLabel} &rarr;
      </Link>
    </div>
  );
}
