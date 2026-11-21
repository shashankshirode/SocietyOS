import { useState } from 'react';
import { accountingRepository } from './accounting.repository';
import type { ManualPaymentInput, ManualPaymentRecord } from '../../../shared/types/accounting.types';

export function useManualPayment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [success, setSuccess] = useState<ManualPaymentRecord | null>(null);

  const recordPayment = async (input: ManualPaymentInput) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await accountingRepository.recordManualPayment(input);
      if (res.ok) {
        setSuccess(res.data);
      } else {
        throw new Error(res.error.message || 'Manual payment entry failed');
      }
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Submit error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitting(false);
    setError(null);
    setSuccess(null);
  };

  return {
    recordPayment,
    isSubmitting,
    error,
    success,
    reset,
  };
}
