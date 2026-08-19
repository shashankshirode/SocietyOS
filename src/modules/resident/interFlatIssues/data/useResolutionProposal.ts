import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';
import type { CreateResolutionProposalInput } from './interFlat.dto';

export function useResolutionProposal(mediationId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createProposal = async (input: CreateResolutionProposalInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await interFlatRepository.createResolutionProposal(mediationId, input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create proposal');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createProposal, isSubmitting, error };
}
