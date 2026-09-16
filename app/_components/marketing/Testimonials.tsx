import {Icon} from "@/app/_ui";

interface Testimonial {
  quote: string;
  initials: string;
  name: string;
  role: string;
}

interface TestimonialsProps {
  badge: string;
  heading: string;
  description: string;
  testimonials: Testimonial[];
}

/** Star-rated customer quote cards used across subsidiary landing pages. */
export function Testimonials({badge, heading, description, testimonials}: TestimonialsProps) {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex max-w-2xl flex-col items-center gap-3 text-center">
          <span className="rounded-full bg-primary-75 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-500 uppercase">
            {badge}
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">{heading}</h2>
          <p className="text-sm text-grey-600">{description}</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({length: 5}).map((_, index) => (
                    <Icon key={index} icon="lucide:star" className="size-[18px] fill-warning-400 text-warning-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-grey-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
              <div className="flex items-center gap-3 border-t border-primary-90 pt-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-75 text-sm font-bold text-primary-500">
                  {testimonial.initials}
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-primary-900">{testimonial.name}</span>
                  <span className="text-[11px] font-semibold tracking-wide text-grey-600">{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
