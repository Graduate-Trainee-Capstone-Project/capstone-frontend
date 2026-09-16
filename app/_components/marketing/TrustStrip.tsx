import {Icon} from "@/app/_ui/Icon";

const STATS = [
  {
    icon: "lucide:shield-check",
    eyebrow: "Regulatory Standard",
    value: "CBN Licensed",
    caption: "PenCom & SEC Monitored",
  },
  {
    icon: "lucide:trending-up",
    eyebrow: "Assets Managed",
    value: "> ₦4.5 Trillion",
    caption: "Sovereign Custody Scale",
  },
  {
    icon: "lucide:users",
    eyebrow: "Active Clients",
    value: "> 4,000,000",
    caption: "Across Retail & Corporate",
  },
  {
    icon: "lucide:shield-half",
    eyebrow: "Cyber Governance",
    value: "ISO 27001",
    caption: "NDPR Compliant Cloud",
  },
  {
    icon: "lucide:globe",
    eyebrow: "Global Heritage",
    value: "Standard Bank",
    caption: "Africa's Largest Bank Group",
  },
];

/** Quick-stats / trust strip directly below the hero. */
export function TrustStrip() {
  return (
    <section className="bg-white shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {STATS.map((stat) => (
          <div key={stat.eyebrow} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon icon={stat.icon} className="size-[18px] shrink-0 text-primary-500" />
              <span className="text-[11px] font-semibold tracking-wide text-grey-600 uppercase">
                {stat.eyebrow}
              </span>
            </div>
            <span className="text-lg font-bold text-primary-900">{stat.value}</span>
            <span className="text-xs text-grey-600">{stat.caption}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
