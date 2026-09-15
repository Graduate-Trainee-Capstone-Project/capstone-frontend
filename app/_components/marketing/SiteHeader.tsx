"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {ROUTES} from "@/app/_constants";
import {cn} from "@/app/_utils/cn";

const NAV_LINKS = [
  {href: ROUTES.bank, label: "Bank"},
  {href: ROUTES.pensions, label: "Pension"},
  {href: ROUTES.stockbroking, label: "Stockbroking"},
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-primary-700">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href={ROUTES.holdings} className="flex flex-col leading-tight">
          <span className="text-base font-bold text-white">Stanbic IBTC</span>
          <span className="text-[11px] font-medium tracking-wide text-primary-100/80">HOLDINGS</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-primary-100/80 hover:bg-white/5 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ROUTES.home}
            className="ml-1 rounded-lg bg-primary-100 px-3.5 py-2 text-sm font-semibold text-primary-700 transition-colors duration-150 hover:bg-white"
          >
            Open an account
          </Link>
        </nav>
      </div>
    </header>
  );
}
