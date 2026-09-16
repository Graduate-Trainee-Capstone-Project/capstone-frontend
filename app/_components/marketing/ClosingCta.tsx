import Link from "next/link";
import {Icon} from "@/app/_ui";

interface ClosingCtaProps {
  title: string;
  description: string;
  primaryCta: {label: string; href: string};
  secondaryCta?: {label: string; href: string};
}

/** Final centered call-to-action banner before the footer. */
export function ClosingCta({title, description, primaryCta, secondaryCta}: ClosingCtaProps) {
  return (
    <section className="bg-primary-75">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">{title}</h2>
        <p className="max-w-xl text-base text-grey-600">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href={primaryCta.href}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-primary-300"
          >
            {primaryCta.label}
            <Icon icon="lucide:arrow-right" className="size-[18px]" />
          </Link>
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-semibold text-primary-900 shadow-sm transition-colors duration-150 hover:bg-primary-90"
            >
              <Icon icon="lucide:map-pin" className="size-[18px]" />
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
