import Image from "next/image";
import {Icon} from "@/app/_components/ui/Icon";

const STATS = [
  {icon: "lucide:layers", value: "10 Subsidiaries", caption: "Full-spectrum ecosystem"},
  {icon: "lucide:map-pin", value: "Nationwide Reach", caption: "Branches in all 36 states"},
  {icon: "lucide:trophy", value: "#1 NGX Trader", caption: "Consistently leading volumes"},
];

/**
 * "About Stanbic IBTC Holdings" — heritage overview strip. The Figma frame
 * references a stock office photo that doesn't exist in this project; it's
 * substituted here with the existing `auth-background-img.jpeg` asset
 * (a real brand-consistent interior shot already in `public/images`).
 */
export function AboutSection() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12">
        <div className="relative lg:col-span-5">
          <div className="relative h-[280px] w-full overflow-hidden rounded-2xl shadow-xl sm:h-[360px]">
            <Image
              src="/images/auth-background-img.jpeg"
              alt="Stanbic IBTC Holdings — corporate headquarters interior"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/0 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1">
              <span className="text-[11px] font-semibold tracking-wide text-primary-50 uppercase">
                Historical Footprint
              </span>
              <span className="text-base font-bold text-white">Over Three Decades of Financial Architecture</span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-4 flex max-w-[280px] items-center gap-3 rounded-xl bg-white p-4 shadow-lg">
            <Icon icon="lucide:award" className="size-7 shrink-0 text-primary-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wide text-primary-900">A+ Fitch National Rating</span>
              <span className="text-[11px] text-grey-600">Demonstrating supreme credit strength</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-5 pt-6 lg:col-span-7 lg:pt-0">
          <div className="flex items-center gap-2">
            <span className="h-1 w-6 shrink-0 rounded-full bg-primary-500" />
            <span className="text-[11px] font-bold tracking-wide text-primary-500 uppercase">
              About Stanbic IBTC Holdings
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-primary-900 sm:text-3xl">
            Driving Africa&rsquo;s Growth with End-to-End Sovereign &amp; Capital Market Precision
          </h2>
          <p className="text-base leading-relaxed text-grey-600">
            For over 30 years, Stanbic IBTC Holdings PLC has served as the anchor of financial dependability in
            Nigeria. As a core member of Standard Bank Group&mdash;the continent&apos;s largest financial
            institution by assets&mdash;we unify everyday consumer banking, structured corporate financing,
            retirement savings administration, and equity capital markets under one integrated umbrella.
          </p>
          <p className="text-sm leading-relaxed text-grey-600">
            Our mission transcends transactional efficiency. We deploy cutting-edge cryptographic compliance,
            rigorous corporate governance, and unified cross-subsidiary infrastructure so private individuals,
            entrepreneurs, and multilateral corporations can mobilize capital with certainty.
          </p>

          <div className="grid w-full grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.value} className="flex flex-col gap-1 rounded-xl bg-primary-75 p-3.5">
                <Icon icon={stat.icon} className="size-5 text-primary-500" />
                <span className="pt-1 text-sm font-bold text-primary-900">{stat.value}</span>
                <span className="text-xs text-grey-600">{stat.caption}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
