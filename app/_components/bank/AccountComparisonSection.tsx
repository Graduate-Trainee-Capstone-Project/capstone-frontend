import {Icon} from "@/app/_ui";
import {AccountCard} from "@/app/_components/bank/AccountCard";
import {ROUTES} from "@/app/_constants";

const ACCOUNTS = [
  {
    tag: "e-Savings / High Yield",
    segment: "Personal & Retail",
    title: "Stanbic IBTC Savings Account",
    description: "Optimized for maximum capital growth, effortless digital savings, and unlimited daily retail transactions.",
    stats: [
      {label: "Minimum Balance", value: "\u20a60.00"},
      {label: "Annual Yield", value: "Up to 7.5%"},
      {label: "Daily Transact Limit", value: "\u20a61,000,000"},
      {label: "Virtual Card", value: "Free Verve/Mastercard"},
    ] as [{label: string; value: string}, {label: string; value: string}, {label: string; value: string}, {label: string; value: string}],
    features: [
      "\u20a60 minimum balance to open, maintain, or close anytime.",
      "7.5% annual interest rate accrued daily and credited monthly into your ledger.",
      "Instant issuance of contactless Verve or Mastercard virtual card upon BVN validation.",
      "Zero charges on utility payments, airtime recharges, and intra-bank money transfers.",
      "Direct single-sign-on access into Stanbic IBTC Pension Managers dashboard.",
    ],
    cta: {label: "Open Savings Account", href: ROUTES.apply("SAVINGS")},
    footnote: "Ready in 3 minutes • Instant virtual card activation",
    accent: "primary" as const,
  },
  {
    tag: "Smart Individual & Corporate Current",
    segment: "High-Volume • Business",
    title: "Stanbic IBTC Current Account",
    description: "Structured for professionals, corporations, and institutions needing flexible clearing, overdrafts, and high limits.",
    stats: [
      {label: "Cheque Book", value: "Personalized Free"},
      {label: "COT Terms", value: "Negotiable"},
      {label: "Daily Transact Limit", value: "Up to \u20a610,000,000"},
      {label: "Support Tier", value: "Dedicated Manager"},
    ] as [{label: string; value: string}, {label: string; value: string}, {label: string; value: string}, {label: string; value: string}],
    features: [
      "Complimentary customized chequebook valid across all clearing houses nationwide.",
      "Elevated daily transaction thresholds up to \u20a610M (or higher upon formal request).",
      "Assigned Private Relationship Officer for customized advisory, forex, and corporate trade.",
      "Institutional Trade Finance, Invoice Discounting, and automated overdraft lines.",
      "Seamless integration with Stanbic IBTC Stockbrokers portfolio settlement accounts.",
    ],
    cta: {label: "Open Current Account", href: ROUTES.apply("CURRENT")},
    footnote: "Individual or Corporate • Assigned officer follow-up",
    accent: "dark" as const,
  },
];

/** "Tailored Accounts Designed For Your Scale" section — Savings vs. Current comparison. */
export function AccountComparisonSection() {
  return (
    <section id="compare-accounts" className="scroll-mt-20 bg-grey-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <span className="w-fit rounded-full bg-primary-75 px-3 py-1 text-xs font-semibold tracking-wide text-primary-500">
              Institutional Account Selection
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
              Tailored Accounts Designed For Your Scale
            </h2>
            <p className="pt-1 text-sm text-grey-600">
              Choose an account engineered precisely for your personal growth or enterprise treasury needs.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Icon icon="lucide:repeat" className="size-4 text-grey-600" />
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">
              Switch or upgrade accounts anytime with zero penalties
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          {ACCOUNTS.map((account) => (
            <AccountCard key={account.title} {...account} />
          ))}
        </div>
      </div>
    </section>
  );
}
