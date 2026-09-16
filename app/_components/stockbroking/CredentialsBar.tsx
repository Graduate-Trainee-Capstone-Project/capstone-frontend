import {Icon} from "@/app/_ui";

const CREDENTIALS = [
  {
    icon: "lucide:trophy",
    title: "#1 Stockbroker",
    description: "Ranked #1 by transaction value on the Nigerian Exchange for multiple consecutive years.",
  },
  {
    icon: "lucide:shield-check",
    title: "CSCS Guaranteed",
    description: "Automated depository clearing via Central Securities Clearing System with instant trade alerts.",
  },
  {
    icon: "lucide:banknote",
    title: "\u20a6 Trillion+ Volume",
    description: "Deep liquidity provider facilitating sovereign block trades, cross-border equity, and capital deals.",
  },
  {
    icon: "lucide:badge-check",
    title: "Full SEC Compliance",
    description: "Rigorous institutional oversight, audited capital adequacy, and strict investor protection charters.",
  },
];

/** Dark trust-and-credentials strip beneath the Stockbroking hero. */
export function CredentialsBar() {
  return (
    <section className="bg-primary-900">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {CREDENTIALS.map((item) => (
          <div key={item.title} className="flex items-start gap-4 rounded-xl bg-white/5 p-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-500">
              <Icon icon={item.icon} className="size-5 text-white" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="text-base font-bold text-white">{item.title}</span>
              <p className="text-xs leading-relaxed text-primary-50/80">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
