import type { EmergencyAuditLog } from '../types/safety.types';

export const mockEmergencyAuditLogs: EmergencyAuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-06-29T10:00:00Z',
    actorId: 'resident-001',
    actorName: 'Shashank',
    actorRole: 'RESIDENT_OWNER',
    eventType: 'SOS_CREATED',
    entityReference: 'incidentId: inc-001',
    correlationId: 'corr-sos-001',
    metadata: {
      flatNumber: 'A-1204',
      tower: 'A Wing',
      emergencyType: 'MEDICAL',
      severity: 'CRITICAL',
    },
  },
  {
    id: 'aud-002',
    timestamp: '2026-06-29T10:01:00Z',
    actorId: 'guard-001',
    actorName: 'Ramesh Pawar',
    actorRole: 'SECURITY_GUARD',
    eventType: 'INCIDENT_ACKNOWLEDGED',
    entityReference: 'incidentId: inc-001',
    correlationId: 'corr-sos-001',
    metadata: {
      responderId: 'resp-001',
      etaMinutes: 2,
    },
  },
  {
    id: 'aud-003',
    timestamp: '2026-06-29T10:02:00Z',
    actorId: 'system',
    actorName: 'System',
    actorRole: 'SYSTEM',
    eventType: 'VOLUNTEER_ALERTED',
    entityReference: 'incidentId: inc-001',
    correlationId: 'corr-sos-001',
    metadata: {
      alertedVolunteersCount: 3,
      volunteerType: 'DOCTOR',
    },
  },
  {
    id: 'aud-004',
    timestamp: '2026-06-29T10:03:00Z',
    actorId: 'guard-001',
    actorName: 'Ramesh Pawar',
    actorRole: 'SECURITY_GUARD',
    eventType: 'RESPONDER_REACHED',
    entityReference: 'incidentId: inc-001',
    correlationId: 'corr-sos-001',
    metadata: {
      reachedAt: '2026-06-29T10:03:00Z',
    },
  },
  {
    id: 'aud-005',
    timestamp: '2026-06-29T10:03:15Z',
    actorId: 'vol-001',
    actorName: 'Dr. Vivek Mehta',
    actorRole: 'VOLUNTEER',
    eventType: 'VOLUNTEER_ACCEPTED',
    entityReference: 'alertId: valert-001',
    correlationId: 'corr-sos-001',
    metadata: {
      volunteerId: 'vol-001',
      etaMinutes: 5,
    },
  },
  {
    id: 'aud-006',
    timestamp: '2026-06-29T09:30:00Z',
    actorId: 'senior-001',
    actorName: 'Madhav Deshpande',
    actorRole: 'RESIDENT_OWNER',
    eventType: 'SENIOR_CHECK_IN_COMPLETED',
    entityReference: 'checkInId: chkin-001',
    correlationId: 'corr-chkin-001',
    metadata: {
      status: 'COMPLETED',
      flatNumber: 'B-0802',
    },
  }
];
export type { EmergencyAuditLog };
