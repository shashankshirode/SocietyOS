import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';

export function useMediationCase(mediationId: string) {
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await interFlatRepository.getMediationCase(mediationId);
    return { ok: true, data: res };
  }, [mediationId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const assignMediator = async (mediatorName: string) => {
    setIsSubmitting(true);
    try {
      const res = await interFlatRepository.assignMediator(mediationId, { mediatorName });
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, assignMediator, isSubmitting };
}
