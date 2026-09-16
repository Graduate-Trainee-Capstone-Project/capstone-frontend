import {Icon} from "@/app/_ui/Icon";

const ALLOCATION = [
  {label: "Banking 48%", color: "bg-primary-500", width: "48%"},
  {label: "Pension 32%", color: "bg-primary-300", width: "32%"},
  {label: "Stocks 20%", color: "bg-primary-900", width: "20%"},
];

const QUICK_ACTIONS = [
  {label: "Transfer", icon: "lucide:arrow-left-right"},
  {label: "AVC Top-Up", icon: "lucide:circle-plus"},
  {label: "NGX Trade", icon: "lucide:candlestick-chart"},
];

/**
 * The floating "Consolidated Wealth" preview card shown beside the hero copy —
 * illustrative product chrome, not a live data widget.
 */
export function WealthPreviewCard() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-300/10">
            <Icon icon="lucide:wallet" className="size-5 text-primary-500" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold text-primary-900">Consolidated Wealth</span>
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">
              Holdings Client ID: •••• 8841
            </span>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary-75 px-2.5 py-1">
          <Icon icon="lucide:badge-check" className="size-3.5 text-primary-500" />
          <span className="text-[11px] text-primary-500">Tier 3 Verified</span>
        </span>
      </div>

      <div className="flex w-full flex-col gap-3 rounded-xl bg-primary-90 p-4">
        <div className="flex w-full items-baseline justify-between gap-4">
          <span className="text-[11px] font-semibold tracking-wide text-grey-600">Aggregate Balance</span>
          <span className="text-2xl font-bold tracking-tight text-primary-900">₦28,490,200.00</span>
        </div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-primary-50">
          {ALLOCATION.map((segment) => (
            <div key={segment.label} className={`h-full ${segment.color}`} style={{width: segment.width}} />
          ))}
        </div>
        <div className="flex w-full flex-wrap justify-center gap-2 pt-1">
          {ALLOCATION.map((segment) => (
            <div key={segment.label} className="flex items-center gap-1.5">
              <span className={`size-2 shrink-0 rounded-full ${segment.color}`} />
              <span className="text-[11px] font-semibold text-grey-600">{segment.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-start justify-center gap-2.5">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-primary-90 p-3 cursor-pointer transition-colors duration-150 hover:bg-primary-75"
          >
            <Icon icon={action.icon} className="size-[22px] text-primary-900" />
            <span className="text-center text-[11px] font-semibold text-primary-900">{action.label}</span>
          </button>
        ))}
      </div>

      <div className="flex w-full items-center gap-3 rounded-xl bg-primary-75 p-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-500/10">
          <Icon icon="lucide:shield-user" className="size-5 text-primary-500" />
        </span>
        <div className="flex flex-1 flex-col">
          <span className="text-xs font-semibold tracking-wide text-primary-900">
            Institutional Security Standard
          </span>
          <span className="text-xs text-grey-600">Biometric multi-factor authentication active</span>
        </div>
        <Icon icon="lucide:chevron-right" className="size-5 shrink-0 text-grey-600" />
      </div>
    </div>
  );
}
