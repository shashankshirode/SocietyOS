import { useState } from 'react';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { CreateSosInput, EmergencyIncident } from '../../../../shared/types/emergency.types';

export function useCreateSos() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerSos = async (input: CreateSosInput): Promise<EmergencyIncident> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencySafetyRepository.createSos(input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('SOS trigger failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { triggerSos, isSubmitting, error };
}
