import type {ProductCode} from "@/app/_types";

export type SubsidiarySlug = "bank" | "pension" | "stockbroking" | "investment";

export interface Subsidiary {
  slug: SubsidiarySlug;
  name: string;
  legalName: string;
  badge: string;
  description: string;
  icon: string;
  accentClassName: string;
  iconBgClassName: string;
  regulatoryLabel: string;
  features: string[];
  productCodes: ProductCode[];
  ctaLabel: string;
  secondaryLabel: string;
  /** Marketing landing, when one exists. Investment onboards directly. */
  marketingHref?: string;
}

export const SUBSIDIARIES: Subsidiary[] = [
  {
    slug: "bank",
    name: "Bank",
    legalName: "Stanbic IBTC Bank",
    badge: "Banking",
    description:
      "Everyday retail banking, high-yield savings, corporate accounts, and instant digital transfers with institutional security.",
    icon: "lucide:landmark",
    accentClassName: "bg-primary-500",
    iconBgClassName: "bg-primary-500/10",
    regulatoryLabel: "Licensed by CBN | Insured by NDIC",
    features: [
      "Zero-minimum balance opening",
      "Instant virtual debit card provisioning",
      "Automated competitive savings interest",
    ],
    productCodes: ["SAVINGS", "CURRENT"],
    ctaLabel: "View bank products",
    secondaryLabel: "Learn more about commercial services",
    marketingHref: "/bank",
  },
  {
    slug: "pension",
    name: "Pension",
    legalName: "Stanbic IBTC Pension Managers",
    badge: "Pension",
    description:
      "Nigeria's premier Pension Fund Administrator safeguarding your future with industry-leading RSA returns and multi-fund options.",
    icon: "lucide:piggy-bank",
    accentClassName: "bg-primary-300",
    iconBgClassName: "bg-primary-300/10",
    regulatoryLabel: "PenCom Registered PFA 001",
    features: [
      "Online instant RSA PIN generation",
      "Voluntary contribution tax relief",
      "Fund I–VI multi-fund risk structures",
    ],
    productCodes: ["PENSION_RSA"],
    ctaLabel: "View pension products",
    secondaryLabel: "Learn more about retirement planning",
    marketingHref: "/pensions",
  },
  {
    slug: "stockbroking",
    name: "Stockbroking",
    legalName: "Stanbic IBTC Stockbrokers",
    badge: "Stockbroking",
    description:
      "The largest equities trading firm on the Nigerian Exchange (NGX) offering institutional analytics and accessible retail trading portals.",
    icon: "lucide:candlestick-chart",
    accentClassName: "bg-primary-900",
    iconBgClassName: "bg-primary-900/10",
    regulatoryLabel: "Licensed by SEC | NGX Trading Licensee",
    features: [
      "Real-time NGX order matching & DMA",
      "Comprehensive institutional equity research",
      "Integrated dividend auto-collection",
    ],
    productCodes: ["STOCKBROKING"],
    ctaLabel: "View stockbroking products",
    secondaryLabel: "Learn more about capital markets",
    marketingHref: "/stockbroking",
  },
  {
    slug: "investment",
    name: "Investment",
    legalName: "Stanbic IBTC Asset Management",
    badge: "Investment",
    description:
      "Professionally managed funds and investment accounts designed to grow wealth across money-market, fixed-income, and equity strategies.",
    icon: "lucide:trending-up",
    accentClassName: "bg-primary-400",
    iconBgClassName: "bg-primary-400/10",
    regulatoryLabel: "Licensed by SEC | Fund Manager",
    features: [
      "Diversified fund options for every risk profile",
      "Professional portfolio construction",
      "Flexible contributions from day one",
    ],
    productCodes: ["INSURANCE"],
    ctaLabel: "View investment products",
    secondaryLabel: "Start an investment account",
  },
];

export const SUBSIDIARY_BY_SLUG: Record<SubsidiarySlug, Subsidiary> = SUBSIDIARIES.reduce(
  (acc, subsidiary) => {
    acc[subsidiary.slug] = subsidiary;
    return acc;
  },
  {} as Record<SubsidiarySlug, Subsidiary>,
);

export function productCodeToSubsidiary(productCode: ProductCode): Subsidiary {
  return SUBSIDIARIES.find((subsidiary) => subsidiary.productCodes.includes(productCode)) ?? SUBSIDIARIES[0];
}

export function isProductCode(value: string): value is ProductCode {
  return ["SAVINGS", "CURRENT", "PENSION_RSA", "STOCKBROKING", "INSURANCE"].includes(value);
}
