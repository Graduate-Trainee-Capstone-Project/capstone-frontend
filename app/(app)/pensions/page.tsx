import {CrossNavBanner} from "@/app/_components/marketing/CrossNavBanner";
import {PensionHero} from "@/app/_components/pensions/PensionHero";
import {ValuePropsGrid} from "@/app/_components/pensions/ValuePropsGrid";
import {RetirementProofSection} from "@/app/_components/pensions/RetirementProofSection";
import {RegistrationStepsGrid} from "@/app/_components/pensions/RegistrationStepsGrid";
import {MultiFundExplorer} from "@/app/_components/pensions/MultiFundExplorer";
import {TransferWindowBanner} from "@/app/_components/pensions/TransferWindowBanner";
import {PensionClosingCta} from "@/app/_components/pensions/PensionClosingCta";
import {ROUTES} from "@/app/_constants";

export default function PensionsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PensionHero />

      <ValuePropsGrid />

      <RetirementProofSection />

      <RegistrationStepsGrid />

      <MultiFundExplorer />

      <TransferWindowBanner />

      <PensionClosingCta />

      <CrossNavBanner
        title="Exploring Additional Group Solutions?"
        description="Seamlessly manage retail banking, retirement RSA savings, and stockbroking under one unified Holdings profile."
        links={[
          {label: "Commercial Banking", href: ROUTES.bank},
          {label: "Stockbroking", href: ROUTES.stockbroking},
          {label: "Back to Holdings", href: ROUTES.holdings, emphasis: true},
        ]}
      />
    </div>
  );
}
