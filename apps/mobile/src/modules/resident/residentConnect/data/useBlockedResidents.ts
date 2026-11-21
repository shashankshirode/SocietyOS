import { useRepositoryResult, useRepositoryMutation } from '../../../../core/repositories/useRepositoryResult';
import { residentConnectRepository } from './residentConnect.repository';

export function useBlockedResidents() {
  return useRepositoryResult(() => residentConnectRepository.getBlockedResidents(), []);
}

export function useUnblockResident() {
  return useRepositoryMutation((blockedResidentId: string) =>
    residentConnectRepository.unblockResident(blockedResidentId)
  );
}
export function useBlockResident() {
  
  return useRepositoryMutation((payload: { blockedResidentId: string; blockedResidentName: string; blockedFlat: string; reason?: string }) =>
    
    residentConnectRepository.unblockResident(payload.blockedResidentId) 
  );
}
