import {Hero} from "@/app/_components/marketing/Hero";
import {FeatureGrid} from "@/app/_components/marketing/FeatureGrid";
import {ProductCtaCard} from "@/app/_components/marketing/ProductCtaCard";
import {ROUTES} from "@/app/_constants";

const BENEFITS = [
  {
    title: "Trade Nigerian equities",
    description: "Buy and sell shares on the Nigerian Exchange through a dedicated brokerage account.",
  },
  {
    title: "Link any bank account",
    description: "Settle trades with your Stanbic IBTC account or any other Nigerian bank account.",
  },
  {
    title: "Guided onboarding",
    description: "Verify your BVN, confirm your identity, and upload your documents in one seamless flow.",
  },
];

export default function StockbrokingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero
        eyebrow="Stanbic IBTC Stockbrokers"
        title="Start investing in the Nigerian stock market."
        description="Open a stockbroking account online — whether you're an individual investor or registering on behalf of a company."
        primaryCta={{label: "Start application", href: ROUTES.apply("STOCKBROKING")}}
      />

      <FeatureGrid heading="Why invest with us" features={BENEFITS} />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="mb-6 text-2xl font-semibold text-grey-900">How to register</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <ProductCtaCard
            title="Individuals"
            description="Open a personal stockbroking account in a few guided steps."
            bullets={[
              "BVN and date of birth verification",
              "Link a bank account for settlement",
              "Upload your ID, passport photo, and signature",
              "Review and submit — most people finish in minutes",
            ]}
            href={ROUTES.apply("STOCKBROKING")}
            ctaLabel="Register as an individual"
          />
          <ProductCtaCard
            title="Corporates"
            description="Register your company for a corporate stockbroking account."
            bullets={[
              "Company registration and incorporation documents",
              "Authorized signatories' identification",
              "A settlement bank account for the company",
              "Review and submit for processing",
            ]}
            href={ROUTES.apply("STOCKBROKING")}
            ctaLabel="Register a corporate account"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex flex-col gap-2 rounded-2xl border border-grey-200 bg-grey-50 p-6">
          <h3 className="text-base font-semibold text-grey-900">Already started a stockbroking application?</h3>
          <p className="text-sm text-grey-600">
            Head into the application and enter the BVN you started with — we&apos;ll pick up right where you left
            off.
          </p>
        </div>
      </section>
    </div>
  );
}
