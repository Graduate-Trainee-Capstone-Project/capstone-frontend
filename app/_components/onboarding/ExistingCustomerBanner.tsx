"use client";

import {useState} from "react";
import {CrossProductLookupModal} from "@/app/_components/onboarding/CrossProductLookupModal";

interface ExistingCustomerBannerProps {
  onPrefilled: (formData: Record<string, unknown>) => void;
}

/**
 * Shown at the top of every apply flow's identifier-capture screen —
 * product-agnostic, never branches on which subsidiary it's rendered from.
 */
export function ExistingCustomerBanner({onPrefilled}: ExistingCustomerBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-start gap-2 rounded-xl border border-primary-100/40 bg-primary-100/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-grey-700">
          <span className="font-semibold text-primary-400">Already a Stanbic IBTC customer?</span>{" "}
          Verify with your BVN to speed things up.
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="shrink-0 cursor-pointer text-sm font-semibold text-primary-400 hover:text-primary-700 hover:underline"
        >
          Verify now &rarr;
        </button>
      </div>

      <CrossProductLookupModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPrefilled={onPrefilled}
      />
    </>
  );
}
