import { GuardProfile, ShiftSummary } from '../types/guard.types';

export const mockGuardProfile: GuardProfile = {
  id: 'guard-001',
  name: 'Ramesh Pawar',
  role: 'SECURITY_GUARD',
  societyName: 'Green Valley Heights',
  gateName: 'Main Gate',
  shiftName: 'Morning Shift',
  shiftTime: '07:00 AM - 03:00 PM',
  supervisorName: 'Suresh Patil',
  deviceStatus: 'ONLINE',
};

export const mockShiftSummary: ShiftSummary = {
  guardName: 'Ramesh Pawar',
  gateName: 'Main Gate',
  shiftTime: '07:00 AM - 03:00 PM',
  totalVisitorEntries: 18,
  deliveries: 12,
  cabs: 6,
  vendors: 3,
  staffCheckIns: 14,
  rejectedEntries: 2,
  pendingOfflineSync: 0,
  openIssues: 1,
  emergencyIncidents: 0,
};
