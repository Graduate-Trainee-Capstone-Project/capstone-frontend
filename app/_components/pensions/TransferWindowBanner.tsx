import {Icon} from "@/app/_ui";
import {ROUTES} from "@/app/_constants";

const CHECKLIST = ["Active RSA PIN", "Biometric Data Recapture (NIN verified)", "Current employer monthly payslip"];

/** "Dissatisfied with Your Current PFA?" dark transfer-window banner. */
export function TransferWindowBanner() {
  return (
    <section id="transfer-window" className="scroll-mt-20 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary-900 p-8 shadow-xl sm:p-12">
          <div aria-hidden className="pointer-events-none absolute -right-16 -bottom-16 size-80 rounded-full bg-primary-300/20 blur-[32px]" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex max-w-xl flex-col items-start gap-4">
              <span className="rounded-full bg-primary-500 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                PenCom Transfer Window Open
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Dissatisfied with Your Current Pension Fund Administrator?
              </h2>
              <p className="text-sm leading-relaxed text-primary-50/80">
                Under PenCom regulations, you are legally entitled to transfer your RSA to Stanbic IBTC Pension
                Managers without penalty. Retain your original RSA PIN while unlocking top-tier investment yield and
                automated statements.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href={ROUTES.apply("PENSION_RSA")}
                  className="rounded-xl bg-primary-300 px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-500"
                >
                  Initiate Transfer Request
                </a>
                <span className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white">
                  Speak to a Transfer Specialist
                </span>
              </div>
            </div>

            <div className="flex w-full max-w-sm shrink-0 flex-col gap-3 rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-75">
                  <Icon icon="lucide:clipboard-check" className="size-5 text-primary-500" />
                </span>
                <h3 className="text-base font-semibold text-white">Transfer Checklist</h3>
              </div>
              <ul className="flex flex-col gap-2 pt-1">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-primary-50/90">
                    <Icon icon="lucide:check" className="size-4 shrink-0 text-primary-50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
