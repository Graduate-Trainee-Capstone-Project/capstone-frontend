const STEPS = [
  {
    number: 1,
    title: "Identity Clearance",
    description:
      "Input verified BVN/NIN for individuals or upload CAC certificate bundle for corporates. Instant automated sanction checks.",
  },
  {
    number: 2,
    title: "CSCS Account Creation",
    description:
      "Your Clearing House Number (CHN) is generated or existing CSCS depository account mapped for unified stock holdings.",
  },
  {
    number: 3,
    title: "Direct Account Funding",
    description:
      "Transfer trading capital securely into your dedicated brokerage settlement account via instant NIP or institutional RTGS.",
  },
  {
    number: 4,
    title: "Execute & Settle",
    description:
      "Trade NGX equities and buy T-Bills. Positions clear at T+2 directly to your depository, with contract notes sent via email.",
    highlighted: true,
  },
];

/** "How Your Trading Mandate Operates" 4-step process grid. */
export function TradingStepsGrid() {
  return (
    <section className="bg-primary-90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-16">
        <div className="flex max-w-2xl flex-col items-center gap-2 self-center text-center">
          <span className="text-xs font-bold tracking-wide text-primary-500 uppercase">Standardized Capital Flow</span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">
            How Your Trading Mandate Operates
          </h2>
          <p className="text-sm text-grey-600">
            Seamless transition from registration to live execution on the trading floor.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
              <span
                className={`flex size-10 items-center justify-center rounded-full text-base font-bold text-white ${
                  step.highlighted ? "bg-primary-900" : "bg-primary-500"
                }`}
              >
                {step.number}
              </span>
              <h3 className="pt-1 text-base font-bold text-primary-900">{step.title}</h3>
              <p className="text-xs leading-relaxed text-grey-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
