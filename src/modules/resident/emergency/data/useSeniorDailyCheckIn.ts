import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { SubmitSeniorCheckInInput } from '../../../../shared/types/seniorCare.types';

export function useSeniorDailyCheckIn(filters?: Record<string, string>) {
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getSeniorCheckIns(filters);
    return { ok: true, data: res };
  }, [JSON.stringify(filters)]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkIn = async (input: SubmitSeniorCheckInInput) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.submitSeniorCheckIn(input);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, checkIn, isSubmitting };
}
