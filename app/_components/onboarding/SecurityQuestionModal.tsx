"use client";

import {useState} from "react";
import {ApiRequestError, useSecurityCheckQuestions, useSubmitSecurityCheck} from "@/app/_hooks";
import {Input} from "@/app/_components/ui/Input";
import {Button} from "@/app/_components/ui/Button";
import {Skeleton} from "@/app/_components/ui/Skeleton";

interface SecurityQuestionModalProps {
  draftId: string;
  onPassed: () => void;
  onExhausted: () => void;
}

export function SecurityQuestionModal({draftId, onPassed, onExhausted}: SecurityQuestionModalProps) {
  const {data, isLoading, isError} = useSecurityCheckQuestions(draftId);
  const submitCheck = useSubmitSecurityCheck(draftId);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<{message: string; attemptsRemaining?: number} | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-sm text-error-400">Couldn&apos;t load your security questions. Please try again.</p>;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    submitCheck.mutate(
      {
        checkType: "SECURITY_QUESTION",
        answers: data!.questions.map((q) => ({questionId: q.questionId, answer: answers[q.questionId] ?? ""})),
      },
      {
        onSuccess: (result) => {
          if (result.status === "PASSED") {
            onPassed();
          } else {
            setNotice({
              message: "That didn't match our records. Please try again.",
              attemptsRemaining: result.attemptsRemaining,
            });
            setAnswers({});
          }
        },
        onError: (error) => {
          if (error instanceof ApiRequestError && error.code === "SECURITY_CHECK_FAILED") {
            onExhausted();
            return;
          }
          setNotice({message: error.message || "Something went wrong. Please try again."});
        },
      },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-grey-600">
        Since we already have a profile for you, please confirm your identity before continuing.
      </p>
      {data.questions.map((question) => (
        <Input
          key={question.questionId}
          label={question.prompt}
          name={question.questionId}
          value={answers[question.questionId] ?? ""}
          onChange={(event) => setAnswers((prev) => ({...prev, [question.questionId]: event.target.value}))}
          disabled={submitCheck.isPending}
          required
        />
      ))}
      {notice && (
        <p className="text-xs text-error-400">
          {notice.message}
          {typeof notice.attemptsRemaining === "number" && ` ${notice.attemptsRemaining} attempt(s) remaining.`}
        </p>
      )}
      <Button type="submit" isLoading={submitCheck.isPending} fullWidth>
        Verify
      </Button>
    </form>
  );
}
