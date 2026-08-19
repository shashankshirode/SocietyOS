import { useState } from 'react';
import type { CreateBiometricMappingInput, BiometricMapping } from '../../../shared/types/biometric.types';
import { staffAttendanceRepository } from './staffAttendance.repository';

export function useBiometricStaffMapping() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<BiometricMapping | null>(null);

  const map = async (input: CreateBiometricMappingInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await staffAttendanceRepository.createBiometricMapping(input);
      setData(result);
      return result;
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Mapping failed');
      setError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { map, isSubmitting, error, data };
}
