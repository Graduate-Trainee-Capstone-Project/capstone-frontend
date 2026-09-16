import Link from "next/link";
import {Icon} from "@/app/_ui";
import {ROUTES} from "@/app/_constants";

/** Virtual RSA certificate + yield-tracker visual shown beside the Pensions hero copy. */
export function RsaCardPreview() {
  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl">
      <span className="h-1.5 w-full rounded-full bg-primary-300" />

      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-75">
            <Icon icon="lucide:shield-check" className="size-6 text-primary-500" />
          </span>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-primary-900">Stanbic IBTC RSA</span>
            <span className="text-[11px] font-semibold tracking-wide text-grey-600">PenCom Certified Fund</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-primary-75 px-2.5 py-1 text-[11px] font-semibold text-primary-500">
          Active PIN
        </span>
      </div>

      <div className="flex flex-col gap-3 rounded-xl bg-primary-90 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-600">RSA PIN ID</span>
          <span className="text-sm font-bold text-primary-900">PEN10089201948</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-600">Assigned Allocation</span>
          <span className="text-sm font-semibold text-primary-500">Fund II (Balanced Growth)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-grey-600">Biometric Validation</span>
          <span className="flex items-center gap-1 text-sm text-primary-500">
            <Icon icon="lucide:check" className="size-4" />
            PenCom Synced
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-grey-600">Annualized Yield Tracker (Fund II)</span>
          <span className="text-[11px] font-bold tracking-wide text-primary-500">+14.62% p.a.</span>
        </div>
        <div className="flex h-16 w-full items-end gap-1 rounded-xl bg-primary-90 p-3">
          {[40, 55, 48, 62, 58, 72, 68, 80, 76, 90].map((height, index) => (
            <span key={index} className="flex-1 rounded-full bg-primary-300" style={{height: `${height}%`}} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-xs text-grey-600">
          <Icon icon="lucide:shield" className="size-4 text-grey-500" />
          Protected by NDIC &amp; Custodian
        </span>
        <Link href={`${ROUTES.apply("PENSION_RSA")}`} className="text-sm font-semibold text-primary-500">
          Start in 5 mins →
        </Link>
      </div>
    </div>
  );
}
