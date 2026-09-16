import {RegistrationPathCard} from "@/app/_components/stockbroking/RegistrationPathCard";
import {ROUTES} from "@/app/_constants";

/** "Choose Your Registration Path" section — Individuals vs. Corporates. */
export function RegistrationPathsSection() {
  return (
    <section id="onboarding-paths" className="scroll-mt-20 bg-grey-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <span className="w-fit text-xs font-bold tracking-wide text-primary-500 uppercase">
              Targeted Onboarding Architecture
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-primary-900 sm:text-3xl">
              Choose Your Registration Path
            </h2>
            <p className="max-w-2xl pt-1 text-sm text-grey-600">
              Whether deploying individual wealth into sovereign instruments or managing portfolio execution for
              multi-entity balance sheets, select the appropriate framework.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <RegistrationPathCard
            tag="Retail & Private Wealth"
            duration="~5 Min Digital Journey"
            title="Individuals Path"
            description="Designed for retail investors, high-net-worth individuals, young professionals, and diaspora Nigerians building an active capital market portfolio."
            clientele={["Retail Investors", "HNWIs & Family Wealth", "Tech & Executive Earners", "Diaspora Nigerians"]}
            featuresHeading="Account Highlights & Platform Access"
            features={[
              {title: "Stanbic Stockbrokers Mobile App & Web Portal:", description: "Full self-service order execution anytime."},
              {title: "Real-Time Live NGX Price Feeds:", description: "Streaming market depth and order-book transparency."},
              {title: "0% Account Opening Fee:", description: "Zero initial penalty or dormant account charges."},
              {title: "Automated E-Dividend Processing:", description: "Direct payout link through CSCS to your bank account."},
              {title: "Institutional Research Dispatch:", description: "Daily equity wrap-ups, valuation ratings, and stock alerts."},
            ]}
            documentsHeading="Required Documentation"
            documentsCaption="CBN & SEC Mandated"
            documents={["Valid BVN & NIN", "Government Photo ID", "Utility Bill (< 3 Months)", "Nigerian Bank Details"]}
            cta={{label: "Start Individual Application", href: ROUTES.apply("STOCKBROKING")}}
            footnote="Instant CSCS account generation upon BVN/NIN verification clearance."
            accent="primary"
          />
          <RegistrationPathCard
            tag="Institutional & Sovereign"
            duration="Desk Advisory Assigned"
            title="Corporates Path"
            description="Engineered for registered companies, pension fund administrators (PFAs), asset management firms, trust funds, and institutional global allocators."
            clientele={["Limited Liability Companies", "Endowment & Trust Funds", "Asset Managers & PFAs", "Sovereign & Foreign Funds"]}
            featuresHeading="Institutional Desk Capabilities"
            features={[
              {title: "Dedicated Institutional Broker Desk:", description: "Direct phone and chat execution with senior licensed traders."},
              {title: "Bulk Order & Block Trades:", description: "Minimise market price impact with dark liquidity and cross allocations."},
              {title: "Stanbic Custody Integration:", description: "Seamless link with Stanbic IBTC Nominees & global custodian networks."},
              {title: "Bespoke Portfolio Advisory:", description: "Tailored fixed income duration matching, CP issuance, and treasury strategies."},
              {title: "Direct API Order Routing:", description: "Proprietary DMA protocols for algorithmic institutional trading desks."},
            ]}
            documentsHeading="Corporate Verification Package"
            documentsCaption="CAC & CAMA Compliant"
            documents={["CAC 1.1 / Status Report", "Board Resolution (CSCS)", "Directors' BVN & IDs", "Certified MEMART"]}
            cta={{label: "Start Corporate Application", href: ROUTES.apply("STOCKBROKING")}}
            footnote="Corporate desk relationship manager assigned immediately upon document upload."
            accent="dark"
          />
        </div>
      </div>
    </section>
  );
}
