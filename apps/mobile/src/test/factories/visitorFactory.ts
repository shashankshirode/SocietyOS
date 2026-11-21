import type { Visitor } from '../../shared/types/visitor.types';

export function createVisitor(overrides: Partial<Visitor> = {}): Visitor {
  return {
    id: 'visitor-001',
    name: 'Amit Sharma',
    phone: '******3210',
    type: 'GUEST',
    status: 'EXPECTED',
    expectedDate: '2026-06-29',
    expectedTime: '19:30',
    flatNumber: 'A-1204',
    societyName: 'Green Valley Heights',
    purpose: 'Family visit',
    otp: '482910',
    createdAt: '2026-06-29T10:00:00.000Z',
    ...overrides,
  };
}
