import { useRepositoryMutation } from '../../../core/repositories/useRepositoryResult';
import type { RecordGateEntryPayload } from './gate.dto';
import { gateRepository } from './gate.repository';

export function useRecordGateEntry() {
  return useRepositoryMutation((payload: RecordGateEntryPayload) => gateRepository.recordGateEntry(payload));
}

