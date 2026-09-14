"use client";

import {Toaster} from "react-hot-toast";

/**
 * Centralized toast styling so every screen's toast.success/toast.error/toast()
 * calls automatically pick up Stanbic IBTC's palette from app/_styles/globals.css
 * instead of react-hot-toast's defaults.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--color-white)",
          color: "var(--color-grey-900)",
          border: "1px solid var(--color-grey-200)",
          boxShadow: "0 4px 12px rgba(16, 25, 40, 0.08)",
          fontSize: "14px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "var(--color-success-400)",
            secondary: "var(--color-white)",
          },
          style: {
            border: "1px solid var(--color-success-100)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-error-400)",
            secondary: "var(--color-white)",
          },
          style: {
            border: "1px solid var(--color-error-100)",
          },
        },
      }}
    />
  );
}
