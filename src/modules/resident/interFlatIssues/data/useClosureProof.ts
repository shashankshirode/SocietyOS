import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';

export function useClosureProof(proposalId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitClosure = async (closureNote: string) => {
    setIsSubmitting(true);
    try {
      return await interFlatRepository.submitClosureProof(proposalId, { closureNote });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitClosure, isSubmitting };
}
