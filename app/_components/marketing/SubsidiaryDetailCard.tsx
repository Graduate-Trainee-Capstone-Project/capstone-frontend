import Link from "next/link";
import { Icon } from "@/app/_ui/Icon";

interface SubsidiaryDetailCardProps {
  accentClassName: string;
  iconBgClassName: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
  regulatoryIcon: string;
  regulatoryLabel: string;
  features: string[];
  href: string;
  ctaLabel: string;
  secondaryLabel: string;
  secondaryHref?: string;
}

/** One of the rich subsidiary cards in the "Specialized Subsidiaries" section. */
export function SubsidiaryDetailCard({
  accentClassName,
  iconBgClassName,
  icon,
  badge,
  title,
  description,
  regulatoryIcon,
  regulatoryLabel,
  features,
  href,
  ctaLabel,
  secondaryLabel,
  secondaryHref,
}: SubsidiaryDetailCardProps) {
  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className={`h-2 w-full ${accentClassName}`} />
      <div className="flex flex-col items-start gap-6 p-8">
        <div className="flex w-full items-center justify-between">
          <span className={`flex size-14 items-center justify-center rounded-2xl ${iconBgClassName}`}>
            <Icon icon={icon} className="size-6 text-primary-900" />
          </span>
          <span className="rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-900">
            {badge}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold tracking-tight text-primary-900">{title}</h3>
          <p className="text-sm leading-relaxed text-grey-600">{description}</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-primary-90 px-3 py-1.5">
          <Icon icon={regulatoryIcon} className="size-4 shrink-0 text-grey-600" />
          <span className="text-[11px] font-semibold tracking-wide text-grey-600">{regulatoryLabel}</span>
        </div>

        <ul className="flex w-full flex-col gap-3 pt-1">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-xs text-primary-900">
              <Icon icon="lucide:check-circle" className="size-4.5 shrink-0 text-primary-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col items-center gap-2 px-8 pb-8">
        <Link
          href={href}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-300"
        >
          {ctaLabel}
          <Icon icon="lucide:arrow-right" className="size-4.5" />
        </Link>
        <Link
          href={secondaryHref ?? href}
          className="flex items-center gap-1 pt-1 text-[11px] font-semibold tracking-wide text-primary-500 hover:underline"
        >
          {secondaryLabel}
          <Icon icon="lucide:arrow-up-right" className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
