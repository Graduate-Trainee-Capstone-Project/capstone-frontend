interface StepListProps {
  heading?: string;
  description?: string;
  steps: string[];
}

export function StepList({heading, description, steps}: StepListProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      {heading && <h2 className="mb-2 text-2xl font-semibold text-grey-900">{heading}</h2>}
      {description && <p className="mb-6 max-w-2xl text-sm text-grey-600">{description}</p>}
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3 rounded-2xl border border-grey-200 bg-white p-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100/10 text-sm font-semibold text-primary-400">
              {index + 1}
            </span>
            <span className="text-sm font-medium text-grey-800">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
