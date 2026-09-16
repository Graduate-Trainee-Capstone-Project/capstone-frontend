import {Icon} from "@/app/_ui";

interface Step {
  number: number;
  tag: string;
  title: string;
  description: string;
  footnoteIcon: string;
  footnote: string;
  highlighted?: boolean;
}

const STEPS: Step[] = [
  {
    number: 1,
    tag: "Identity",
    title: "Personal Information",
    description:
      "Input your legal name exactly as registered on your BVN and National Identity Number (NIN), date of birth, residential contact, and state of origin.",
    footnoteIcon: "lucide:id-card",
    footnote: "NIN & BVN Auto-Validation",
  },
  {
    number: 2,
    tag: "Career",
    title: "Employment Details",
    description:
      "Provide current employer name, PenCom Employer Code (PR Code), operating industry sector, office address, and estimated monthly salary bracket.",
    footnoteIcon: "lucide:briefcase",
    footnote: "Auto-lookup by PenCom Code",
  },
  {
    number: 3,
    tag: "Estate",
    title: "Next of Kin",
    description:
      "Designate your primary and secondary beneficiaries, relationship (spouse, child, sibling), residential address, and active mobile contact numbers.",
    footnoteIcon: "lucide:users",
    footnote: "Multi-Beneficiary Allocation",
  },
  {
    number: 4,
    tag: "Compliance",
    title: "PEP Declaration",
    description:
      "Statutory Politically Exposed Person (PEP) declaration checkbox and regulatory compliance affirmations per Central Bank and PenCom standards.",
    footnoteIcon: "lucide:file-check",
    footnote: "Sanction & PEP Compliance",
  },
  {
    number: 5,
    tag: "Verification",
    title: "Documents Upload",
    description:
      "Upload crisp snapshots or scans: valid government photo ID (NIN slip, Driver's License, or Int'l Passport), utility bill, and clear passport portrait.",
    footnoteIcon: "lucide:upload",
    footnote: "Instant OCR & Format Audit",
  },
  {
    number: 6,
    tag: "Final Step",
    title: "Review & Submit",
    description:
      "Instant PenCom database synchronization. Receive your official RSA PIN, digital certificate, and automated welcome kit via SMS and email.",
    footnoteIcon: "lucide:send",
    footnote: "Immediate RSA PIN Issuance",
    highlighted: true,
  },
];

/** "How Registration Works" 6-step grid plus the employer eligibility mini-tool. */
export function RegistrationStepsGrid() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex max-w-2xl flex-col items-center gap-2 self-center text-center">
          <span className="text-xs font-semibold tracking-wide text-primary-500 uppercase">
            Digital RSA Onboarding
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-primary-900 sm:text-3xl">How Registration Works</h2>
          <p className="text-sm text-grey-600">
            Open your Retirement Savings Account entirely online in 6 quick stages. Real-time PenCom verification
            provides immediate RSA PIN assignment.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) =>
            step.highlighted ? (
              <div key={step.number} className="flex flex-col justify-between gap-6 rounded-2xl bg-primary-500 p-6 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-white text-base font-bold text-primary-500">
                      {step.number}
                    </span>
                    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="pt-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-white/90">{step.description}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3">
                  <Icon icon={step.footnoteIcon} className="size-[18px] shrink-0 text-white" />
                  <span className="text-[11px] font-medium tracking-wide text-white">{step.footnote}</span>
                </div>
              </div>
            ) : (
              <div key={step.number} className="flex flex-col justify-between gap-6 rounded-2xl bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary-500 text-base font-semibold text-white">
                      {step.number}
                    </span>
                    <span className="rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-primary-900">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="pt-2 text-lg font-semibold text-primary-900">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-grey-600">{step.description}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-primary-90 p-3">
                  <Icon icon={step.footnoteIcon} className="size-[18px] shrink-0 text-primary-500" />
                  <span className="text-[11px] font-medium tracking-wide text-primary-900">{step.footnote}</span>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-primary-90 pb-6 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-primary-900">Test Your PenCom Eligibility Check</h3>
              <p className="text-sm text-grey-600">
                Check if your employer already has an active Stanbic IBTC remittance code
              </p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Enter 9-digit PenCom Employer Code"
                className="w-64 rounded-xl bg-primary-90 px-4 py-3 text-sm text-primary-900 placeholder:text-grey-500 focus:outline-none"
              />
              <button
                type="button"
                className="rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700"
              >
                Verify Employer
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Icon icon="lucide:info" className="size-[18px] shrink-0 text-primary-500" />
            <p className="text-sm text-primary-500">
              You can register even if your employer is unlisted — we automatically generate their employer
              notification schedule.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
