import {Icon} from "@/app/_ui";

/** Synthetic debit-card + ledger visual shown beside the Bank page hero copy. */
export function DebitCardPreview() {
  return (
    <div className="flex w-full flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-700 shadow-inner">
            <Icon icon="lucide:landmark" className="size-5 text-white" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-primary-900">Stanbic IBTC Digital Bank</span>
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">Tier-1 Institutional Custody</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-500">
          Live Gateway
        </span>
      </div>

      <div className="relative flex w-full flex-col gap-6 overflow-hidden rounded-xl bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500 p-6 shadow-lg">
        <div aria-hidden className="pointer-events-none absolute -top-6 right-0 size-36 rounded-full bg-primary-300/20 blur-[12px]" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] tracking-wide text-white/70 uppercase">Stanbic IBTC Platinum Debit</span>
            <span className="text-lg font-semibold tracking-wide text-white">Priority Pass</span>
          </div>
          <Icon icon="lucide:wifi" className="size-7 rotate-90 text-white" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm text-white/75">Encrypted Card Number</span>
          <span className="text-xl font-semibold tracking-[0.2em] text-white">5399 •••• •••• 2841</span>
        </div>

        <div className="flex items-center justify-between text-white/80">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] tracking-wide uppercase">Account Holder</span>
            <span className="text-[11px] font-semibold tracking-wide">CHUKWUDI E. OKONKWO</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] tracking-wide uppercase">Valid Thru</span>
            <span className="text-[11px] font-semibold tracking-wide">09/29</span>
          </div>
          <span className="flex h-5 w-8 items-center justify-center rounded bg-white/20 text-[9px] font-bold text-white">
            CHIP
          </span>
        </div>
      </div>

      <div className="flex w-full flex-col gap-2 rounded-xl bg-primary-90 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide text-grey-600">Daily Interest Yield Rate</span>
          <span className="text-[11px] font-bold tracking-wide text-primary-500">7.50% p.a.</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-primary-75">
          <div className="h-full w-4/5 rounded-full bg-primary-500" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-grey-600">Automated Monthly Payout</span>
          <span className="text-[11px] font-semibold text-primary-900">Compounded Daily</span>
        </div>
      </div>

      <div className="flex w-full items-center gap-3 rounded-xl bg-primary-75 p-3">
        <Icon icon="lucide:fingerprint" className="size-5 shrink-0 text-primary-500" />
        <span className="text-xs font-semibold tracking-wide text-primary-900">
          Multi-Factor Biometrics, Tokenized Virtual Cards, &amp; 3D Secure 2.2
        </span>
      </div>
    </div>
  );
}
