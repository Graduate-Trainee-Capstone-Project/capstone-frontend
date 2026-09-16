import Link from "next/link";
import {Icon} from "@/app/_ui";

interface AlreadyCustomerCtaProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: {label: string; href: string; icon?: string};
  secondaryCta?: {label: string; icon?: string};
}

/** Dark gradient "already a customer?" cross-sell banner used across subsidiary pages. */
export function AlreadyCustomerCta({eyebrow, title, description, primaryCta, secondaryCta}: AlreadyCustomerCtaProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900 via-primary-700 to-primary-500 p-8 shadow-xl sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-80 rounded-full bg-primary-300/30 blur-[32px]" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="flex max-w-xl flex-col items-start gap-3">
              <span className="flex items-center gap-2 rounded-full bg-primary-75/20 px-3 py-1 backdrop-blur-sm">
                <Icon icon="lucide:zap" className="size-4 text-primary-50" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-50">{eyebrow}</span>
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
              <p className="text-base leading-relaxed text-primary-50/80">{description}</p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-4">
              <Link
                href={primaryCta.href}
                className="flex items-center gap-2 rounded-xl bg-primary-90 px-8 py-4 text-sm font-semibold text-primary-900 shadow-lg transition-colors duration-150 hover:bg-white"
              >
                {primaryCta.icon && <Icon icon={primaryCta.icon} className="size-5" />}
                {primaryCta.label}
              </Link>
              {secondaryCta && (
                <span className="flex items-center gap-2 rounded-xl bg-black/25 px-6 py-4 text-sm font-semibold text-white">
                  {secondaryCta.icon && <Icon icon={secondaryCta.icon} className="size-[18px]" />}
                  {secondaryCta.label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
