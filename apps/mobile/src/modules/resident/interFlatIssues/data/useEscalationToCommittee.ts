import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';
import type { EscalateIssueInput } from './interFlat.dto';

export function useEscalationToCommittee(issueId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const escalate = async (input: EscalateIssueInput) => {
    setIsSubmitting(true);
    try {
      return await interFlatRepository.escalateIssue(issueId, input);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { escalate, isSubmitting };
}
