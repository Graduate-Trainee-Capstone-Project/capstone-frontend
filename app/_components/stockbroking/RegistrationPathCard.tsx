import Link from "next/link";
import {Icon} from "@/app/_ui";

interface RegistrationPathCardProps {
  tag: string;
  duration: string;
  title: string;
  description: string;
  clientele: string[];
  featuresHeading: string;
  features: {title: string; description: string}[];
  documentsHeading: string;
  documentsCaption: string;
  documents: string[];
  cta: {label: string; href: string};
  footnote: string;
  accent: "primary" | "dark";
}

/** Individuals / Corporates onboarding-path card for the Stockbroking page. */
export function RegistrationPathCard({
  tag,
  duration,
  title,
  description,
  clientele,
  featuresHeading,
  features,
  documentsHeading,
  documentsCaption,
  documents,
  cta,
  footnote,
  accent,
}: RegistrationPathCardProps) {
  const isDark = accent === "dark";

  return (
    <div className="flex flex-1 flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <span aria-hidden className={`block h-2 w-full ${isDark ? "bg-primary-700" : "bg-primary-500"}`} />

      <div className="flex flex-col gap-8 p-8 sm:p-10">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                isDark ? "bg-primary-75 text-primary-900" : "bg-primary-75 text-primary-500"
              }`}
            >
              {tag}
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-grey-600">
              <Icon icon="lucide:clock" className="size-4" />
              {duration}
            </span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-primary-900">{title}</h3>
          <p className="text-sm text-grey-600">{description}</p>
        </div>

        <div className="flex flex-col gap-2 rounded-xl bg-primary-90 p-4">
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-primary-900 uppercase">
            <Icon icon="lucide:users" className="size-4" />
            Target Clientele
          </span>
          <div className="flex flex-wrap gap-2">
            {clientele.map((item) => (
              <span key={item} className="rounded-md bg-primary-75 px-2.5 py-1 text-xs font-medium text-primary-900">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-base font-bold text-primary-900">{featuresHeading}</h4>
          <ul className="flex flex-col gap-3">
            {features.map((feature) => (
              <li key={feature.title} className="flex items-start gap-3 text-sm text-primary-900">
                <Icon icon="lucide:check" className="mt-0.5 size-5 shrink-0 text-primary-500" />
                <span>
                  <span className="font-bold">{feature.title}</span> {feature.description}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-primary-900">{documentsHeading}</h4>
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">{documentsCaption}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {documents.map((doc) => (
              <span
                key={doc}
                className="flex items-center gap-2 rounded-xl bg-primary-75 px-3 py-3 text-[11px] font-semibold text-primary-900"
              >
                <Icon icon="lucide:file-check" className="size-4 shrink-0 text-primary-500" />
                {doc}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-8 pt-0 sm:p-10 sm:pt-0">
        <Link
          href={cta.href}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-semibold text-white shadow-sm transition-colors duration-150 ${
            isDark ? "bg-primary-700 hover:bg-primary-500" : "bg-primary-500 hover:bg-primary-300"
          }`}
        >
          {cta.label}
        </Link>
        <p className="text-center text-[11px] text-grey-600">{footnote}</p>
      </div>
    </div>
  );
}
