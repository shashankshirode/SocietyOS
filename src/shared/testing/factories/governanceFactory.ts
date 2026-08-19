import type { Meeting, Resolution } from '../../types/governance.types';

export function createMeeting(overrides: Partial<Meeting> = {}): Meeting {
  return {
    id: 'meet-001',
    societyId: 'soc-001',
    title: 'Annual General Meeting 2026',
    description: 'Annual General Meeting of the society members to discuss audit report and new rules.',
    meetingType: 'AGM',
    status: 'SCHEDULED',
    scheduledDate: '2026-07-15',
    scheduledTime: '10:00 AM',
    venue: 'Society Clubhouse Lawn',
    organizer: 'Society Secretary',
    organizerRole: 'Secretary',
    quorumRequired: 30,
    quorumStatus: 'PENDING',
    totalMembers: 120,
    confirmedCount: 45,
    presentCount: 0,
    proxyCount: 0,
    agendaItemCount: 5,
    resolutionCount: 2,
    hasMinutes: false,
    createdAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-01T10:00:00Z',
    ...overrides,
  };
}

export function createResolution(overrides: Partial<Resolution> = {}): Resolution {
  return {
    id: 'res-001',
    meetingId: 'meet-001',
    meetingTitle: 'Annual General Meeting 2026',
    resolutionNumber: 'RES-2026-01',
    title: 'Modernization of Lift Systems in Tower B',
    description: 'Approve the modernization plan and special budget allocation of ₹5,00,000 for lift upgrades.',
    fullText: 'Be it resolved that the general body approves the modernization of lift systems in Tower B and authorizes the committee to assign the contract to Otis Elevators.',
    type: 'SPECIAL',
    status: 'OPEN_FOR_VOTING',
    proposerName: 'Amit Sharma',
    proposerUnit: 'A-1204',
    requiredMajority: '75%',
    totalEligibleVoters: 120,
    votesFor: 0,
    votesAgainst: 0,
    votesAbstained: 0,
    createdAt: '2026-07-08T12:00:00Z',
    ...overrides,
  };
}
