import { useState } from 'react';
import { interFlatRepository } from './interFlat.repository';
import type { SubmitIssueResponseInput } from './interFlat.dto';

export function useRespondToIssue(issueId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitResponse = async (input: SubmitIssueResponseInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await interFlatRepository.submitIssueResponse(issueId, input);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to submit response');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitResponse, isSubmitting, error };
}
