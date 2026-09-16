import Link from "next/link";
import {Icon} from "@/app/_components/ui/Icon";
import {WealthPreviewCard} from "@/app/_components/marketing/WealthPreviewCard";
import {ROUTES} from "@/app/_constants";

const TRUST_CHIPS = [
  {icon: "lucide:fingerprint", label: "Single BVN / NIN KYC Verification"},
  {icon: "lucide:layout-dashboard", label: "Instant Unified Dashboard"},
];

/**
 * The holdings homepage's hero — distinct enough from the shared `Hero`
 * (gradient heading, badge pill, trust chips, floating wealth card) that it
 * lives as its own component rather than overloading the generic one used
 * on /bank, /pensions, and /stockbroking.
 */
export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-primary-700">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
      >
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-primary-300 blur-[60px]" />
        <div className="absolute top-1/2 right-0 size-[500px] -translate-y-1/2 translate-x-1/3 rounded-full bg-primary-300 opacity-30 blur-[70px]" />
        <div className="absolute bottom-0 left-1/2 size-80 rounded-full bg-primary-900 blur-[50px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center lg:py-24">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <span className="flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
            <span className="size-2 shrink-0 rounded-full bg-primary-50" />
            <span className="text-[11px] font-semibold tracking-wide text-primary-50 uppercase">
              Unified Institutional Wealth Platform
            </span>
          </span>

          <h1 className="max-w-2xl text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.1]">
            One Holding,{" "}
            <span className="bg-gradient-to-r from-primary-50 via-primary-50/80 to-white bg-clip-text text-transparent">
              Every Financial Service.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-primary-50/80 sm:text-lg">
            Seamlessly manage your daily liquidity, secure your generational retirement, and trade on
            Nigeria&apos;s premier capital markets with the institutional reliability of Stanbic IBTC.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={ROUTES.home}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
            >
              <Icon icon="lucide:rocket" className="size-5" />
              Start Digital Onboarding
            </Link>
            <a
              href="#subsidiaries"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/20"
            >
              Explore Subsidiaries
              <Icon icon="lucide:chevron-right" className="size-[18px]" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            {TRUST_CHIPS.map((chip) => (
              <div key={chip.label} className="flex items-center gap-2">
                <Icon icon={chip.icon} className="size-5 text-primary-50/90" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-50/90">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <WealthPreviewCard />
        </div>
      </div>
    </section>
  );
}
