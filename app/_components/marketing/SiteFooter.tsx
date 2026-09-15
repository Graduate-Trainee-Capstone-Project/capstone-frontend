import Link from "next/link";
import {ROUTES} from "@/app/_constants";

export function SiteFooter() {
  return (
    <footer className="border-t border-grey-200 bg-grey-50">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-grey-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} Stanbic IBTC Holdings. All rights reserved.</p>
        <div className="flex flex-wrap gap-4">
          <Link href={ROUTES.bank} className="hover:text-grey-800">
            Bank
          </Link>
          <Link href={ROUTES.pensions} className="hover:text-grey-800">
            Pension
          </Link>
          <Link href={ROUTES.stockbroking} className="hover:text-grey-800">
            Stockbroking
          </Link>
          <Link href={ROUTES.home} className="hover:text-grey-800">
            Open an account
          </Link>
        </div>
      </div>
    </footer>
  );
}
