import {Icon} from "@/app/_ui/Icon";
import {SubsidiaryDetailCard} from "@/app/_components/marketing/SubsidiaryDetailCard";
import {ROUTES} from "@/app/_constants";

const SUBSIDIARIES = [
  {
    accentClassName: "bg-primary-500",
    iconBgClassName: "bg-primary-500/10",
    icon: "lucide:landmark",
    badge: "Banking",
    title: "Stanbic IBTC Bank",
    description:
      "Everyday retail banking, high-yield savings, corporate accounts, and instant digital transfers with institutional security.",
    regulatoryIcon: "lucide:shield-check",
    regulatoryLabel: "Licensed by CBN | Insured by NDIC",
    features: [
      "Zero-minimum balance opening",
      "Instant virtual debit card provisioning",
      "Automated competitive savings interest",
    ],
    href: ROUTES.bank,
    ctaLabel: "Open Bank Account",
    secondaryLabel: "Learn more about commercial services",
  },
  {
    accentClassName: "bg-primary-300",
    iconBgClassName: "bg-primary-300/10",
    icon: "lucide:piggy-bank",
    badge: "Pension",
    title: "Stanbic IBTC Pension Managers",
    description:
      "Nigeria's premier Pension Fund Administrator safeguarding your future with industry-leading RSA returns and multi-fund options.",
    regulatoryIcon: "lucide:shield-check",
    regulatoryLabel: "PenCom Registered PFA 001",
    features: [
      "Online instant RSA PIN generation",
      "Voluntary contribution tax relief",
      "Fund I-VI multi-fund risk structures",
    ],
    href: ROUTES.pensions,
    ctaLabel: "Register for an RSA",
    secondaryLabel: "Learn more about retirement planning",
  },
  {
    accentClassName: "bg-primary-900",
    iconBgClassName: "bg-primary-900/10",
    icon: "lucide:candlestick-chart",
    badge: "Stockbroking",
    title: "Stanbic IBTC Stockbrokers",
    description:
      "The largest equities trading firm on the Nigerian Exchange (NGX) offering institutional analytics and accessible retail trading portals.",
    regulatoryIcon: "lucide:shield-check",
    regulatoryLabel: "Licensed by SEC | NGX Trading Licensee",
    features: [
      "Real-time NGX order matching & DMA",
      "Comprehensive institutional equity research",
      "Integrated dividend auto-collection",
    ],
    href: ROUTES.stockbroking,
    ctaLabel: "Start Stock Trading",
    secondaryLabel: "Learn more about capital markets",
  },
];

export function SubsidiariesSection() {
  return (
    <section id="subsidiaries" className="scroll-mt-20 bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="flex items-center gap-1.5 rounded-full bg-primary-75 px-3 py-1">
            <Icon icon="lucide:link" className="size-4 text-primary-500" />
            <span className="text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
              Integrated Divisions
            </span>
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-900 sm:text-3xl">
            Specialized Subsidiaries. One Unified Relationship.
          </h2>
          <p className="text-sm text-grey-600">
            Connect your accounts across consumer banking, statutory pension accumulation, and stock brokerage
            without fragmented identity credentials.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          {SUBSIDIARIES.map((subsidiary) => (
            <SubsidiaryDetailCard key={subsidiary.title} {...subsidiary} />
          ))}
        </div>
      </div>
    </section>
  );
}
