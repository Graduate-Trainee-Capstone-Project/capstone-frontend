import {SiteHeader} from "@/app/_components/marketing/SiteHeader";
import {SiteFooter} from "@/app/_components/marketing/SiteFooter";
import {HomeHero} from "@/app/_components/marketing/HomeHero";
import {TrustStrip} from "@/app/_components/marketing/TrustStrip";
import {AboutSection} from "@/app/_components/marketing/AboutSection";
import {SubsidiariesSection} from "@/app/_components/marketing/SubsidiariesSection";
import {DigitalOnboardingBanner} from "@/app/_components/marketing/DigitalOnboardingBanner";
import {GrowthProjector} from "@/app/_components/marketing/GrowthProjector";

export default function HoldingsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HomeHero />
        <TrustStrip />
        <AboutSection />
        <SubsidiariesSection />
        <DigitalOnboardingBanner />
        <GrowthProjector />
      </main>
      <SiteFooter />
    </div>
  );
}
