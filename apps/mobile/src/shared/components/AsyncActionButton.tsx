import React, { useState, useRef } from 'react';
import { SocietyButton, type SocietyButtonProps } from './SocietyButton';

export type AsyncActionError = Error | string;

export interface AsyncActionButtonProps extends Omit<SocietyButtonProps, 'onPress' | 'loading'> {
  readonly onAction: () => Promise<void> | void;
  readonly onError?: (error: AsyncActionError) => void;
  readonly onSuccess?: () => void;
  readonly loadingTitle?: string;
}

export function AsyncActionButton({
  title,
  loadingTitle,
  onAction,
  onError,
  onSuccess,
  disabled = false,
  ...props
}: AsyncActionButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handlePress = async () => {
    if (isSubmittingRef.current || disabled) return;
    try {
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      await onAction();
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
      } else if (typeof error === 'string') {
        onError?.(error);
      } else {
        onError?.(String(error));
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <SocietyButton
      {...props}
      title={isSubmitting && loadingTitle ? loadingTitle : title}
      disabled={disabled || isSubmitting}
      loading={isSubmitting}
      onPress={handlePress}
    />
  );
}

