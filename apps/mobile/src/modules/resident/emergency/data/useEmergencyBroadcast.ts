import { useState } from 'react';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { CreateBroadcastInput } from '../../../../shared/types/safety.types';

export function useEmergencyBroadcast() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const broadcast = async (input: CreateBroadcastInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencySafetyRepository.createEmergencyBroadcast(input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Broadcast failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { broadcast, isSubmitting, error };
}
