import {Icon} from "@/app/_ui";

interface Capability {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

interface CapabilitiesGridProps {
  badge: string;
  heading: string;
  description: string;
  capabilities: Capability[];
}

/** "What we offer" capability cards grid for the Bank page. */
export function CapabilitiesGrid({badge, heading, description, capabilities}: CapabilitiesGridProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex max-w-2xl flex-col items-center gap-2 text-center">
          <span className="rounded-full bg-primary-75 px-3 py-1 text-xs font-semibold tracking-wide text-primary-500">
            {badge}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">{heading}</h2>
          <p className="pt-1 text-sm text-grey-600">{description}</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((capability) => (
            <div
              key={capability.title}
              className="flex flex-col gap-4 rounded-2xl bg-primary-90 p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-75">
                <Icon icon={capability.icon} className="size-6 text-primary-500" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-primary-900">{capability.title}</h3>
                <p className="text-xs leading-relaxed text-grey-600">{capability.description}</p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Icon icon="lucide:check" className="size-4 text-primary-500" />
                <span className="text-[11px] font-semibold tracking-wide text-primary-500">
                  {capability.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
