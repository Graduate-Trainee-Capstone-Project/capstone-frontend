import {TopTrustBar} from "@/app/_components/marketing/TopTrustBar";
import {AlreadyCustomerCta} from "@/app/_components/marketing/AlreadyCustomerCta";
import {Testimonials} from "@/app/_components/marketing/Testimonials";
import {FaqAccordion} from "@/app/_components/marketing/FaqAccordion";
import {ClosingCta} from "@/app/_components/marketing/ClosingCta";
import {BankHero} from "@/app/_components/bank/BankHero";
import {CapabilitiesGrid} from "@/app/_components/bank/CapabilitiesGrid";
import {AccountComparisonSection} from "@/app/_components/bank/AccountComparisonSection";
import {BankLegacySection} from "@/app/_components/bank/BankLegacySection";
import {ROUTES} from "@/app/_constants";

const CAPABILITIES = [
  {
    icon: "lucide:smartphone",
    title: "Instant Account By Phone",
    description:
      "Open your compliant tier-1 bank account in under 3 minutes simply using your registered phone number and BVN. No paperwork required.",
    highlight: "Real-time NUBAN generation",
  },
  {
    icon: "lucide:badge-percent",
    title: "Zero Maintenance Fees",
    description:
      "Eliminate hidden debit card charges, monthly maintenance charges, and surprise ledger fees. Keep more of what you earn with absolute transparency.",
    highlight: "Transparent tariff structure",
  },
  {
    icon: "lucide:trending-up",
    title: "High-Yield Interest Rates",
    description:
      "Earn competitive yields up to 7.5% annually on unencumbered balances, calculated daily and paid directly to your account every 30 days.",
    highlight: "Automated compound returns",
  },
  {
    icon: "lucide:layout-grid",
    title: "Omnichannel Mobile App",
    description:
      "Control banking, monitor pensions, and trade equities in one unified super-app with biometric authentication and 99.98% uptime.",
    highlight: "iOS • Android • Web portal",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Opening my High-Yield Savings account took literally 3 minutes during lunch. The 7.5% monthly credit is always exact, and the virtual card works flawlessly for all my international subscriptions.",
    initials: "TA",
    name: "Tunde Adeyemi",
    role: "Lead Product Designer, Lagos",
  },
  {
    quote:
      "As a logistics company doing over ₦50M weekly turnover, our Stanbic IBTC Corporate Current account and dedicated relationship manager have been game changers for trade credit and quick payroll runs.",
    initials: "FB",
    name: "Folake Balogun",
    role: "Managing Director, SwiftHaul Nigeria",
  },
  {
    quote:
      "The unified holdings app lets me check my bank account, view my pension statement, and purchase stock on the NGX all from one secure sign-in. True institutional convenience.",
    initials: "ED",
    name: "Dr. Emeka Danladi",
    role: "Surgeon & Private Investor, Abuja",
  },
];

const FAQS = [
  {
    question: "What documents do I need to open a Stanbic IBTC Bank account online?",
    answer:
      "Just your BVN and a valid means of ID (National ID, driver's licence, voter's card, or international passport). We verify everything digitally — no branch visit required.",
  },
  {
    question: "How does the 7.5% annual interest on Savings Accounts work?",
    answer:
      "Interest accrues daily on your unencumbered balance and is credited directly into your account every 30 days — fully automated, with no action required from you.",
  },
  {
    question: "Are my funds insured by the NDIC?",
    answer:
      "Yes. All deposits are protected by the Nigeria Deposit Insurance Corporation (NDIC) up to the statutory maximum, and we operate under strict Central Bank of Nigeria oversight.",
  },
  {
    question: "Can I link my account to Stanbic IBTC Pensions and Stockbroking?",
    answer:
      "Absolutely. Your bank account gives you single-sign-on access into the Pension Managers dashboard and seamless settlement with your Stockbroking portfolio.",
  },
];

export default function BankPage() {
  return (
    <div className="flex flex-1 flex-col">
      <TopTrustBar
        badge="Stanbic IBTC Bank PLC"
        caption="CBN Licensed Commercial Bank • NDIC Insured Deposits"
        stats={[
          {icon: "lucide:shield-check", label: "Tier-1 Capital Stability"},
          {icon: "lucide:timer", label: "Avg. Onboarding: 180 Seconds"},
        ]}
      />

      <BankHero />

      <CapabilitiesGrid
        badge="Core Capabilities"
        heading="Engineered for Instant Modern Financial Mobility"
        description="Whether funding personal ambitions or managing corporate working capital, enjoy zero-friction digital services configured for absolute integrity."
        capabilities={CAPABILITIES}
      />

      <AccountComparisonSection />

      <AlreadyCustomerCta
        eyebrow="Existing Client Accelerated Pathway"
        title="Already bank with Stanbic IBTC?"
        description="Add a new Savings, Current, or Foreign Currency Account in 60 seconds with instant BVN recognition and zero duplicate paperwork."
        primaryCta={{label: "Add Account in 60s", href: ROUTES.apply("SAVINGS"), icon: "lucide:plus-circle"}}
        secondaryCta={{label: "Call Private Banker", icon: "lucide:phone"}}
      />

      <BankLegacySection />

      <Testimonials
        badge="Customer Stories"
        heading="Trusted by Individuals and Visionary Enterprises"
        description="Hear how Stanbic IBTC Bank provides effortless liquidity and peace of mind across Nigeria."
        testimonials={TESTIMONIALS}
      />

      <FaqAccordion
        badge="Got Questions?"
        heading="Frequently Asked Questions"
        description="Everything you need to know about opening and operating an account with Stanbic IBTC Bank."
        items={FAQS}
      />

      <ClosingCta
        title="Begin Your Journey with Stanbic IBTC Bank Today."
        description="Join over 4 million Nigerians who rely on our sovereign financial foundation, zero surprise fees, and intuitive digital tools."
        primaryCta={{label: "Open Account Online", href: ROUTES.apply("SAVINGS")}}
        secondaryCta={{label: "Help & Branch Locator", href: ROUTES.holdings}}
      />
    </div>
  );
}
