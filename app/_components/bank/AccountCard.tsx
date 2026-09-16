import Link from "next/link";
import {Icon} from "@/app/_ui";

interface AccountStat {
  label: string;
  value: string;
}

interface AccountCardProps {
  tag: string;
  segment: string;
  title: string;
  description: string;
  stats: [AccountStat, AccountStat, AccountStat, AccountStat];
  features: string[];
  cta: {label: string; href: string};
  footnote: string;
  accent: "primary" | "dark";
}

/** Flagship account comparison card (Savings / Current) for the Bank page. */
export function AccountCard({tag, segment, title, description, stats, features, cta, footnote, accent}: AccountCardProps) {
  const isDark = accent === "dark";

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-white p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1.5 ${isDark ? "bg-primary-900" : "bg-primary-500"}`} />

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-primary-75 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-900">
            {tag}
          </span>
          <span className="text-[11px] font-semibold tracking-wide text-grey-600">{segment}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-semibold tracking-tight text-primary-900">{title}</h3>
          <p className="text-sm text-grey-600">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl bg-primary-90 p-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold tracking-wide text-grey-600">{stat.label}</span>
              <span className="text-xl font-semibold tracking-tight text-primary-900">{stat.value}</span>
            </div>
          ))}
        </div>

        <ul className="flex flex-col gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-primary-900">
              <Icon icon="lucide:check-circle-2" className="mt-0.5 size-5 shrink-0 text-primary-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2 pt-8">
        <Link
          href={cta.href}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 ${
            isDark ? "bg-primary-900 hover:bg-primary-700" : "bg-primary-500 hover:bg-primary-300"
          }`}
        >
          {cta.label}
          <Icon icon="lucide:arrow-right" className="size-[18px]" />
        </Link>
        <p className="text-center text-[11px] text-grey-600">{footnote}</p>
      </div>
    </div>
  );
}
