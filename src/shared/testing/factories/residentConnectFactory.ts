import type { ResidentDirectoryEntry, ContactRequest } from '../../types/residentConnect.types';

export function createResidentDirectoryEntry(overrides: Partial<ResidentDirectoryEntry> = {}): ResidentDirectoryEntry {
  return {
    id: 'res-dir-002',
    name: 'Priya Sharma',
    unitId: 'unit-302',
    flatNumber: 'B-302',
    tower: 'Tower B',
    residentType: 'OWNER',
    visibilityStatus: 'VISIBLE',
    connectionStatus: 'NOT_CONNECTED',
    allowedTopics: ['PARKING_ISSUE', 'COMMUNITY_HELP'],
    mutualContext: ['Diwali coordination team'],
    ...overrides,
  };
}

export function createContactRequest(overrides: Partial<ContactRequest> = {}): ContactRequest {
  return {
    id: 'req-001',
    fromResidentId: 'res-dir-002',
    fromResidentName: 'Priya Sharma',
    fromFlat: 'B-302',
    toResidentId: 'res-101',
    toResidentName: 'Rajesh Kumar',
    toFlat: 'A-1204',
    subject: 'Diwali coordination event planning',
    message: 'Hi Rajesh, requesting contact details to coordinate the Tower A & B Diwali cultural programs.',
    category: 'COMMUNITY_HELP',
    urgency: 'NORMAL',
    allowFlatShare: true,
    status: 'PENDING',
    createdAt: '2026-07-08T10:00:00Z',
    updatedAt: '2026-07-08T10:00:00Z',
    ...overrides,
  };
}
