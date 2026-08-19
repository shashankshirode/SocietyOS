import type { MeetingMinutes } from '../types/meeting.types';

export const mockMinutesList: MeetingMinutes[] = [
  {
    id: 'mom-003',
    meetingId: 'meet-003',
    meetingTitle: 'Monthly Committee Meeting — June 2026',
    meetingDate: '2026-06-05',
    preparedBy: 'Sunil Patil (Secretary)',
    approvedBy: 'Sunil Patil (Chairman)',
    status: 'PUBLISHED',
    totalUnits: 11,
    presentCount: 9,
    absentCount: 2,
    proxyCount: 0,
    quorumPercent: 81,
    isQuorumMet: true,
    discussionSummary: 'Discussion centered on pending lift services in Wing A, water logging complaints in basement Wing B, and CCTV surveillance upgrade proposal reviews. CleanStar Services housekeeping scorecard was evaluated.',
    decisions: [
      'Housekeeping contractor CleanStar warned for terrace cleanups.',
      'CCTV upgrade vendor shortlist finalized (TechGuard & SecureVision).',
      'Garden seating maintenance approved using emergency funds.',
    ],
    actionItems: [
      { id: 'act-301', description: 'Issue warning letter to housekeeping vendor', assignee: 'Sunil Patil', dueDate: '2026-06-10', status: 'COMPLETED' },
      { id: 'act-302', description: 'Collect final comparative CCTV pricing', assignee: 'Prashant Kulkarni', dueDate: '2026-06-25', status: 'IN_PROGRESS' },
    ],
    linkedResolutionIds: ['res-008'],
    acknowledged: true,
    acknowledgedAt: '2026-06-10T11:00:00Z',
    documentUrl: 'https://societyos.com/mom/gvh-mom-committee-june26.pdf',
    versions: [
      { version: 1.1, updatedAt: '2026-06-08T09:00:00Z', updatedBy: 'Sunil Patil', changeSummary: 'Draft prepared' },
      { version: 1.2, updatedAt: '2026-06-09T14:00:00Z', updatedBy: 'Anil Deshmukh', changeSummary: 'Corrected attendance spellings' },
    ],
  },
  {
    id: 'mom-006',
    meetingId: 'meet-006',
    meetingTitle: 'Emergency Drainage Repair Discussion',
    meetingDate: '2026-04-12',
    preparedBy: 'Anil Deshmukh (Secretary)',
    approvedBy: 'Sunil Patil (Chairman)',
    status: 'APPROVED',
    totalUnits: 120,
    presentCount: 38,
    absentCount: 82,
    proxyCount: 0,
    quorumPercent: 31,
    isQuorumMet: true,
    discussionSummary: 'Urgent meeting due to drainage pipe collapse behind Wing B. Structural contractor BuildStrong inspected the site and provided a ₹2.5 Lakh quote for replacement and pipeline redirection.',
    decisions: [
      'Drainage redirection contract awarded to BuildStrong.',
      'Emergency fund allocation of ₹2.5 Lakhs approved.',
    ],
    actionItems: [
      { id: 'act-601', description: 'Issue work order to BuildStrong Contractors', assignee: 'Anil Deshmukh', dueDate: '2026-04-13', status: 'COMPLETED' },
    ],
    linkedResolutionIds: ['res-009'],
    acknowledged: true,
    acknowledgedAt: '2026-04-15T09:00:00Z',
    versions: [
      { version: 1.0, updatedAt: '2026-04-12T21:00:00Z', updatedBy: 'Anil Deshmukh', changeSummary: 'Original release' },
    ],
  },
];


for (let i = 1; i <= 4; i++) {
  mockMinutesList.push({
    id: `mom-dummy-00${i}`,
    meetingId: `meet-dummy-00${i}`,
    meetingTitle: `Past Committee Meet ${i}`,
    meetingDate: `2026-0${i}-15`,
    preparedBy: 'Anil Deshmukh (Secretary)',
    approvedBy: 'Sunil Patil (Chairman)',
    status: 'APPROVED',
    totalUnits: 120,
    presentCount: 10 + i * 5,
    absentCount: 110 - i * 5,
    proxyCount: 0,
    quorumPercent: 20 + i * 5,
    isQuorumMet: true,
    discussionSummary: `Mock MOM discussion contents for past session ${i}. Reviewing common area lights, security shifts, water audits, and general administrative checks.`,
    decisions: [
      `Decision A for session ${i} approved.`,
      `Decision B for session ${i} approved.`,
    ],
    actionItems: [
      { id: `act-dummy-${i}-1`, description: `Action item for past session ${i}`, assignee: 'Sunil Patil', dueDate: `2026-0${i}-30`, status: 'COMPLETED' },
    ],
    linkedResolutionIds: [],
    acknowledged: true,
    acknowledgedAt: `2026-0${i}-18T10:00:00Z`,
    versions: [
      { version: 1.0, updatedAt: `2026-0${i}-16T10:00:00Z`, updatedBy: 'Anil Deshmukh', changeSummary: 'Original release' },
    ],
  });
}
