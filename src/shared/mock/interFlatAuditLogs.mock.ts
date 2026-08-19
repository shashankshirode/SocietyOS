export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  eventName: string;
  entityReference: string;
  correlationId: string;
  details: string;
}

export const mockInterFlatAuditLogs: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2026-06-25T10:05:00Z',
    actorName: 'Shashank',
    actorRole: 'RESIDENT_OWNER',
    eventName: 'CREATE_ISSUE',
    entityReference: 'IF-2026-001',
    correlationId: 'corr-001-abc',
    details: 'Inter-flat issue reported: Water leakage in Bathroom Ceiling.'
  },
  {
    id: 'audit-002',
    timestamp: '2026-06-25T10:10:00Z',
    actorName: 'SYSTEM',
    actorRole: 'SYSTEM',
    eventName: 'SEND_NOTIFICATION',
    entityReference: 'IF-2026-001',
    correlationId: 'corr-001-abc',
    details: 'Polite notification generated and queued for Flat A-1304.'
  },
  {
    id: 'audit-003',
    timestamp: '2026-06-25T14:30:00Z',
    actorName: 'Suresh Patil',
    actorRole: 'FACILITY_MANAGER',
    eventName: 'SCHEDULE_INSPECTION',
    entityReference: 'INSP-2026-001',
    correlationId: 'corr-002-def',
    details: 'Facility inspection scheduled for 2026-06-29 10:00 AM.'
  },
  {
    id: 'audit-004',
    timestamp: '2026-06-10T11:00:00Z',
    actorName: 'Shashank',
    actorRole: 'RESIDENT_OWNER',
    eventName: 'ACKNOWLEDGE_RULE',
    entityReference: 'R-GEN-01',
    correlationId: 'corr-003-ghi',
    details: 'Acknowledged Silent Hours and Noise Control Rule version 2.1.'
  }
];

for (let i = 5; i <= 30; i++) {
  mockInterFlatAuditLogs.push({
    id: `audit-0${i}`,
    timestamp: `2026-06-${10 + i % 15}T14:00:00Z`,
    actorName: i % 2 === 0 ? 'Anil Deshmukh' : 'Suresh Patil',
    actorRole: i % 2 === 0 ? 'COMMITTEE_MEMBER' : 'FACILITY_MANAGER',
    eventName: i % 2 === 0 ? 'MEDIATION_UPDATE' : 'INSPECTION_UPDATE',
    entityReference: `IF-2026-0${i % 5 + 1}`,
    correlationId: `corr-0${i}-xyz`,
    details: `Audit log tracker details: ${i}. Action logged successfully.`
  });
}
