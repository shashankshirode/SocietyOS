import { useState } from 'react';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { RegisterVolunteerInput, EmergencyVolunteer } from '../../../../shared/types/volunteer.types';

export function useVolunteerRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const register = async (input: RegisterVolunteerInput): Promise<EmergencyVolunteer> => {
    setIsSubmitting(true);
    setError(null);
    try {
      return await emergencySafetyRepository.registerEmergencyVolunteer(input);
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Registration failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { register, isSubmitting, error };
}
