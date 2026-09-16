import {Icon} from "@/app/_ui";

const ASSET_CLASSES = ["Equities / ETFs", "FGN Bonds (10Y/20Y)", "Treasury Bills", "Commercial Papers"];

/** "Stanbic E-Trading" terminal preview card shown beside the Stockbroking hero copy. */
export function TradingTerminalPreview() {
  return (
    <div className="relative flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl">
      <span className="absolute -top-3 -right-3 flex items-center gap-1.5 rounded-full bg-primary-500 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-white shadow-lg">
        <Icon icon="lucide:zap" className="size-3.5" />
        Direct NGX Access
      </span>

      <div className="flex items-center justify-between gap-4 border-b border-primary-90 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-900">
            <Icon icon="lucide:candlestick-chart" className="size-5 text-white" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold text-primary-900">Stanbic E-Trading</span>
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">NGX FIX Protocol v4.4 Active</span>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-500">
          T+2 Settlement
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-grey-600">NGX All-Share Index (YTD Yield)</span>
          <span className="text-base font-bold text-primary-900">+31.84%</span>
        </div>
        <div className="flex h-28 w-full items-end gap-1 rounded-xl bg-primary-90 p-3">
          {[30, 45, 40, 55, 48, 65, 58, 78, 70, 92, 82, 100].map((height, index) => (
            <span key={index} className="flex-1 rounded-full bg-primary-500" style={{height: `${height}%`}} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold tracking-wide text-grey-600 uppercase">Tradable Asset Spectrum</span>
        <div className="grid grid-cols-2 gap-2">
          {ASSET_CLASSES.map((asset) => (
            <span
              key={asset}
              className="flex items-center gap-2 rounded-lg bg-primary-90 px-3 py-2.5 text-xs font-semibold text-primary-900"
            >
              <Icon icon="lucide:check" className="size-3.5 shrink-0 text-primary-500" />
              {asset}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-primary-75 p-3">
        <Icon icon="lucide:shield-check" className="size-6 shrink-0 text-primary-500" />
        <span className="text-xs font-medium text-primary-900">
          Direct CSCS clearing with automatic e-dividend mandate linkage to any verified commercial bank.
        </span>
      </div>
    </div>
  );
}
