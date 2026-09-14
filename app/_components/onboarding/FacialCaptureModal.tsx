"use client";

import {useEffect, useRef, useState} from "react";
import {ApiRequestError, useSubmitSecurityCheck} from "@/app/_hooks";
import {Button} from "@/app/_components/ui/Button";
import {Spinner} from "@/app/_components/ui/Spinner";

interface FacialCaptureModalProps {
  draftId: string;
  onPassed: () => void;
  onExhausted: () => void;
}

export function FacialCaptureModal({draftId, onPassed, onExhausted}: FacialCaptureModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const submitCheck = useSubmitSecurityCheck(draftId);

  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    navigator.mediaDevices
      ?.getUserMedia({video: true})
      .then((stream) => {
        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraError("Couldn't access your camera. You can still simulate capture below."));

    return () => {
      isMounted = false;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function handleSimulateCapture() {
    setIsCapturing(true);
    setNotice(null);

    // Brief artificial delay so "capture" feels real before the mocked check fires.
    setTimeout(() => {
      submitCheck.mutate(
        {checkType: "FACIAL_RECOGNITION"},
        {
          onSuccess: (result) => {
            setIsCapturing(false);
            if (result.status === "PASSED") {
              onPassed();
            } else {
              setNotice("We couldn't verify your face. Please try again.");
            }
          },
          onError: (error) => {
            setIsCapturing(false);
            if (error instanceof ApiRequestError && error.code === "SECURITY_CHECK_FAILED") {
              onExhausted();
              return;
            }
            setNotice(error.message || "Something went wrong. Please try again.");
          },
        },
      );
    }, 900);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-grey-600">Position your face in the frame and simulate a capture.</p>
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-grey-900">
        {cameraError ? (
          <p className="p-4 text-center text-xs text-grey-200">{cameraError}</p>
        ) : (
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
        )}
        {isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Spinner tone="light" size="lg" />
          </div>
        )}
      </div>
      {notice && <p className="text-xs text-error-400">{notice}</p>}
      <Button onClick={handleSimulateCapture} isLoading={isCapturing || submitCheck.isPending} fullWidth>
        Simulate capture
      </Button>
    </div>
  );
}
