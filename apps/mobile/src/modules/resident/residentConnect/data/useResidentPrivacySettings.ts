import { useRepositoryResult, useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';
import type { ResidentPrivacySettings } from '../../../../shared/types/privacy.types';

export function useResidentPrivacySettings() {
  return useRepositoryResult(() => residentConnectRepository.getPrivacySettings(), []);
}

export function useUpdatePrivacySettings() {
  return useRepositoryMutation((input: Partial<ResidentPrivacySettings>) =>
    residentConnectRepository.updatePrivacySettings(input)
  );
}
