import Link from "next/link";
import {BrandLogo} from "@/app/_components/brand/BrandLogo";
import {ProductGrid} from "@/app/_components/onboarding/ProductGrid";
import {Icon} from "@/app/_ui/Icon";
import {ROUTES, SUBSIDIARY_BY_SLUG} from "@/app/_constants";
import type {SubsidiarySlug} from "@/app/_constants";

interface SubsidiaryProductsViewProps {
  slug: SubsidiarySlug;
}

export function SubsidiaryProductsView({slug}: SubsidiaryProductsViewProps) {
  const subsidiary = SUBSIDIARY_BY_SLUG[slug];

  return (
    <div className="flex flex-1 flex-col bg-primary-90">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4">
          <BrandLogo variant="blue" size="sm" />
          <nav className="flex flex-wrap items-center gap-2 text-sm text-grey-500">
            <Link href={ROUTES.home} className="font-medium hover:text-grey-800">
              Open an account
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-grey-800">{subsidiary.name}</span>
          </nav>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-grey-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <span
                className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${subsidiary.iconBgClassName}`}
              >
                <Icon icon={subsidiary.icon} className="size-6 text-primary-900" />
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
                  {subsidiary.badge}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-primary-900">{subsidiary.legalName}</h1>
                <p className="max-w-xl text-sm leading-relaxed text-grey-600">{subsidiary.description}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-primary-90 px-3 py-1.5 w-fit">
            <Icon icon="lucide:shield-check" className="size-4 shrink-0 text-grey-600" />
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">
              {subsidiary.regulatoryLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-primary-900">Choose a product</h2>
          <ProductGrid productCodes={subsidiary.productCodes} />
        </div>
      </div>
    </div>
  );
}
