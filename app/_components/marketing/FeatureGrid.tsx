interface Feature {
  title: string;
  description: string;
}

interface FeatureGridProps {
  heading?: string;
  features: Feature[];
}

export function FeatureGrid({heading, features}: FeatureGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      {heading && <h2 className="mb-6 text-2xl font-semibold text-grey-900">{heading}</h2>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-grey-200 bg-white p-5">
            <h3 className="text-base font-semibold text-grey-900">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-grey-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
