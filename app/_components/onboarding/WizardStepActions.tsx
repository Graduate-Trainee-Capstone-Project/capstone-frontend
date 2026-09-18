'use client';

import {Button} from '@/app/_ui/Button';

interface WizardStepActionsProps {
  onBack?: () => void;
  hideBack?: boolean;
  onSaveLater?: () => void;
  continueLabel?: string;
  isLoading?: boolean;
}

export function WizardStepActions({
  onBack,
  hideBack,
  onSaveLater,
  continueLabel = 'Continue',
  isLoading,
}: WizardStepActionsProps) {
  return (
    <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex flex-col-reverse gap-3 sm:flex-row'>
        {!hideBack && onBack ? (
          <Button type='button' variant='secondary' onClick={onBack} disabled={isLoading}>
            Back
          </Button>
        ) : null}
        {onSaveLater ? (
          <Button
            type='button'
            variant='secondary'
            onClick={onSaveLater}
            isLoading={isLoading}
          >
            Save and continue later
          </Button>
        ) : null}
      </div>
      <Button type='submit' isLoading={isLoading}>
        {continueLabel}
      </Button>
    </div>
  );
}
