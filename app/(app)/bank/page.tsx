import {Hero} from "@/app/_components/marketing/Hero";
import {FeatureGrid} from "@/app/_components/marketing/FeatureGrid";
import {ProductCtaCard} from "@/app/_components/marketing/ProductCtaCard";
import {ROUTES} from "@/app/_constants";

const BENEFITS = [
  {
    title: "Open in minutes",
    description: "Verify your BVN and fill a short form — no branch visit required.",
  },
  {
    title: "Save and resume",
    description: "Start on your phone, continue later on your laptop — your progress is saved automatically.",
  },
  {
    title: "One profile, every business",
    description: "Already a Pension or Stockbroking customer? We can reuse your verified details here too.",
  },
];

export default function BankPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero
        eyebrow="Stanbic IBTC Bank"
        title="Banking built for everyday life and business."
        description="From your first savings account to a current account for your business, open it online today and start banking with us in minutes."
        primaryCta={{label: "Open an account", href: ROUTES.apply("SAVINGS")}}
      />

      <FeatureGrid heading="Why bank with us" features={BENEFITS} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-semibold text-grey-900">Choose an account</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ProductCtaCard
            title="Savings account"
            description="Grow your money with interest from day one."
            bullets={[
              "No minimum opening balance",
              "Interest earned on your balance",
              "Free mobile and internet banking",
            ]}
            href={ROUTES.apply("SAVINGS")}
          />
          <ProductCtaCard
            title="Current account"
            description="Built for everyday transactions and running your business."
            bullets={[
              "Unlimited transactions",
              "Optional cheque book",
              "Business-friendly features",
            ]}
            href={ROUTES.apply("CURRENT")}
          />
        </div>
      </section>
    </div>
  );
}
