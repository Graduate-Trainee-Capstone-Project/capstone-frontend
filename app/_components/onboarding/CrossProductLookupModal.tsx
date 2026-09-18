"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useLookupCustomer } from "@/app/_hooks";
import { Modal } from "@/app/_ui/Modal";
import { Input } from "@/app/_ui/Input";
import { Checkbox } from "@/app/_ui/Checkbox";
import { Button } from "@/app/_ui/Button";
import { IDENTIFIER_META } from "@/app/_constants";
import { normalizePhone, validateIdentifier } from "@/app/_utils/validators";
import type { IdentifierType } from "@/app/_types";

interface CrossProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifierType?: IdentifierType;
  /** Called with the matched customer's formData — caller decides how to merge it in. */
  onPrefilled: (formData: Record<string, unknown>) => void;
}

const OTP_PATTERN = /^\d{6}$/;

/**
 * Product-agnostic "already a customer?" shortcut. OTP is client-side only
 * (any 6 digits). After that gate, POST /customers/lookup hits the live API.
 */
export function CrossProductLookupModal({
  isOpen,
  onClose,
  identifierType = "BVN",
  onPrefilled,
}: CrossProductLookupModalProps) {
  const lookupCustomer = useLookupCustomer();
  const identifierMeta = IDENTIFIER_META[identifierType];

  const [stage, setStage] = useState<"IDENTIFIER" | "OTP">("IDENTIFIER");
  const [identifierValue, setIdentifierValue] = useState("");
  const [identifierError, setIdentifierError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [consented, setConsented] = useState(false);
  const [consentError, setConsentError] = useState("");

  function resetAndClose() {
    setStage("IDENTIFIER");
    setIdentifierValue("");
    setIdentifierError("");
    setOtp("");
    setOtpError("");
    setConsented(false);
    setConsentError("");
    onClose();
  }

  function handleRequestOtp(event: React.FormEvent) {
    event.preventDefault();
    const result = validateIdentifier(identifierType, identifierValue);
    if (!result.valid) {
      setIdentifierError(result.message ?? "Enter a valid value.");
      return;
    }
    setIdentifierError("");
    setStage("OTP");
  }

  function handleVerifyOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!OTP_PATTERN.test(otp.trim())) {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    if (!consented) {
      setConsentError("Please confirm your consent to continue.");
      return;
    }
    setOtpError("");
    setConsentError("");

    const value =
      identifierType === "PHONE" ? normalizePhone(identifierValue) : identifierValue.trim();

    lookupCustomer.mutate(
      { identifierType, identifierValue: value },
      {
        onSuccess: (data) => {
          if (data.matched && data.formData) {
            onPrefilled(data.formData);
            toast.success("Found your profile — we've prefilled what we can.");
          } else {
            toast("No existing profile found for that identifier. Continue below as normal.");
          }
          resetAndClose();
        },
        onError: (error) => setOtpError(error.message || "Couldn't look up that profile. Please try again."),
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={`Verify with your ${identifierType}`}>
      {stage === "IDENTIFIER" ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <p className="text-sm text-grey-600">
            If you already have an account with any Stanbic IBTC business — Bank, Pension, or Stockbroking — we
            can fetch your details and speed things up.
          </p>
          <Input
            label={identifierMeta.label}
            name="lookupIdentifier"
            inputMode={identifierMeta.inputMode}
            maxLength={identifierMeta.maxLength}
            placeholder={identifierMeta.placeholder}
            value={identifierValue}
            onChange={(e) => {
              setIdentifierValue(e.target.value);
              setIdentifierError("");
            }}
            error={identifierError}
          />
          <Button type="submit" fullWidth>
            Continue
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <p className="text-sm text-grey-600">Enter the 6-digit one-time code to continue.</p>
          <Input
            label="One-time code"
            name="lookupOtp"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setOtpError("");
            }}
            error={otpError}
            disabled={lookupCustomer.isPending}
            required
          />
          <Checkbox
            label="I consent to Stanbic IBTC retrieving and reusing my existing KYC details to prefill this application."
            checked={consented}
            onChange={(e) => {
              setConsented(e.target.checked);
              if (e.target.checked) setConsentError("");
            }}
            error={consentError}
          />
          <Button type="submit" isLoading={lookupCustomer.isPending} fullWidth>
            Verify
          </Button>
        </form>
      )}
    </Modal>
  );
}
