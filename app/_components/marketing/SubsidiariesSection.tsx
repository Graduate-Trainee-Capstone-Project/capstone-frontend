import {Icon} from "@/app/_ui/Icon";
import {SubsidiaryDetailCard} from "@/app/_components/marketing/SubsidiaryDetailCard";
import {ROUTES, SUBSIDIARIES} from "@/app/_constants";

const MARKETING_CTA: Record<string, string> = {
  bank: "Open Bank Account",
  pension: "Register for an RSA",
  stockbroking: "Start Stock Trading",
  investment: "Open Investment Account",
};

export function SubsidiariesSection() {
  return (
    <section id="subsidiaries" className="scroll-mt-20 bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="flex items-center gap-1.5 rounded-full bg-primary-75 px-3 py-1">
            <Icon icon="lucide:link" className="size-4 text-primary-500" />
            <span className="text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
              Integrated Divisions
            </span>
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-900 sm:text-3xl">
            Specialized Subsidiaries. One Unified Relationship.
          </h2>
          <p className="text-sm text-grey-600">
            Connect your accounts across banking, pension, stockbroking, and investment without fragmented
            identity credentials.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {SUBSIDIARIES.map((subsidiary) => (
            <SubsidiaryDetailCard
              key={subsidiary.slug}
              accentClassName={subsidiary.accentClassName}
              iconBgClassName={subsidiary.iconBgClassName}
              icon={subsidiary.icon}
              badge={subsidiary.badge}
              title={subsidiary.legalName}
              description={subsidiary.description}
              regulatoryIcon="lucide:shield-check"
              regulatoryLabel={subsidiary.regulatoryLabel}
              features={subsidiary.features}
              href={subsidiary.marketingHref ?? ROUTES.applySubsidiary(subsidiary.slug)}
              ctaLabel={MARKETING_CTA[subsidiary.slug] ?? subsidiary.ctaLabel}
              secondaryLabel={subsidiary.secondaryLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
