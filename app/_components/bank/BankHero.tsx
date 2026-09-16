import Link from "next/link";
import {Icon} from "@/app/_ui";
import {DebitCardPreview} from "@/app/_components/bank/DebitCardPreview";
import {ROUTES} from "@/app/_constants";

const TRUST_BULLETS = [
  {icon: "lucide:arrow-left-right", label: "Zero transfer fees on select tiers"},
  {icon: "lucide:shield-check", label: "NDIC Insured to statutory maximum"},
  {icon: "lucide:fingerprint", label: "Instant BVN verification"},
];

/** Bank page hero — light gradient background with a synthetic debit-card visual. */
export function BankHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-90 to-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-500/5 blur-[32px]" />
        <div className="absolute top-48 -left-20 size-80 rounded-full bg-primary-300/5 blur-[20px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <span className="flex items-center gap-2 rounded-full bg-primary-75 px-3.5 py-1.5 shadow-sm">
            <Icon icon="lucide:landmark" className="size-4 text-primary-500" />
            <span className="text-sm font-semibold tracking-wide text-primary-500">
              Next-Generation Retail &amp; Corporate Banking
            </span>
          </span>

          <h1 className="max-w-xl text-4xl leading-tight font-bold tracking-tight text-primary-900 sm:text-5xl">
            Smart, Secure Banking <span className="text-primary-500">Tailored for Your Life.</span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-grey-600 sm:text-lg">
            Experience frictionless day-to-day transactions, instant virtual debit cards, zero hidden account
            maintenance fees, and round-the-clock digital treasury access backed by Africa&apos;s foremost
            financial group.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={ROUTES.apply("SAVINGS")}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
            >
              Open An Account
              <Icon icon="lucide:arrow-right" className="size-[18px]" />
            </Link>
            <a
              href="#compare-accounts"
              className="flex items-center gap-2 rounded-xl bg-primary-75 px-6 py-3.5 text-sm font-semibold text-primary-900 transition-colors duration-150 hover:bg-primary-90"
            >
              <Icon icon="lucide:scale" className="size-[18px]" />
              Compare Accounts
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            {TRUST_BULLETS.map((bullet) => (
              <div key={bullet.label} className="flex items-center gap-2">
                <Icon icon={bullet.icon} className="size-[18px] text-primary-500" />
                <span className="text-[11px] font-semibold tracking-wide text-grey-600">{bullet.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="w-full max-w-md">
            <DebitCardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
