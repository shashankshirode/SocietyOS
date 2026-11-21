export interface TimelineEvent {
  id: string;
  issueId: string;
  timestamp: string;
  actorRole: string;
  eventType: string;
  summary: string;
  isVisibleToResident: boolean;
}

export const mockInterFlatTimeline: TimelineEvent[] = [
  {
    id: 't-001',
    issueId: 'issue-001',
    timestamp: '2026-06-25T10:05:00Z',
    actorRole: 'REPORTER',
    eventType: 'ISSUE_CREATED',
    summary: 'Water leakage issue reported by Shashank (A-1204) affecting Bathroom Ceiling.',
    isVisibleToResident: true,
  },
  {
    id: 't-002',
    issueId: 'issue-001',
    timestamp: '2026-06-25T10:10:00Z',
    actorRole: 'SYSTEM',
    eventType: 'NEIGHBOUR_NOTIFIED',
    summary: 'Polite system notification generated for involved flat A-1304 (Amit Sharma).',
    isVisibleToResident: true,
  },
  {
    id: 't-003',
    issueId: 'issue-001',
    timestamp: '2026-06-25T12:00:00Z',
    actorRole: 'FACILITY_MANAGER',
    eventType: 'INSPECTION_REQUESTED',
    summary: 'Facility inspection requested by reporter to trace the leakage source.',
    isVisibleToResident: true,
  },
  {
    id: 't-004',
    issueId: 'issue-001',
    timestamp: '2026-06-25T14:30:00Z',
    actorRole: 'FACILITY_MANAGER',
    eventType: 'INSPECTION_SCHEDULED',
    summary: 'Inspection scheduled for 2026-06-29 10:00 AM. Assigned to Suresh Patil.',
    isVisibleToResident: true,
  },
  {
    id: 't-005',
    issueId: 'issue-002',
    timestamp: '2026-06-27T08:00:00Z',
    actorRole: 'REPORTER',
    eventType: 'ISSUE_CREATED',
    summary: 'Noise complaint registered by Karan (B-0802) regarding loud music after quiet hours.',
    isVisibleToResident: true,
  },
  {
    id: 't-006',
    issueId: 'issue-002',
    timestamp: '2026-06-27T08:05:00Z',
    actorRole: 'SYSTEM',
    eventType: 'NEIGHBOUR_NOTIFIED',
    summary: 'Neighbour notification sent politely requesting review of sound levels.',
    isVisibleToResident: true,
  },
  {
    id: 't-007',
    issueId: 'issue-003',
    timestamp: '2026-06-28T09:00:00Z',
    actorRole: 'REPORTER',
    eventType: 'ISSUE_CREATED',
    summary: 'Renovation disturbance reported by Shashank (A-1204) regarding late drilling.',
    isVisibleToResident: true,
  },
  {
    id: 't-008',
    issueId: 'issue-003',
    timestamp: '2026-06-28T11:00:00Z',
    actorRole: 'INVOLVED_RESIDENT',
    eventType: 'RESPONSE_SUBMITTED',
    summary: 'Response received from Rajesh Gupta (A-1203). Agreed to stop noisy work by 5:30 PM.',
    isVisibleToResident: true,
  },
  {
    id: 't-009',
    issueId: 'issue-004',
    timestamp: '2026-06-24T10:00:00Z',
    actorRole: 'REPORTER',
    eventType: 'ISSUE_CREATED',
    summary: 'Pet nuisance reported by Sunita (C-1501) regarding unleashed dog in lobby.',
    isVisibleToResident: true,
  },
  {
    id: 't-010',
    issueId: 'issue-004',
    timestamp: '2026-06-24T18:00:00Z',
    actorRole: 'INVOLVED_RESIDENT',
    eventType: 'RESPONSE_SUBMITTED',
    summary: 'Response received from Rahul Mehta (C-1502). Disagreed with severity but noted Elevator concern.',
    isVisibleToResident: true,
  },
  {
    id: 't-011',
    issueId: 'issue-004',
    timestamp: '2026-06-25T09:30:00Z',
    actorRole: 'COMMITTEE_MEMBER',
    eventType: 'MEDIATION_ASSIGNED',
    summary: 'Mediation case opened. Anil Deshmukh assigned as mediator.',
    isVisibleToResident: true,
  }
];


for (let i = 12; i <= 55; i++) {
  mockInterFlatTimeline.push({
    id: `t-0${i}`,
    issueId: `issue-0${i % 5 + 1}`,
    timestamp: `2026-06-${15 + i % 10}T12:00:00Z`,
    actorRole: i % 3 === 0 ? 'FACILITY_MANAGER' : 'SYSTEM',
    eventType: 'STATUS_UPDATE',
    summary: `Automated timeline event tracker: Step ${i}. Case details updated.`,
    isVisibleToResident: i % 4 !== 0,
  });
}
