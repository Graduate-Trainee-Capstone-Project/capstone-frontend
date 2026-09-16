interface Fund {
  code: string;
  title: string;
  tag: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  badge?: string;
  dark?: boolean;
}

const FUNDS: Fund[] = [
  {
    code: "F1",
    title: "Fund I (Growth)",
    tag: "Active Request • Age below 50",
    description: "Highest equity exposure for young professionals seeking maximal capital growth over a 15+ year investment horizon.",
    metricLabel: "Max Equity Cap",
    metricValue: "Up to 30%",
  },
  {
    code: "F2",
    title: "Fund II (Balanced)",
    tag: "Core Growth • Balanced Profile",
    description: "Balanced allocation optimizing stable fixed income yields with calculated blue-chip NGX equity exposure.",
    metricLabel: "Max Equity Cap",
    metricValue: "Up to 25%",
    badge: "Default (18-49)",
  },
  {
    code: "F3",
    title: "Fund III (Pre-Retiree)",
    tag: "Ages 50 and Above",
    description: "Conservative stance prioritizing principal security with predominant placement in FGN sovereign bonds and high-grade bills.",
    metricLabel: "Max Equity Cap",
    metricValue: "Up to 10%",
  },
  {
    code: "F4",
    title: "Fund IV (Retirees)",
    tag: "Retired Members Only",
    description: "Exclusively for retirees receiving monthly programmed withdrawals. 0% equity volatility to safeguard consistent liquidity.",
    metricLabel: "Equity Allowance",
    metricValue: "0% (Pure Debt)",
  },
];

/** "Invested Intelligently Across Your Lifetime" multi-fund explorer grid. */
export function MultiFundExplorer() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex max-w-2xl flex-col gap-2">
          <span className="text-xs font-semibold tracking-wide text-primary-500 uppercase">
            PenCom Multi-Fund Framework
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
            Invested Intelligently Across Your Lifetime
          </h2>
          <p className="text-sm text-grey-600">
            Your retirement savings adapt dynamically based on your age and risk appetite, moving from aggressive
            equity growth to capital preservation as you near retirement.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FUNDS.map((fund) => (
            <div key={fund.code} className="relative flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              {fund.badge && (
                <span className="absolute top-4 right-4 rounded-full bg-primary-75 px-2 py-0.5 text-[11px] font-semibold text-primary-900">
                  {fund.badge}
                </span>
              )}
              <div className="flex flex-col gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary-75 text-sm font-bold text-primary-500">
                  {fund.code}
                </span>
                <h3 className="pt-1 text-base font-semibold text-primary-900">{fund.title}</h3>
                <span className="text-[11px] font-semibold tracking-wide text-primary-500">{fund.tag}</span>
                <p className="text-xs leading-relaxed text-grey-600">{fund.description}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-semibold tracking-wide text-primary-900">{fund.metricLabel}</span>
                <span className="text-[11px] font-bold tracking-wide text-primary-900">{fund.metricValue}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
