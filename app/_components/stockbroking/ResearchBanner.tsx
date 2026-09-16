import {Icon} from "@/app/_ui";
import {ROUTES} from "@/app/_constants";

const RESEARCH_BULLETS = ["Daily Morning Note", "Sector Deep Dives (Banking, Telecoms)", "Fixed Income Yield Curves"];

const REPORTS = [
  {
    tag: "Latest Release",
    title: "Nigeria Strategy & Macro Outlook 2025",
    description:
      "Comprehensive evaluation of foreign exchange liquidity, central bank MPR decisions, and sovereign yield trajectory.",
    meta: "PDF • 48 Pages",
  },
  {
    tag: "Equities Insight",
    title: "Tier-1 Banking Recapitalization Playbook",
    description: "Comparative analysis of rights issues, public offers, and prospective dividend yields on the NGX.",
    meta: "PDF • 24 Pages",
  },
];

/** "Informed Execution Powered by Award-Winning Research" dark banner. */
export function ResearchBanner() {
  return (
    <section className="bg-grey-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-8 shadow-xl sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-96 rounded-full bg-primary-500/30 blur-[32px]" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="col-span-1 flex flex-col items-start gap-5 lg:col-span-7">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-50 uppercase">
                Top-Ranked Macro Analysis
              </span>
              <h2 className="text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
                Informed Execution Powered by Award-Winning Research.
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-primary-50/80">
                Every Stanbic IBTC Stockbroking account includes direct daily access to institutional equity
                valuations, interest rate forecasts, and inflation-hedged asset allocations compiled by Stanbic IBTC
                Research.
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                {RESEARCH_BULLETS.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-2">
                    <Icon icon="lucide:check-circle-2" className="size-5 text-primary-50" />
                    <span className="text-sm font-semibold text-white">{bullet}</span>
                  </div>
                ))}
              </div>

              <a
                href={ROUTES.apply("STOCKBROKING")}
                className="flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
              >
                Open Trading Account &amp; Access Research
                <Icon icon="lucide:arrow-right" className="size-[18px]" />
              </a>
            </div>

            <div className="col-span-1 flex flex-col gap-4 lg:col-span-5">
              {REPORTS.map((report) => (
                <div key={report.title} className="flex flex-col gap-3 rounded-2xl bg-white/5 p-5 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-wide text-primary-50/80 uppercase">
                      {report.tag}
                    </span>
                    <Icon icon="lucide:file-text" className="size-[18px] text-primary-50/80" />
                  </div>
                  <h3 className="text-base font-bold text-white">{report.title}</h3>
                  <p className="text-xs leading-relaxed text-primary-50/80">{report.description}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs text-primary-50/80">{report.meta}</span>
                    <span className="text-xs font-semibold text-primary-50">Client Exclusive</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
