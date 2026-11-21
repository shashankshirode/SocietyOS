import { useState } from 'react';
import { useRepositoryResult } from '../../../core/repositories/useRepositoryResult';
import { accountingRepository } from './accounting.repository';
import type { GenerateBillsInput } from '../../../shared/types/accounting.types';

export function useBillingCycles() {
  const query = useRepositoryResult(() => accountingRepository.getBillingCycles(), []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const generateBills = async (input: GenerateBillsInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const res = await accountingRepository.generateBills(input);
      if (res.ok) {
        setSubmitSuccess(true);
        await query.refetch();
      } else {
        throw new Error(res.error.message || 'Bill generation failed');
      }
    } catch (e) {
      setSubmitError(e instanceof Error ? e : new Error('Calculation error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ...query,
    generateBills,
    isSubmitting,
    submitError,
    submitSuccess,
  };
}
