import Link from "next/link";
import {Icon} from "@/app/_ui/Icon";
import {ROUTES} from "@/app/_constants";

const ALLOCATION_SPLIT = [
  {label: "30% Banking", caption: "High-Yield Liquidity", className: "text-primary-500"},
  {label: "40% Pension", caption: "RSA Fund II/III", className: "text-primary-300"},
  {label: "30% Stocks", caption: "NGX Dividend Growth", className: "text-primary-900"},
];

/**
 * "Project Your Holdings Growth" wealth-planner preview — a static,
 * illustrative snapshot of the calculator rather than a live/interactive
 * simulation, matching the design's role as a marketing showcase.
 */
export function GrowthProjector() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-wide text-primary-500 uppercase">
              Unified Wealth Planner
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
              Project Your Holdings Growth
            </h2>
            <p className="text-sm text-grey-600">
              Simulate monthly allocation between Banking Yield, Pension Compounding, and Equities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:info" className="size-4 text-grey-600" />
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">
              Figures based on historic benchmark returns
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-primary-900">
                  Monthly Contribution Target
                </span>
                <span className="text-xs font-bold tracking-wide text-primary-500">₦150,000 / month</span>
              </div>
              <div className="h-2 w-full rounded-lg bg-primary-75">
                <div className="h-full w-3/5 rounded-lg bg-primary-500" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-primary-900">Investment Horizon</span>
                <span className="text-xs font-bold tracking-wide text-primary-500">10 Years</span>
              </div>
              <div className="h-2 w-full rounded-lg bg-primary-75">
                <div className="h-full w-1/2 rounded-lg bg-primary-500" />
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl bg-primary-90 px-4 pt-5 pb-4">
              <span className="text-[11px] font-semibold tracking-wide text-grey-600 uppercase">
                Automated Allocation Split
              </span>
              <div className="grid grid-cols-3 gap-2">
                {ALLOCATION_SPLIT.map((segment) => (
                  <div key={segment.label} className="flex flex-col items-center gap-1 rounded bg-white p-2 shadow-sm">
                    <span className={`text-xs font-bold ${segment.className}`}>{segment.label}</span>
                    <span className="text-center text-[10px] text-grey-600">{segment.caption}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 rounded-xl bg-primary-75 p-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-grey-600 uppercase">
                Estimated Maturity Portfolio Value
              </span>
              <span className="text-4xl font-extrabold tracking-tight text-primary-900">₦35,907,199</span>
              <p className="text-xs text-grey-600">
                Includes compounding interest, capital appreciation &amp; voluntary retirement accruals.
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-primary-50 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-grey-600">Total Client Contributions:</span>
                <span className="font-semibold text-primary-900">₦18,000,000</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-grey-600">Compound Growth Alpha:</span>
                <span className="font-semibold text-primary-500">+₦17,907,199</span>
              </div>
            </div>

            <Link
              href={ROUTES.home}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-900 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
            >
              Open Ecosystem Accounts
              <Icon icon="lucide:arrow-right" className="size-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
