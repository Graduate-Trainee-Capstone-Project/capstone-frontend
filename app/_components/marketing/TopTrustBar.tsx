import {Icon} from "@/app/_ui";

interface TrustBarStat {
  icon: string;
  label: string;
}

interface TopTrustBarProps {
  badge: string;
  caption: string;
  stats: TrustBarStat[];
}

/** Thin sovereign-trust strip shown at the very top of a subsidiary landing page. */
export function TopTrustBar({badge, caption, stats}: TopTrustBarProps) {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary-900">
            {badge}
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-grey-800">{caption}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <Icon icon={stat.icon} className="size-4 text-primary-500" />
              <span className="text-xs font-medium text-primary-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
