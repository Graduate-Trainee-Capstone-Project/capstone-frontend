import Link from "next/link";
import {Icon} from "@/app/_ui";
import {ROUTES} from "@/app/_constants";

const TRUST_BULLETS = [
  {icon: "lucide:badge-check", label: "Zero Account Maintenance Fees"},
  {icon: "lucide:shield-check", label: "PenCom Licensed RSA PIN"},
  {icon: "lucide:smartphone", label: "Mobile App Tracking Available"},
];

/** Final centered "Ready to take control of your retirement?" CTA banner. */
export function PensionClosingCta() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg">
          <Icon icon="lucide:landmark" className="size-9 text-white" />
        </span>

        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
          Ready to take control of your retirement? Register for an RSA in 5 minutes.
        </h2>
        <p className="max-w-xl text-base text-grey-600">
          Join over 2 million Nigerians who trust Stanbic IBTC Pension Managers for transparent records, superior
          yields, and effortless golden years.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href={ROUTES.apply("PENSION_RSA")}
            className="rounded-xl bg-primary-500 px-10 py-4 text-base font-semibold text-white shadow-lg transition-colors duration-150 hover:bg-primary-300"
          >
            Register for an RSA
          </Link>
          <span className="flex items-center gap-2 rounded-xl bg-primary-75 px-6 py-4 text-sm font-semibold text-primary-900">
            <Icon icon="lucide:phone" className="size-[18px]" />
            Call 0700 PENSION
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
          {TRUST_BULLETS.map((bullet) => (
            <div key={bullet.label} className="flex items-center gap-1.5">
              <Icon icon={bullet.icon} className="size-4 text-grey-600" />
              <span className="text-xs text-grey-600">{bullet.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
