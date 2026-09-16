"use client";

import {useState} from "react";
import toast from "react-hot-toast";
import {useRequestBvnOtp, useVerifyBvnOtp} from "@/app/_hooks";
import {Modal} from "@/app/_ui/Modal";
import {Input} from "@/app/_ui/Input";
import {Checkbox} from "@/app/_ui/Checkbox";
import {Button} from "@/app/_ui/Button";
import {isValidBVN} from "@/app/_utils/validators";

interface CrossProductLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the matched customer's formData — caller decides how to merge it in. */
  onPrefilled: (formData: Record<string, unknown>) => void;
}

/**
 * Product-agnostic "already a customer?" shortcut. Verifies a BVN via OTP,
 * then — regardless of which subsidiary this modal was opened from — looks
 * the BVN up against the shared customer-keyed identifier index and hands
 * back whatever profile data exists, so any apply flow can prefill from it.
 */
export function CrossProductLookupModal({isOpen, onClose, onPrefilled}: CrossProductLookupModalProps) {
  const requestOtp = useRequestBvnOtp();
  const verifyOtp = useVerifyBvnOtp();

  const [stage, setStage] = useState<"BVN" | "OTP">("BVN");
  const [bvn, setBvn] = useState("");
  const [bvnError, setBvnError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [consented, setConsented] = useState(false);
  const [consentError, setConsentError] = useState("");

  function resetAndClose() {
    setStage("BVN");
    setBvn("");
    setBvnError("");
    setOtp("");
    setOtpError("");
    setOtpToken("");
    setMaskedPhone("");
    setConsented(false);
    setConsentError("");
    onClose();
  }

  function handleRequestOtp(event: React.FormEvent) {
    event.preventDefault();
    const result = isValidBVN(bvn);
    if (!result.valid) {
      setBvnError(result.message ?? "Enter a valid BVN.");
      return;
    }
    setBvnError("");

    requestOtp.mutate(
      {bvn: bvn.trim()},
      {
        onSuccess: (data) => {
          setOtpToken(data.otpToken);
          setMaskedPhone(data.maskedPhone);
          setStage("OTP");
          toast.success(`Code sent to ${data.maskedPhone}. (Demo code: 0000)`);
        },
        onError: (error) => setBvnError(error.message || "Couldn't send a code. Please try again."),
      },
    );
  }

  function handleVerifyOtp(event: React.FormEvent) {
    event.preventDefault();
    if (!consented) {
      setConsentError("Please confirm your consent to continue.");
      return;
    }
    setConsentError("");

    verifyOtp.mutate(
      {otpToken, otp: otp.trim(), bvn: bvn.trim()},
      {
        onSuccess: (data) => {
          if (data.matched && data.formData) {
            onPrefilled(data.formData);
            toast.success("Found your profile — we've prefilled what we can.");
          } else {
            toast("No existing profile found for that BVN. Continue below as normal.");
          }
          resetAndClose();
        },
        onError: (error) => setOtpError(error.message || "Couldn't verify that code. Please try again."),
      },
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title="Verify with your BVN">
      {stage === "BVN" ? (
        <form onSubmit={handleRequestOtp} className="flex flex-col gap-4">
          <p className="text-sm text-grey-600">
            If you already have an account with any Stanbic IBTC business — Bank, Pension, or Stockbroking — we
            can use your BVN to fetch your details and speed things up.
          </p>
          <Input
            label="Bank Verification Number (BVN)"
            name="lookupBvn"
            inputMode="numeric"
            maxLength={11}
            placeholder="e.g. 12345678901"
            value={bvn}
            onChange={(e) => {
              setBvn(e.target.value);
              setBvnError("");
            }}
            error={bvnError}
            disabled={requestOtp.isPending}
          />
          <Button type="submit" isLoading={requestOtp.isPending} fullWidth>
            Send verification code
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <p className="text-sm text-grey-600">Enter the one-time code sent to {maskedPhone}.</p>
          <Input
            label="One-time code"
            name="lookupOtp"
            inputMode="numeric"
            maxLength={4}
            placeholder="0000"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              setOtpError("");
            }}
            error={otpError}
            disabled={verifyOtp.isPending}
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
          <Button type="submit" isLoading={verifyOtp.isPending} fullWidth>
            Verify
          </Button>
        </form>
      )}
    </Modal>
  );
}
