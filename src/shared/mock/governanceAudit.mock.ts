import type { AuditLogEntry } from '../types/complianceCalendar.types';

export const mockAuditLogList: AuditLogEntry[] = [
  {
    id: 'aud-001',
    eventType: 'MEETING_NOTICE_PUBLISHED',
    actorName: 'Anil Deshmukh',
    actorRole: 'SECRETARY',
    timestamp: '2026-06-25T10:00:00Z',
    entityType: 'MEETING',
    entityReference: 'meet-001 (42nd AGM)',
    devicePlaceholder: 'Mobile (Android) · IP: 192.168.1.45',
    auditNote: 'Formal general body notice broadcasted to 120 members.',
  },
  {
    id: 'aud-002',
    eventType: 'NOTICE_ACKNOWLEDGED',
    actorName: 'Shashank Shirode',
    actorRole: 'OWNER',
    timestamp: '2026-06-25T10:15:00Z',
    entityType: 'NOTICE',
    entityReference: 'meet-001',
    devicePlaceholder: 'Mobile (iOS) · IP: 192.168.1.102',
    auditNote: 'Notice acknowledgment recorded for unit A-1204.',
  },
  {
    id: 'aud-003',
    eventType: 'RSVP_SUBMITTED',
    actorName: 'Shashank Shirode',
    actorRole: 'OWNER',
    timestamp: '2026-06-28T14:32:00Z',
    entityType: 'MEETING_RSVP',
    entityReference: 'meet-002',
    devicePlaceholder: 'Mobile (iOS) · IP: 192.168.1.102',
    auditNote: 'RSVP submission - Mode: IN_PERSON, Status: ATTENDING.',
  },
  {
    id: 'aud-004',
    eventType: 'QUESTION_SUBMITTED',
    actorName: 'Shashank Shirode',
    actorRole: 'OWNER',
    timestamp: '2026-06-29T10:00:00Z',
    entityType: 'MEETING_QUESTION',
    entityReference: 'GVH-Q-2026-001',
    devicePlaceholder: 'Mobile (iOS) · IP: 192.168.1.102',
    auditNote: 'Submitted query on Lift AMC details.',
  },
  {
    id: 'aud-005',
    eventType: 'PROXY_AUTHORIZATION_SUBMITTED',
    actorName: 'Shashank Shirode',
    actorRole: 'OWNER',
    timestamp: '2026-06-29T22:30:00Z',
    entityType: 'PROXY_DELEGATION',
    entityReference: 'proxy-101',
    devicePlaceholder: 'Mobile (iOS) · IP: 192.168.1.102',
    auditNote: 'Proxy authorization submitted to Deepak Shirode.',
  },
];


for (let i = 1; i <= 15; i++) {
  mockAuditLogList.push({
    id: `aud-dummy-0${i}`,
    eventType: i % 2 === 0 ? 'VOTE_SUBMITTED' : 'MOM_APPROVED',
    actorName: i % 2 === 0 ? 'Resident Member' : 'Sunil Patil',
    actorRole: i % 2 === 0 ? 'OWNER' : 'CHAIRPERSON',
    timestamp: `2026-06-29T1${i % 9}:30:00Z`,
    entityType: i % 2 === 0 ? 'POLL_VOTE' : 'MINUTES',
    entityReference: i % 2 === 0 ? 'poll-102' : 'mom-003',
    devicePlaceholder: 'Mobile App Device',
    auditNote: i % 2 === 0 ? 'Vote recorded in tamper-proof registry.' : 'Minutes status changed to APPROVED.',
  });
}
