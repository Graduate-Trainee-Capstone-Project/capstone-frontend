import {BrandLogo} from "@/app/_components/brand/BrandLogo";
import {Icon} from "@/app/_ui/Icon";
import {
  PRODUCT_DISPLAY_COPY,
  PRODUCT_DOCUMENT_SLOTS,
  IDENTIFIER_META,
  productCodeToSubsidiary,
  productDisplayName,
} from "@/app/_constants";
import type {Product, ProductCode} from "@/app/_types";

interface ApplyWizardRailProps {
  productCode: ProductCode;
  product?: Product;
}

export function ApplyWizardRail({productCode, product}: ApplyWizardRailProps) {
  const subsidiary = productCodeToSubsidiary(productCode);
  const copy = PRODUCT_DISPLAY_COPY[productCode];
  const name = productDisplayName(productCode, product?.productName);
  const identifiers = product?.requiredIdentifiers ?? [];
  const documents = PRODUCT_DOCUMENT_SLOTS[productCode] ?? [];

  return (
    <aside className="hidden lg:col-span-4 lg:block">
      <div className="sticky top-24 flex flex-col gap-6 rounded-2xl border border-grey-200 bg-white p-6 shadow-sm">
        <BrandLogo variant="blue" size="sm" />

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
            {subsidiary.legalName}
          </p>
          <h2 className="text-xl font-bold tracking-tight text-primary-900">{name}</h2>
          <p className="text-sm leading-relaxed text-grey-600">{copy?.description}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] font-semibold tracking-wide text-grey-500 uppercase">
            What you&apos;ll need
          </p>
          <ul className="flex flex-col gap-2.5">
            {identifiers.map((type) => (
              <li key={type} className="flex items-center gap-2 text-sm text-primary-900">
                <Icon icon="lucide:fingerprint" className="size-4 shrink-0 text-primary-500" />
                {IDENTIFIER_META[type].label}
              </li>
            ))}
            {documents.map((slot) => (
              <li key={slot.key} className="flex items-center gap-2 text-sm text-primary-900">
                <Icon icon="lucide:file-text" className="size-4 shrink-0 text-primary-500" />
                {slot.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-start gap-2 rounded-xl bg-primary-90 px-3 py-2.5">
          <Icon icon="lucide:shield-check" className="mt-0.5 size-4 shrink-0 text-primary-500" />
          <p className="text-[11px] font-medium leading-relaxed text-grey-600">
            {subsidiary.regulatoryLabel}. Your details are encrypted and used only to open this account.
          </p>
        </div>
      </div>
    </aside>
  );
}
