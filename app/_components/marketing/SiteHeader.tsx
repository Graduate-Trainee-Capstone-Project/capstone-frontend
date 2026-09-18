"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/_constants";
import { BrandLogo } from "@/app/_components/brand/BrandLogo";
import { cn } from "@/app/_utils/cn";

const NAV_LINKS = [
  { href: ROUTES.bank, label: "Bank" },
  { href: ROUTES.pensions, label: "Pension" },
  { href: ROUTES.stockbroking, label: "Stockbroking" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-primary-700">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          href={ROUTES.holdings}
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Stanbic IBTC Holdings home"
        >
          <BrandLogo variant="white" size="md" priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex md:gap-2">
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

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav panel */}
      <div
        className={cn(
          "overflow-hidden transition-[max-height] duration-200 ease-in-out md:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-2 sm:px-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
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
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-primary-100 px-3.5 py-2 text-center text-sm font-semibold text-primary-700 transition-colors duration-150 hover:bg-white"
          >
            Open an account
          </Link>
        </nav>
      </div>
    </header>
  );
}