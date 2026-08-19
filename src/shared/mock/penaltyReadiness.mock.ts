import type { PenaltyReadiness } from '../types/rules.types';

export const mockPenaltyReadiness: PenaltyReadiness[] = [
  {
    id: 'pen-001',
    violationId: 'viol-001',
    violationNumber: 'VIOL-2026-001',
    flatNumber: 'B-0803',
    ruleTitle: 'Silent Hours and Noise Control',
    status: 'APPROVAL_REQUIRED',
    proposedAmount: 500,
    appealSubmitted: false,
    escalatedToCommittee: false
  },
  {
    id: 'pen-002',
    violationId: 'viol-002',
    violationNumber: 'VIOL-2026-002',
    flatNumber: 'A-1203',
    ruleTitle: 'Renovation Permit and Timing Guidelines',
    status: 'NOTICE_REQUIRED',
    proposedAmount: 2000,
    appealSubmitted: false,
    escalatedToCommittee: false
  }
];

for (let i = 3; i <= 5; i++) {
  mockPenaltyReadiness.push({
    id: `pen-0${i}`,
    violationId: `viol-0${i}`,
    violationNumber: `VIOL-2026-0${i}`,
    flatNumber: `C-1${i}02`,
    ruleTitle: 'Mock Society Rule',
    status: 'READY_FOR_BILLING',
    proposedAmount: 1000,
    appealSubmitted: i % 2 === 0,
    escalatedToCommittee: i % 2 === 0
  });
}
