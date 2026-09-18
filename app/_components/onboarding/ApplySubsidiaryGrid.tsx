import Link from "next/link";
import { Icon } from "@/app/_ui/Icon";
import { SUBSIDIARIES, ROUTES } from "@/app/_constants";
import type { Subsidiary } from "@/app/_constants";

function ApplySubsidiaryCard({ subsidiary }: { subsidiary: Subsidiary }) {
  return (
    <Link
      href={ROUTES.applySubsidiary(subsidiary.slug)}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className={`h-2 w-full ${subsidiary.accentClassName}`} />
      <div className="flex flex-1 flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <span className={`flex size-14 items-center justify-center rounded-2xl ${subsidiary.iconBgClassName}`}>
            <Icon icon={subsidiary.icon} className="size-6 text-primary-900" />
          </span>
          <span className="rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-900">
            {subsidiary.badge}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold tracking-tight text-primary-900">{subsidiary.legalName}</h2>
          <p className="text-sm leading-relaxed text-grey-600">{subsidiary.description}</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-primary-90 px-3 py-1.5">
          <Icon icon="lucide:shield-check" className="size-4 shrink-0 text-grey-600" />
          <span className="text-[11px] font-semibold tracking-wide text-grey-600">
            {subsidiary.regulatoryLabel}
          </span>
        </div>

        <ul className="flex flex-col gap-3">
          {subsidiary.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2.5 text-xs text-primary-900">
              <Icon icon="lucide:check-circle" className="size-4.5 shrink-0 text-primary-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="px-8 pb-8">
        <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 group-hover:bg-primary-300">
          {subsidiary.ctaLabel}
          <Icon icon="lucide:arrow-right" className="size-4.5" />
        </span>
      </div>
    </Link>
  );
}

export function ApplySubsidiaryGrid() {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {SUBSIDIARIES.map((subsidiary) => (
        <ApplySubsidiaryCard key={subsidiary.slug} subsidiary={subsidiary} />
      ))}
    </div>
  );
}
