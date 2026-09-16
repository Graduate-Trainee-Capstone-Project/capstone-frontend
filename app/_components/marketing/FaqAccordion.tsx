import {Icon} from "@/app/_ui";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  badge: string;
  heading: string;
  description: string;
  items: FaqItem[];
}

/**
 * FAQ accordion built with native `<details>`/`<summary>` — no client JS
 * needed for expand/collapse, and the chevron rotates via the `[open]` CSS
 * state selector.
 */
export function FaqAccordion({badge, heading, description, items}: FaqAccordionProps) {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full bg-primary-75 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
            {badge}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">{heading}</h2>
          <p className="text-sm text-grey-600">{description}</p>
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <details key={item.question} className="group rounded-xl bg-primary-90 open:bg-primary-90">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-base font-semibold text-primary-900">
                {item.question}
                <Icon
                  icon="lucide:chevron-down"
                  className="size-6 shrink-0 text-grey-600 transition-transform duration-150 group-open:rotate-180"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-grey-600">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
