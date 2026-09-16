interface TickerItem {
  symbol: string;
  value: string;
  change: string;
  positive: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {symbol: "NGX ASI", value: "104,256.80", change: "+0.62%", positive: true},
  {symbol: "STANBIC", value: "\u20a662.50", change: "+1.12%", positive: true},
  {symbol: "MTNN", value: "\u20a6235.00", change: "+0.85%", positive: true},
  {symbol: "FGN 10Y BOND", value: "19.45%", change: "Yield Flat", positive: false},
  {symbol: "91D T-BILLS", value: "17.15%", change: "+12bps", positive: true},
];

/** Live-market ticker ribbon shown at the very top of the Stockbroking page. */
export function MarketTicker() {
  return (
    <section className="bg-primary-900">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary-50" />
          <span className="text-[11px] font-semibold tracking-wide text-primary-50 uppercase">NGX Live Feed</span>
        </div>
        <div className="flex flex-1 flex-wrap items-center justify-end gap-6 overflow-x-auto">
          {TICKER_ITEMS.map((item) => (
            <div key={item.symbol} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-xs font-semibold text-white">{item.symbol}</span>
              <span className="text-xs text-white">{item.value}</span>
              <span className={`text-xs ${item.positive ? "text-primary-50" : "text-grey-300"}`}>{item.change}</span>
            </div>
          ))}
        </div>
        <span className="hidden text-[11px] font-semibold tracking-wide text-primary-50 sm:block">
          Market Closes: 14:30 WAT
        </span>
      </div>
    </section>
  );
}
