import { mockEmergencyIncidents } from './emergencyIncidents.mock';

export const mockGuardEmergencyConsole = {
  activeCount: 3,
  acknowledgedCount: 1,
  unacknowledgedCount: 2,
  emergencies: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED'),
};

export const mockFacilityEmergencyConsole = {
  activeCount: 3,
  escalatedCount: 0,
  needsPostReviewCount: 2,
  emergencies: mockEmergencyIncidents.filter(i => i.status !== 'CLOSED' && i.status !== 'CANCELLED'),
};
export type { mockGuardEmergencyConsole as GuardConsole, mockFacilityEmergencyConsole as FacilityConsole };
