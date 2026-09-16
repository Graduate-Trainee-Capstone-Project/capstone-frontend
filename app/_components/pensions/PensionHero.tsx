import Link from "next/link";
import {Icon} from "@/app/_ui";
import {RsaCardPreview} from "@/app/_components/pensions/RsaCardPreview";
import {ROUTES} from "@/app/_constants";

const STATS = [
  {value: "2M+", label: "Active Nigerian Contributors"},
  {value: "\u20a64.2T+", label: "Assets Under Management"},
  {value: "99.8%", label: "Prompt Remittance Audit"},
];

/** Pensions page hero — dark cobalt gradient with an RSA certificate visual. */
export function PensionHero() {
  return (
    <section className="relative overflow-hidden bg-primary-900">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-32 size-96 rounded-full bg-primary-500/30 blur-[32px]" />
        <div className="absolute -bottom-40 -left-20 size-[500px] rounded-full bg-primary-300/20 blur-[60px]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col items-start gap-0 lg:col-span-7">
          <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 shadow-sm">
            <Icon icon="lucide:shield-check" className="size-4 text-primary-50" />
            <span className="text-[11px] font-semibold tracking-wide text-primary-50">
              PenCom Regulated • PFA License 001
            </span>
          </span>

          <h1 className="max-w-xl pt-6 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl">
            Secure Your Golden Years with Nigeria&apos;s #1 Pension Manager.
          </h1>

          <p className="max-w-xl pt-6 text-base leading-relaxed text-primary-50/80 sm:text-lg">
            Preserve and grow your generational wealth with PenCom-regulated Retirement Savings Accounts (RSA),
            high-yield voluntary contributions, and effortless automated employer remittances backed by Stanbic
            IBTC&apos;s sovereign custody.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Link
              href={ROUTES.apply("PENSION_RSA")}
              className="flex items-center gap-2 rounded-xl bg-primary-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
            >
              Register for an RSA
              <Icon icon="lucide:arrow-right" className="size-[18px]" />
            </Link>
            <a
              href="#transfer-window"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/20"
            >
              <Icon icon="lucide:repeat" className="size-[18px]" />
              Transfer to Stanbic IBTC
            </a>
          </div>

          <div className="grid w-full grid-cols-3 gap-4 pt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-bold tracking-tight text-grey-50">{stat.value}</span>
                <span className="text-[11px] font-semibold tracking-wide text-primary-50/80">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="w-full max-w-md">
            <RsaCardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
