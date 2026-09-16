import {CrossNavBanner} from "@/app/_components/marketing/CrossNavBanner";
import {MarketTicker} from "@/app/_components/stockbroking/MarketTicker";
import {StockbrokingHero} from "@/app/_components/stockbroking/StockbrokingHero";
import {CredentialsBar} from "@/app/_components/stockbroking/CredentialsBar";
import {RegistrationPathsSection} from "@/app/_components/stockbroking/RegistrationPathsSection";
import {TradingStepsGrid} from "@/app/_components/stockbroking/TradingStepsGrid";
import {ResearchBanner} from "@/app/_components/stockbroking/ResearchBanner";
import {ROUTES} from "@/app/_constants";

export default function StockbrokingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <MarketTicker />

      <StockbrokingHero />

      <CredentialsBar />

      <RegistrationPathsSection />

      <TradingStepsGrid />

      <ResearchBanner />

      <CrossNavBanner
        title="Exploring Additional Group Solutions?"
        description="Seamlessly manage retail banking, retirement RSA savings, and stockbroking under one unified Holdings profile."
        links={[
          {label: "Commercial Banking", href: ROUTES.bank},
          {label: "Pension Managers", href: ROUTES.pensions},
          {label: "Stockbroking FAQ", href: ROUTES.stockbroking, emphasis: true},
        ]}
      />
    </div>
  );
}
