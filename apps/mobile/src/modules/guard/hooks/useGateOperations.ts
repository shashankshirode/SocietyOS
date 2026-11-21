import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import { gateRepository } from '../data/gate.repository';

export function useVerifyVisitorPass() {
  return useRepositoryMutation((params: { passCode: string; gateId: string; guardId: string }) =>
    gateRepository.verifyVisitorPass(params)
  );
}

export function useRecordExit() {
  return useRepositoryMutation((params: { passId: string; gateId: string; guardId: string }) =>
    gateRepository.recordExit(params)
  );
}

export function useEmergencyBypass() {
  return useRepositoryMutation((params: { type: string; location: string; description?: string; guardId: string; gateId: string }) =>
    gateRepository.emergencyBypass(params)
  );
}

export function useWalkInEntry() {
  return useRepositoryMutation((payload: { personName: string; flatNumber: string; entryType: string; guardId: string; gateId: string }) =>
    gateRepository.createWalkInEntry(payload)
  );
}

export function useWatchlistCheck() {
  return useRepositoryMutation((params: { visitorPhone?: string; visitorId?: string }) =>
    gateRepository.watchlistCheck(params)
  );
}