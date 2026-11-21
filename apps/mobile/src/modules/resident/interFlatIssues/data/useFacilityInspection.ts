import { useState } from 'react';
import { useRepositoryResult } from '../../../../core/repositories/useRepositoryResult';
import { interFlatRepository } from './interFlat.repository';
import type { CompleteFacilityInspectionInput } from './interFlat.dto';
import { repositorySuccess } from '../../../../core/repositories/repository.types';

export function useFacilityInspection(inspectionId?: string) {
  const { data, isLoading, error, refetch } = useRepositoryResult(async () => {
    if (!inspectionId) return repositorySuccess(undefined);
    return interFlatRepository.getFacilityInspection(inspectionId);
  }, [inspectionId]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const requestInspection = async (issueId: string, preferredTime: string) => {
    setIsSubmitting(true);
    try {
      return await interFlatRepository.requestFacilityInspection(issueId, { preferredTime });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeInspection = async (id: string, findings: CompleteFacilityInspectionInput) => {
    setIsSubmitting(true);
    try {
      return await interFlatRepository.completeFacilityInspection(id, findings);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { data, isLoading, error, refetch, requestInspection, completeInspection, isSubmitting };
}
