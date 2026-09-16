import Image from "next/image";
import {Icon} from "@/app/_ui";

const PROOF_POINTS = [
  {
    icon: "lucide:shield",
    title: "Sovereign Custody",
    description: "Funds held independently by an accredited Pension Fund Custodian (PFC).",
  },
  {
    icon: "lucide:bell",
    title: "Real-time Statements",
    description: "Instant push notification on monthly employer contribution deposits.",
  },
];

/** "Your Retirement Shouldn't Be Left to Chance" editorial photo + trust-point section. */
export function RetirementProofSection() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12">
        <div className="relative col-span-1 h-96 w-full overflow-hidden rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] lg:col-span-5">
          <Image
            src="/images/pension/couple-happy-old.jpg"
            alt="A happy retired Nigerian couple relaxing at home"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-x-4 bottom-4 flex flex-col gap-0.5 rounded-xl bg-primary-900/80 p-4 backdrop-blur-sm">
            <span className="text-[11px] font-semibold tracking-wide text-primary-50">Peace of Mind</span>
            <p className="text-sm text-white">
              Over ₦1.8 Trillion in retirees&apos; pensions faithfully paid out since inception.
            </p>
          </div>
        </div>

        <div className="col-span-1 flex flex-col items-start gap-4 lg:col-span-7">
          <span className="text-xs font-semibold tracking-wide text-primary-500 uppercase">Generational Security</span>
          <h2 className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
            Your Retirement Shouldn&apos;t Be Left to Chance
          </h2>
          <p className="text-sm leading-relaxed text-grey-600">
            Stanbic IBTC Pension Managers applies institutional portfolio diversification across Federal Government
            of Nigeria (FGN) bonds, treasury bills, high-dividend equities, and infrastructure funds. Our investment
            framework strictly follows PenCom&apos;s risk management mandates, shielding your balance against
            macroeconomic volatility.
          </p>

          <div className="flex w-full flex-col gap-4 pt-2 sm:flex-row">
            {PROOF_POINTS.map((point) => (
              <div key={point.title} className="flex flex-1 items-start gap-3 rounded-xl bg-white p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <Icon icon={point.icon} className="mt-0.5 size-6 shrink-0 text-primary-500" />
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-base font-semibold text-primary-900">{point.title}</h3>
                  <p className="text-xs leading-relaxed text-grey-600">{point.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
