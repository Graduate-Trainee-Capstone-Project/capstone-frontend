import Link from "next/link";
import {Icon} from "@/app/_ui";
import {TradingTerminalPreview} from "@/app/_components/stockbroking/TradingTerminalPreview";
import {ROUTES} from "@/app/_constants";

const PILLARS = [
  {label: "Execution Speed", value: "< 150ms STP"},
  {label: "CSCS Settlement", value: "T+2 Direct"},
  {label: "Advisory Reach", value: "Top-Tier Macro"},
];

/** Stockbroking hero — light gradient background with a trading-terminal visual. */
export function StockbrokingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-90 to-white">
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col items-start gap-6 lg:col-span-7">
          <span className="flex items-center gap-2 rounded-full bg-primary-75 px-3.5 py-1.5 shadow-sm">
            <Icon icon="lucide:badge-check" className="size-4 text-primary-500" />
            <span className="text-sm font-semibold tracking-wide text-primary-500 uppercase">
              SEC Licensed • Trading License Holder of the NGX
            </span>
          </span>

          <h1 className="max-w-xl text-4xl leading-tight font-extrabold tracking-tight text-primary-900 sm:text-5xl">
            Invest in Nigeria&apos;s Leading <span className="text-primary-500">Equities &amp; Fixed Income</span>{" "}
            Markets.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-grey-600 sm:text-lg">
            Gain direct, institutional-grade execution on the Nigerian Exchange (NGX), sovereign Treasury Bills,
            Commercial Papers, and FGN Bonds backed by Africa&apos;s largest banking conglomerate.
          </p>

          <div className="grid w-full grid-cols-3 gap-3 pt-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="flex flex-col gap-1 rounded-xl bg-primary-75 p-3.5 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <span className="text-[11px] font-semibold tracking-wide text-grey-600 uppercase">
                  {pillar.label}
                </span>
                <span className="text-base font-bold text-primary-900">{pillar.value}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="#onboarding-paths"
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
            >
              Explore Account Paths
              <Icon icon="lucide:arrow-right" className="size-[18px]" />
            </Link>
            <span className="flex items-center gap-2 rounded-xl bg-primary-75 px-6 py-3.5 text-sm font-semibold text-primary-900">
              <Icon icon="lucide:file-text" className="size-[18px]" />
              2025 Market Outlook
            </span>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="w-full max-w-md">
            <TradingTerminalPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
