import type { RuleViolation } from '../types/rules.types';

export const mockRuleViolations: RuleViolation[] = [
  {
    id: 'viol-001',
    violationNumber: 'VIOL-2026-001',
    ruleId: 'rule-001',
    ruleTitle: 'Silent Hours and Noise Control',
    flatNumber: 'B-0803',
    violatedBy: 'Vikram Seth',
    dateOfViolation: '2026-06-26T23:30:00Z',
    description: 'Loud party music past 11:30 PM. Triggered by resident complaint and confirmed by security guard check.',
    status: 'RESPONSE_PENDING',
    evidencePlaceholderCount: 1,
    penaltyAmount: 500,
    notes: 'Resident was verbally warned by guard at 11:45 PM.'
  },
  {
    id: 'viol-002',
    violationNumber: 'VIOL-2026-002',
    ruleId: 'rule-002',
    ruleTitle: 'Renovation Permit and Timing Guidelines',
    flatNumber: 'A-1203',
    violatedBy: 'Rajesh Gupta',
    dateOfViolation: '2026-06-28T18:45:00Z',
    description: 'Demolition hammer drilling at 6:45 PM on a weekday.',
    status: 'RECORDED',
    evidencePlaceholderCount: 0,
    penaltyAmount: 2000,
    notes: 'Contractor warned. Work stopped immediately.'
  }
];

for (let i = 3; i <= 8; i++) {
  mockRuleViolations.push({
    id: `viol-0${i}`,
    violationNumber: `VIOL-2026-0${i}`,
    ruleId: `rule-0${i % 3 + 1}`,
    ruleTitle: 'General Society Regulation',
    flatNumber: `C-1${i}02`,
    violatedBy: 'Mock Offender',
    dateOfViolation: `2026-06-2${i}T15:00:00Z`,
    description: `Automated mock record of violation ${i}. For placeholder testing.`,
    status: 'DRAFT',
    evidencePlaceholderCount: 0,
    penaltyAmount: 500
  });
}
