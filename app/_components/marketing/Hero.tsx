import Link from "next/link";
import type { ReactNode } from "react";

interface HeroCta {
  label: string;
  href: string;
}

interface HeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  tone?: "dark" | "light";
  children?: ReactNode;
}

export function Hero({ eyebrow, title, description, primaryCta, secondaryCta, tone = "dark", children }: HeroProps) {
  const isDark = tone === "dark";

  return (
    <section className={isDark ? "bg-primary-700" : "bg-white"}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-14 sm:px-6 sm:py-20">
        {eyebrow && (
          <span
            className={
              isDark
                ? "w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-100"
                : "w-fit rounded-full bg-primary-100/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-400"
            }
          >
            {eyebrow}
          </span>
        )}
        <h1
          className={
            isDark
              ? "max-w-2xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
              : "max-w-2xl text-3xl font-bold text-grey-900 sm:text-4xl lg:text-5xl"
          }
        >
          {title}
        </h1>
        <p className={isDark ? "max-w-xl text-base text-primary-100/90 sm:text-lg" : "max-w-xl text-base text-grey-600 sm:text-lg"}>
          {description}
        </p>
        {(primaryCta || secondaryCta) && (
          <div className="mt-2 flex flex-wrap gap-3">
            {primaryCta && (
              <Link
                href={primaryCta.href}
                className="rounded-lg bg-primary-100 px-5 py-3 text-sm font-semibold text-primary-700 transition-colors duration-150 hover:bg-white"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={
                  isDark
                    ? "rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10"
                    : "rounded-lg border border-grey-300 px-5 py-3 text-sm font-semibold text-grey-800 transition-colors duration-150 hover:bg-grey-50"
                }
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
