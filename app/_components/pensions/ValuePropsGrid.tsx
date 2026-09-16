import {Icon} from "@/app/_ui";

interface ValueProp {
  icon: string;
  tag: string;
  title: string;
  description: string;
  accent: string;
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: "lucide:users",
    tag: "Market Pioneer",
    title: "2M+ Contributors",
    description:
      "Nigeria's largest private pension family. Over two million working professionals and retirees rely on our prompt disbursements.",
    accent: "bg-primary-500",
  },
  {
    icon: "lucide:layers",
    tag: "Funds I through VI",
    title: "Multi-Fund Structure",
    description:
      "Tailored risk options across Funds I, II, III, IV, and ethical Non-Interest Fund VI to match every career stage and lifestyle goal.",
    accent: "bg-primary-300",
  },
  {
    icon: "lucide:heart-handshake",
    tag: "Dedicated Planners",
    title: "Retirement Advisory",
    description:
      "Personalized pre-retirement clinics, programmed withdrawal analysis, annuity comparison, and estate planning support.",
    accent: "bg-primary-900",
  },
  {
    icon: "lucide:repeat",
    tag: "Transfer in 3 Clicks",
    title: "Seamless Transfer Window",
    description:
      "Switching from another PFA? PenCom's Transfer Window protocol makes account migration 100% digital, paperless, and frictionless.",
    accent: "bg-primary-100",
  },
];

/** "Why Nigeria Trusts Stanbic IBTC Pension Managers" bento grid. */
export function ValuePropsGrid() {
  return (
    <section className="bg-grey-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <span className="w-fit text-xs font-semibold tracking-wide text-primary-500 uppercase">
              Institutional Advantage
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
              Why Nigeria Trusts Stanbic IBTC Pension Managers
            </h2>
          </div>
          <p className="max-w-md text-sm text-grey-600">
            Two decades of unbroken regulatory compliance, prudent asset stewardship, and industry-leading retiree
            satisfaction.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 pl-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <span aria-hidden className={`absolute top-6 left-0 h-12 w-1.5 rounded-full ${prop.accent}`} />
              <div className="flex flex-col gap-2">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary-75">
                  <Icon icon={prop.icon} className="size-6 text-primary-500" />
                </span>
                <h3 className="pt-2 text-lg font-semibold text-primary-900">{prop.title}</h3>
                <p className="text-xs leading-relaxed text-grey-600">{prop.description}</p>
              </div>
              <span className="flex items-center gap-1 pt-6 text-[11px] font-semibold tracking-wide text-primary-500">
                {prop.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
