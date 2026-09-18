"use client";

import { useState } from "react";
import { Input } from "@/app/_ui/Input";
import { Button } from "@/app/_ui/Button";

interface OtpVerificationModalProps {
  onPassed: () => void;
}

const OTP_PATTERN = /^\d{6}$/;

/**
 * Mocked, client-side only — matches ExistingCustomerBanner's OTP gate
 * (docs/justin-backend-alignment-briefing.md). Any 6 digits pass; there is
 * no real OTP to check against, so this never calls submitSecurityCheckAction.
 */
export function OtpVerificationModal({ onPassed }: OtpVerificationModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!OTP_PATTERN.test(otp.trim())) {
      setError("Enter the 6-digit code.");
      return;
    }
    onPassed();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-grey-600">
        We&apos;ve sent a 6-digit code to your registered phone number. Enter it below to continue.
      </p>
      <Input
        label="One-time code"
        name="securityOtp"
        inputMode="numeric"
        maxLength={6}
        placeholder="000000"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value);
          setError("");
        }}
        error={error}
        required
      />
      <Button type="submit" fullWidth>
        Verify
      </Button>
    </form>
  );
}
