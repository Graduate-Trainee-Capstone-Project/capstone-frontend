import Link from "next/link";
import {BrandLogo} from "@/app/_components/brand/BrandLogo";
import {ApplySubsidiaryGrid} from "@/app/_components/onboarding/ApplySubsidiaryGrid";
import {Icon} from "@/app/_ui/Icon";
import {ROUTES} from "@/app/_constants";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Open an account",
};

const TRUST_CHIPS = [
  {icon: "lucide:shield-check", label: "Licensed by CBN"},
  {icon: "lucide:badge-check", label: "Insured by NDIC"},
  {icon: "lucide:landmark", label: "PenCom registered"},
  {icon: "lucide:scale", label: "SEC licensed"},
];

export default function ApplyPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="relative overflow-hidden bg-primary-700">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 -left-24 size-80 rounded-full bg-primary-300 blur-[60px]" />
          <div className="absolute top-1/2 right-0 size-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-primary-300 opacity-30 blur-[70px]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-12 sm:px-6 sm:py-16">
          <BrandLogo variant="white" size="lg" priority />
          <div className="flex max-w-2xl flex-col gap-3">
            <p className="text-[11px] font-semibold tracking-wide text-primary-50 uppercase">
              Digital onboarding
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Open an account</h1>
            <p className="text-base leading-relaxed text-primary-50/80">
              Choose a Stanbic IBTC subsidiary to begin. One identity, one relationship — Bank, Pension,
              Stockbroking, or Investment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            {TRUST_CHIPS.map((chip) => (
              <div key={chip.label} className="flex items-center gap-2">
                <Icon icon={chip.icon} className="size-4 text-primary-50/90" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-50/90">{chip.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex-1 bg-primary-90">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-primary-900">Select a subsidiary</h2>
            <p className="text-sm text-grey-600">
              Already a customer? We&apos;ll find your profile automatically once you continue.
            </p>
          </div>
          <ApplySubsidiaryGrid />
          <p className="text-center text-xs text-grey-500">
            A member of Standard Bank Group.{" "}
            <Link href={ROUTES.holdings} className="font-medium text-primary-500 hover:underline">
              Back to Holdings
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
