import {Hero} from "@/app/_components/marketing/Hero";
import {FeatureGrid} from "@/app/_components/marketing/FeatureGrid";
import {StepList} from "@/app/_components/marketing/StepList";
import {ROUTES} from "@/app/_constants";

const BENEFITS = [
  {
    title: "Mandatory or voluntary",
    description: "Register under the Contributory Pension Scheme, or save extra with a voluntary contribution.",
  },
  {
    title: "Track your RSA online",
    description: "See your contributions and balance from your phone or laptop, anytime.",
  },
  {
    title: "Backed by Stanbic IBTC",
    description: "Nigeria's leading Pension Fund Administrator, trusted with retirement savings nationwide.",
  },
];

const STEPS = [
  "Personal information",
  "Employment details",
  "Next of kin",
  "PEP declaration",
  "Document upload",
  "Review and submit",
];

export default function PensionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Hero
        eyebrow="Stanbic IBTC Pension Managers"
        title="Register your Retirement Savings Account (RSA) online."
        description="Take control of your retirement savings with Stanbic IBTC Pension Managers — register in a few guided steps and manage your RSA from anywhere."
        primaryCta={{label: "Register for an RSA", href: ROUTES.apply("PENSION_RSA")}}
      />

      <FeatureGrid heading="Why save with us" features={BENEFITS} />

      <StepList
        heading="How registration works"
        description="Our online form walks you through six short steps — most people finish in under ten minutes."
        steps={STEPS}
      />
    </div>
  );
}
