import Link from "next/link";
import {ROUTES} from "@/app/_constants";
import {BrandLogo} from "@/app/_components/brand/BrandLogo";

export function SiteFooter() {
  return (
    <footer className="border-t border-grey-200 bg-grey-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <BrandLogo variant="blue" size="sm" />
          <div className="flex flex-wrap gap-4 text-sm text-grey-500">
            <Link href={ROUTES.bank} className="hover:text-grey-800">
              Bank
            </Link>
            <Link href={ROUTES.pensions} className="hover:text-grey-800">
              Pension
            </Link>
            <Link href={ROUTES.stockbroking} className="hover:text-grey-800">
              Stockbroking
            </Link>
            <Link href={ROUTES.applySubsidiary("investment")} className="hover:text-grey-800">
              Investment
            </Link>
            <Link href={ROUTES.home} className="hover:text-grey-800">
              Open an account
            </Link>
          </div>
        </div>
        <p className="text-xs text-grey-400">
          &copy; {new Date().getFullYear()} Stanbic IBTC Holdings. A member of Standard Bank Group. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
