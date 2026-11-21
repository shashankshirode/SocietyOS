import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import type { CreateSafetyDrillInput } from '../../../../shared/types/safety.types';

export function useSafetyDrills(filters?: Record<string, string>) {
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getSafetyDrills(filters);
    return { ok: true, data: res };
  }, [JSON.stringify(filters)]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createDrill = async (input: CreateSafetyDrillInput) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.createSafetyDrill(input);
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, createDrill, isSubmitting };
}
