import type { RuleAcknowledgement } from '../types/rules.types';

export const mockRuleAcknowledgements: RuleAcknowledgement[] = [
  {
    id: 'ack-001',
    ruleId: 'rule-001',
    ruleTitle: 'Silent Hours and Noise Control',
    ruleVersion: '2.1',
    userName: 'Shashank',
    unitId: 'unit-a-1204',
    flatNumber: 'A-1204',
    acknowledgedAt: '2026-06-10T11:00:00Z',
    referenceNumber: 'ACK-R001-9874',
    status: 'ACKNOWLEDGED'
  },
  {
    id: 'ack-002',
    ruleId: 'rule-002',
    ruleTitle: 'Renovation Permit and Timing Guidelines',
    ruleVersion: '1.2',
    userName: 'Shashank',
    unitId: 'unit-a-1204',
    flatNumber: 'A-1204',
    acknowledgedAt: '2026-06-12T14:30:00Z',
    referenceNumber: 'ACK-R002-1245',
    status: 'ACKNOWLEDGED'
  }
];


for (let i = 3; i <= 40; i++) {
  mockRuleAcknowledgements.push({
    id: `ack-0${i}`,
    ruleId: `rule-0${i % 3 + 1}`,
    ruleTitle: i % 3 === 0 ? 'Silent Hours and Noise Control' : i % 3 === 1 ? 'Renovation Permit and Timing Guidelines' : 'Pet Care and Lobby Leash Rules',
    ruleVersion: '1.0',
    userName: i % 2 === 0 ? 'Amit Sharma' : 'Karan Malhotra',
    unitId: `unit-a-1${i}04`,
    flatNumber: `A-1${i}04`,
    acknowledgedAt: `2026-06-${10 + i % 15}T10:00:00Z`,
    referenceNumber: `ACK-REF-0${i}89`,
    status: i % 5 === 0 ? 'PENDING' : 'ACKNOWLEDGED'
  });
}
