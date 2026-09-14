"use client";

import {useEffect} from "react";
import type {ReactNode} from "react";
import {cn} from "@/app/_utils/cn";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** When true, hides the close affordance — used for flows that must run to completion (e.g. security checks). */
  dismissible?: boolean;
}

/**
 * Simple centered overlay, no portal library — fixed-position overlay is
 * enough for this app's single-page-at-a-time layout.
 */
export function Modal({isOpen, onClose, title, children, className, dismissible = true}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full max-w-md rounded-2xl bg-white p-6 shadow-xl",
          className,
        )}
      >
        {(title || (dismissible && onClose)) && (
          <div className="mb-4 flex items-center justify-between">
            {title && <h3 className="text-lg font-semibold text-grey-900">{title}</h3>}
            {dismissible && onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-grey-500 hover:text-grey-800 cursor-pointer text-xl leading-none"
              >
                &times;
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
