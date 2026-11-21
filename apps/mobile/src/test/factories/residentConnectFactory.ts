import type { ResidentDirectoryEntry } from '../../shared/types/residentConnect.types';

export function createResidentDirectoryEntry(overrides: Partial<ResidentDirectoryEntry> = {}): ResidentDirectoryEntry {
  return {
    id: 'resident-002',
    name: 'Neha Iyer',
    unitId: 'unit-b-0802',
    flatNumber: 'B-802',
    tower: 'B Wing',
    residentType: 'OWNER',
    visibilityStatus: 'VISIBLE',
    connectionStatus: 'NOT_CONNECTED',
    bio: 'Committee volunteer',
    mutualContext: ['Same wing'],
    ...overrides,
  };
}
