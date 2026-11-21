import type { OccupancyRecord } from './occupancy.types';

export const mockOccupancyRecords: OccupancyRecord[] = [
  {
    id: 'occ-1',
    unitId: 'unit-a-1204',
    flatNumber: 'A-1204',
    occupantName: 'Rohan Sharma',
    occupantType: 'OWNER',
    documentStatus: 'APPROVED',
  },
  {
    id: 'occ-2',
    unitId: 'unit-b-503',
    flatNumber: 'B-503',
    occupantName: 'Amit Patel',
    occupantType: 'TENANT',
    leaseStartDate: '2025-01-01',
    leaseEndDate: '2026-01-01',
    documentStatus: 'PENDING',
  },
];
