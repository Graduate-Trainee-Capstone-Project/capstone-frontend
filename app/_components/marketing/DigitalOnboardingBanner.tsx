import Link from "next/link";
import {Icon} from "@/app/_components/ui/Icon";
import {ROUTES} from "@/app/_constants";

const STEPS = ["Verify BVN / NIN", "Select Desired Units", "Instant Account Activation"];

/** Dark "One Digital Account Flow" banner promoting the cross-subsidiary onboarding shortcut. */
export function DigitalOnboardingBanner() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary-700 p-8 shadow-xl sm:p-14">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -bottom-20 size-80 rounded-full bg-primary-500 opacity-30 blur-[32px]" />
            <div className="absolute -top-10 -left-10 size-64 rounded-full bg-primary-300 opacity-20 blur-[20px]" />
          </div>

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-col items-start gap-6 lg:col-span-8">
              <span className="flex items-center gap-2 rounded-full bg-primary-500/20 px-3 py-1">
                <Icon icon="lucide:fingerprint" className="size-4 text-primary-50" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-50">
                  Centralized KYC Pipeline
                </span>
              </span>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                One Digital Account Flow for all subsidiaries.
                <br />
                Verify your BVN once, open all accounts in minutes.
              </h2>

              <p className="max-w-2xl text-base leading-relaxed text-primary-50/80">
                No duplicated forms. No branch visits. Complete biometric verification with your BVN or NIN to
                activate your Bank Account, Pension RSA, and NGX Brokerage Profile simultaneously.
              </p>

              <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
                {STEPS.map((step, index) => (
                  <div key={step} className="flex flex-1 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-900">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold tracking-wide text-white">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center lg:col-span-4 lg:justify-end">
              <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:zap" className="size-7 shrink-0 text-primary-500" />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-primary-900">Express Digital Path</span>
                    <span className="text-[11px] text-grey-600">Estimated completion: 3 minutes</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-xl bg-primary-90 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-grey-600">CBN &amp; PenCom Compliant</span>
                    <span className="text-xs font-semibold text-primary-500">100% Paperless</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-primary-50">
                    <div className="h-full w-[85%] rounded-full bg-primary-500" />
                  </div>
                </div>

                <Link
                  href={ROUTES.home}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-300"
                >
                  Start Verification
                  <Icon icon="lucide:arrow-right" className="size-[18px]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
