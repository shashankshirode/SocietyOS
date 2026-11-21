import type { EmergencyDashboardSummary } from '../types/emergency.types';
import { mockEmergencyIncidents } from './emergencyIncidents.mock';

export const mockEmergencyDashboard: EmergencyDashboardSummary = {
  societyName: 'Green Valley Heights',
  activeCount: 3,
  medicalCount: 1,
  fireCount: 1,
  liftCount: 1,
  securityCount: 0,
  recentIncidents: mockEmergencyIncidents.slice(0, 5),
};
