import type { EmergencyContact, EmergencyIncident } from '../../types/emergency.types';

export function createEmergencyContact(overrides: Partial<EmergencyContact> = {}): EmergencyContact {
  return {
    id: 'em-contact-001',
    name: 'Main Gate Security',
    relationship: 'SECURITY',
    mobileMasked: '******9999',
    phone: '******9999', 
    priority: 1,
    notifyForAll: true,
    consentConfirmed: true,
    role: 'Security Desk', 
    iconName: 'shield-outline', 
    available24x7: true,
    ...overrides,
  };
}

export function createEmergencyIncident(overrides: Partial<EmergencyIncident> = {}): EmergencyIncident {
  return {
    id: 'emer-inc-001',
    incidentNumber: 'EM-INC-2026-0008',
    emergencyType: 'LIFT_STUCK',
    severity: 'CRITICAL',
    status: 'ACKNOWLEDGED',
    reportedByUserId: 'res-101',
    reportedByUserName: 'Rajesh Kumar',
    reportedByUserMobileMasked: '******3210',
    unitId: 'unit-1204',
    flatNumber: 'A-1204',
    tower: 'Tower A',
    location: 'Tower A Main Passenger Lift',
    isSeniorCitizen: false,
    needAmbulance: false,
    needVolunteer: true,
    notifyFamily: true,
    isPrivate: false,
    liftNumber: 'Lift A1',
    numberOfPeopleStuck: 2,
    responders: [
      {
        id: 'resp-001',
        name: 'Ganesh Naik',
        role: 'FACILITY_MANAGER',
        mobileMasked: '******8888',
        status: 'ACKNOWLEDGED',
        etaMinutes: 5,
        assignedAt: '2026-07-08T23:30:00Z',
        acknowledgedAt: '2026-07-08T23:31:00Z',
      }
    ],
    createdAt: '2026-07-08T23:30:00Z',
    ...overrides,
  };
}
