import type { Election, ElectionCandidate } from '../types/election.types';
import type { ElectionReadinessStatus } from '../types/complianceCalendar.types';

export interface MockElectionReadiness {
  status: ElectionReadinessStatus;
  hasElectionOfficer: boolean;
  electionOfficerName?: string;
  nominationWindowStatus: 'NOT_STARTED' | 'OPEN' | 'CLOSED';
  candidateVerificationCompleted: boolean;
  totalCandidatesNominated: number;
  totalVotersVerified: number;
  warnings: string[];
}

export const mockElectionReadinessConfig: MockElectionReadiness = {
  status: 'READY_FOR_MOCK',
  hasElectionOfficer: true,
  electionOfficerName: 'Vikas Sharma (Cooperative Advocate)',
  nominationWindowStatus: 'OPEN',
  candidateVerificationCompleted: false,
  totalCandidatesNominated: 5,
  totalVotersVerified: 105,
  warnings: [
    'Secret Ballot feature remains in mock preview. No real observer credentials will be distributed.',
    'Final verification of voter rolls must be submitted to the local Cooperative Registrar.',
  ],
};

export const mockElectionsList: Election[] = [
  {
    id: 'elect-001',
    societyId: 'society-001',
    title: 'Managing Committee Election 2026-28',
    description: 'Biannual election of executive officers to the Green Valley Heights Managing Committee. Eligible owners may submit nominations.',
    status: 'NOMINATION_OPEN',
    positions: [
      { id: 'p-01', electionId: 'elect-001', title: 'Chairperson', positionType: 'CHAIRPERSON', vacancies: 1, candidates: [] },
      { id: 'p-02', electionId: 'elect-001', title: 'Secretary', positionType: 'SECRETARY', vacancies: 1, candidates: [] },
      { id: 'p-03', electionId: 'elect-001', title: 'Treasurer', positionType: 'TREASURER', vacancies: 1, candidates: [] },
    ],
    nominationStartDate: '2026-07-01',
    nominationEndDate: '2026-07-15',
    votingStartDate: '2026-07-25',
    votingEndDate: '2026-07-28',
    totalEligibleVoters: 105,
    totalVotes: 0,
    conductedBy: 'Vikas Sharma (Election Officer)',
    createdAt: '2026-06-25T10:00:00Z',
    updatedAt: '2026-06-29T10:00:00Z',
  },
];

export const mockCandidateNominations: ElectionCandidate[] = [
  {
    id: 'cand-001',
    positionId: 'p-01',
    residentId: 'resident-101',
    name: 'Sunil Patil',
    unit: 'B-201',
    nominationStatus: 'APPROVED',
    proposedBy: 'Anil Deshmukh',
    secondedBy: 'Amit Joshi',
    manifesto: 'Goal is 100% solar water heater integration, CCTV coverage extensions, and digital bills.',
    voteCount: 0,
    isElected: false,
  },
  {
    id: 'cand-002',
    positionId: 'p-01',
    residentId: 'resident-102',
    name: 'Dilip Rao',
    unit: 'A-901',
    nominationStatus: 'APPROVED',
    proposedBy: 'Kavita Desai',
    secondedBy: 'Vikram Rao',
    manifesto: 'Focus on transparent accounts, audit compliance, and reduction in maintenance expenses.',
    voteCount: 0,
    isElected: false,
  },
  {
    id: 'cand-003',
    positionId: 'p-02',
    residentId: 'resident-103',
    name: 'Anil Deshmukh',
    unit: 'A-301',
    nominationStatus: 'SUBMITTED',
    proposedBy: 'Sunil Patil',
    secondedBy: 'Priya Sharma',
    manifesto: 'Dedicated to regular assemblies, complaints resolution inside 48 hours, and clean lawns.',
    voteCount: 0,
    isElected: false,
  },
  {
    id: 'cand-004',
    positionId: 'p-03',
    residentId: 'resident-104',
    name: 'Amit Joshi',
    unit: 'A-102',
    nominationStatus: 'APPROVED',
    proposedBy: 'Sunil Patil',
    secondedBy: 'Anil Deshmukh',
    manifesto: 'Ensure zero-dues society maintenance, investment audits, and reserve capital allocations.',
    voteCount: 0,
    isElected: false,
  },
  {
    id: 'cand-005',
    positionId: 'p-03',
    residentId: 'resident-105',
    name: 'Rajesh Mehta',
    unit: 'C-302',
    nominationStatus: 'UNDER_REVIEW',
    proposedBy: 'Vikram Rao',
    secondedBy: 'Priya Sharma',
    manifesto: 'Modernize society ledger tracking, integrate automatic payment reminders, and publish monthly budgets.',
    voteCount: 0,
    isElected: false,
  },
];
