import Image from "next/image";
import { Icon } from "@/app/_ui";

const NARRATIVE_POINTS = [
  {
    icon: "lucide:git-branch",
    title: "Interconnected Financial Group",
    description:
      "Sweep funds seamlessly between your commercial bank account, retirement savings account (RSA) at Pension Managers, and stock trading portfolio.",
  },
  {
    icon: "lucide:scale",
    title: "Regulatory Precision",
    description:
      "Every balance is guaranteed under strict Central Bank of Nigeria (CBN) monetary oversight and protected by the Nigeria Deposit Insurance Corporation (NDIC).",
  },
];

/** "Confidence Built on Standard Bank Group's 160-Year Legacy" section. */
export function BankLegacySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div className="flex gap-4">
          <div className="flex flex-1 flex-col gap-4 pb-8">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/bank/Agency%20banking%20520%20x%20240.jpg"
                alt="A Stanbic IBTC agent assisting a customer at a partner store"
                fill
                sizes="(min-width: 1024px) 25vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 rounded-2xl bg-primary-90 p-5">
              <span className="text-xl font-bold tracking-tight text-primary-500">₦4.2T+</span>
              <span className="text-[11px] font-semibold tracking-wide text-grey-600">
                Institutional Assets Under Management within Holdings Ecosystem
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 pt-6">
            <div className="flex flex-col gap-2 rounded-2xl bg-primary-900 p-5">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="size-4.5 text-primary-50" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-50">Security Grade</span>
              </div>
              <span className="text-lg font-semibold text-white">Tier-4 Sovereign Grade Data Centers</span>
            </div>
            <div className="relative h-64 w-full overflow-hidden rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
              <Image
                src="/images/bank/SB_1163569575_Landscape_SW.jpg"
                alt="A customer using the Stanbic IBTC mobile banking app at a branch"
                fill
                sizes="(min-width: 1024px) 25vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5">
          <span className="rounded-full bg-primary-75 px-3 py-1 text-xs font-semibold tracking-wide text-primary-500">
            The Stanbic IBTC Advantage
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
            Confidence Built on Standard Bank Group&apos;s 160-Year Legacy.
          </h2>
          <p className="text-base leading-relaxed text-grey-600">
            As an anchor pillar of Stanbic IBTC Holdings PLC and the Standard Bank Group—Africa&apos;s largest bank by
            assets—we protect, grow, and optimize your wealth through rigorous corporate governance and digital
            innovation.
          </p>

          <div className="flex w-full flex-col gap-4 pt-2">
            {NARRATIVE_POINTS.map((point) => (
              <div key={point.title} className="flex items-start gap-4 rounded-xl bg-grey-50 p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-75">
                  <Icon icon={point.icon} className="size-5 text-primary-500" />
                </span>
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
