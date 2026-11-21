import type { VolunteerAlert } from '../types/volunteer.types';

export const mockVolunteerAlerts: VolunteerAlert[] = [
  {
    id: 'valert-001',
    incidentId: 'inc-001',
    emergencyType: 'MEDICAL',
    location: 'Flat A-1204',
    severity: 'CRITICAL',
    volunteerId: 'vol-001',
    volunteerName: 'Dr. Vivek Mehta',
    status: 'AVAILABLE',
    alertedAt: '2026-06-29T10:02:00Z',
    respondedAt: '2026-06-29T10:03:15Z',
    responseNote: 'Reaching in 5 minutes with my medical bag.',
  },
  {
    id: 'valert-002',
    incidentId: 'inc-001',
    emergencyType: 'MEDICAL',
    location: 'Flat A-1204',
    severity: 'CRITICAL',
    volunteerId: 'vol-002',
    volunteerName: 'Dr. Anjali Sen',
    status: 'NOT_AVAILABLE',
    alertedAt: '2026-06-29T10:02:00Z',
    respondedAt: '2026-06-29T10:04:00Z',
    responseNote: 'Currently at clinic, cannot attend.',
  },
  {
    id: 'valert-003',
    incidentId: 'inc-003',
    emergencyType: 'FIRE',
    location: 'C Wing 10th Floor Lobby',
    severity: 'CRITICAL',
    volunteerId: 'vol-005',
    volunteerName: 'Shyam Lal',
    status: 'PENDING',
    alertedAt: '2026-06-29T10:15:00Z',
  }
];
