import type { Complaint } from '../../types/complaint.types';

export function createComplaint(overrides: Partial<Complaint> = {}): Complaint {
  return {
    id: 'complaint-001',
    title: 'Water leakage from upper flat toilet ceiling',
    description: 'Persistent seepage observed in the master bathroom ceiling, causing paint peeling and humidity.',
    category: 'WATER_LEAKAGE',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    location: 'Master Bathroom',
    flatNumber: 'A-1204',
    residentName: 'Rajesh Kumar',
    createdAt: '2026-07-07T08:30:00.000Z',
    updatedAt: '2026-07-08T12:00:00.000Z',
    slaText: '18 hours left',
    assignedTo: 'Plumbing Facility Team',
    updates: [
      { id: 'u1', status: 'OPEN', note: 'Complaint registered', timestamp: '2026-07-07T08:30:00.000Z' },
      { id: 'u2', status: 'IN_PROGRESS', note: 'Assigned to plumber Ganesh Naik', timestamp: '2026-07-07T12:00:00.000Z' }
    ],
    ...overrides,
  };
}
