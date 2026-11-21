import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';
import type { CreateInterFlatIssueInput } from '../../../../shared/types/interFlat.types';

export function useCreateInterFlatIssue() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIssue = async (input: CreateInterFlatIssueInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await interFlatRepository.createInterFlatIssue(input);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create issue');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createIssue, isSubmitting, error };
}
