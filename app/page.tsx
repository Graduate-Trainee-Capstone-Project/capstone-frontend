import {SiteHeader} from "@/app/_components/marketing/SiteHeader";
import {SiteFooter} from "@/app/_components/marketing/SiteFooter";
import {Hero} from "@/app/_components/marketing/Hero";
import {FeatureGrid} from "@/app/_components/marketing/FeatureGrid";
import {SubsidiaryCard} from "@/app/_components/marketing/SubsidiaryCard";
import {ROUTES} from "@/app/_constants";

const SUBSIDIARIES = [
  {
    title: "Bank",
    description: "Everyday banking — savings and current accounts you can open in minutes.",
    href: ROUTES.bank,
  },
  {
    title: "Pension Managers",
    description: "Register a Retirement Savings Account and take control of your future.",
    href: ROUTES.pensions,
  },
  {
    title: "Stockbrokers",
    description: "Trade and invest in the Nigerian stock market with a dedicated brokerage account.",
    href: ROUTES.stockbroking,
  },
];

const WHY_US = [
  {
    title: "One profile, every business",
    description: "Verify once and reuse your details across Banking, Pension, and Stockbroking — no repeat paperwork.",
  },
  {
    title: "Fully digital onboarding",
    description: "Apply from your phone or laptop, save your progress, and pick up right where you left off.",
  },
  {
    title: "Bank-grade security",
    description: "Your identity is verified and your consent is captured at every step of the way.",
  },
];

export default function HoldingsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <Hero
          eyebrow="Stanbic IBTC Holdings"
          title="One holding, every financial service you need."
          description="Stanbic IBTC Holdings brings together Banking, Pension Management, and Stockbroking under one roof — so opening an account with any of our businesses is fast, secure, and joined up."
          primaryCta={{label: "Open an account", href: ROUTES.home}}
          secondaryCta={{label: "Explore our businesses", href: ROUTES.bank}}
        />

        <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-grey-900">Our businesses</h2>
            <p className="max-w-2xl text-sm text-grey-600">
              Choose the business you&apos;d like to open an account with. If you&apos;re already a customer with
              any of them, we&apos;ll help you get set up even faster.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {SUBSIDIARIES.map((subsidiary) => (
              <SubsidiaryCard key={subsidiary.title} {...subsidiary} />
            ))}
          </div>
        </section>

        <FeatureGrid heading="Why open an account with us" features={WHY_US} />
      </main>
      <SiteFooter />
    </div>
  );
}
