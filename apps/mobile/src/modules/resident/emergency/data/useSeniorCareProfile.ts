import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { SeniorCareProfile } from '../../../../shared/types/seniorCare.types';

export function useSeniorCareProfile() {
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getSeniorCareProfile();
    return { ok: true, data: res };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfile = async (input: Partial<SeniorCareProfile>) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.updateSeniorCareProfile(input);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, updateProfile, isSubmitting };
}
