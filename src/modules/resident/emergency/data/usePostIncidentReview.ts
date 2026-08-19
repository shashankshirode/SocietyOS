import { useState } from 'react';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { CreatePostIncidentReviewInput } from '../../../../shared/types/safety.types';

export function usePostIncidentReview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createReview = async (input: CreatePostIncidentReviewInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencySafetyRepository.createPostIncidentReview(input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create review');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createReview, isSubmitting, error };
}
