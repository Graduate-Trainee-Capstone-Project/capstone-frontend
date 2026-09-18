import Link from "next/link";
import {ApplyProductClient} from "@/app/_components/onboarding/ApplyProductClient";
import {ApplyWizardRail} from "@/app/_components/onboarding/ApplyWizardRail";
import {BrandLogo} from "@/app/_components/brand/BrandLogo";
import {getProductAction} from "@/app/_lib/actions";
import {isProductCode, productCodeToSubsidiary, productDisplayName, ROUTES} from "@/app/_constants";
import type {ProductCode} from "@/app/_types";
import type {Metadata} from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{productCode: string}>;
}): Promise<Metadata> {
  const {productCode} = await params;
  if (!isProductCode(productCode)) {
    return {title: "Application"};
  }
  return {title: `Apply · ${productDisplayName(productCode)}`};
}

export default async function ApplyProductPage({
  params,
}: {
  params: Promise<{productCode: string}>;
}) {
  const {productCode: rawCode} = await params;
  const productCode = rawCode as ProductCode;
  const subsidiary = isProductCode(productCode) ? productCodeToSubsidiary(productCode) : null;
  const productResult = isProductCode(productCode) ? await getProductAction(productCode) : undefined;

  return (
    <div className="flex flex-1 flex-col bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-4 lg:hidden">
            <BrandLogo variant="blue" size="sm" />
          </div>
          {subsidiary ? (
            <p className="text-xs font-medium tracking-wide text-grey-500 uppercase lg:hidden">
              {subsidiary.legalName}
              {isProductCode(productCode) ? ` · ${productDisplayName(productCode)}` : ""}
            </p>
          ) : null}
        </div>

        <Link
          href={subsidiary ? ROUTES.applySubsidiary(subsidiary.slug) : ROUTES.home}
          className="text-sm font-medium text-grey-500 hover:text-grey-800"
        >
          {subsidiary ? `\u2190 Back to ${subsidiary.name} products` : "\u2190 Back to products"}
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {isProductCode(productCode) ? (
            <ApplyWizardRail productCode={productCode} product={productResult?.data} />
          ) : null}
          <div className="lg:col-span-8">
            <div className="rounded-2xl border border-grey-200 bg-white p-6 shadow-sm sm:p-8">
              <ApplyProductClient productCode={productCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
