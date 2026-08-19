import { useState } from 'react';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { CreateEmergencyIncidentInput, EmergencyIncident } from '../../../../shared/types/emergency.types';

export function useCreateEmergencyIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createIncident = async (input: CreateEmergencyIncidentInput): Promise<EmergencyIncident> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencySafetyRepository.createEmergencyIncident(input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to create incident');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createIncident, isSubmitting, error };
}
