import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { emergencySafetyRepository } from './emergencySafety.repository';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';

export function useFamilyConnect() {
  const { activeContext } = useActiveResidentHome();
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    const res = await emergencySafetyRepository.getFamilyConnect();
    return { ok: true, data: res };
  }, [activeContext.dataScopeKey]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateConnect = async (enabled: boolean) => {
    setIsSubmitting(true);
    try {
      const res = await emergencySafetyRepository.updateFamilyConnect({ enabled });
      void refetch();
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, updateConnect, isSubmitting };
}
export default useFamilyConnect;
