import type { MediationCase } from '../types/disputeMediation.types';

export const mockDisputeMediations: MediationCase[] = [
  {
    id: 'med-001',
    caseNumber: 'MED-2026-001',
    issueId: 'issue-004',
    issueNumber: 'IF-2026-004',
    reporterFlat: 'A-1204',
    involvedFlat: 'C-1502',
    mediatorName: 'Anil Deshmukh',
    status: 'IN_DISCUSSION',
    notes: [
      {
        id: 'note-001',
        authorName: 'Anil Deshmukh',
        noteText: 'Spoke to Sunita. She is concerned about her toddler who got scared by the dog. She is willing to resolve if leashing is followed.',
        visibility: 'MEDIATOR_ONLY',
        createdAt: '2026-06-25T14:00:00Z'
      },
      {
        id: 'note-002',
        authorName: 'Anil Deshmukh',
        noteText: 'Spoke to Rahul. He claims the dog was on leash but broke free once. He is open to using a short leash in the elevator.',
        visibility: 'FACILITY_AND_COMMITTEE',
        createdAt: '2026-06-25T15:30:00Z'
      }
    ],
    proposals: [
      {
        id: 'prop-001',
        mediationId: 'med-001',
        proposedResolution: 'Pet owner agrees to keep the dog on a short leash at all times in the elevator and lobby. Reporter agrees to close the dispute upon 1 week of compliance.',
        responsibleParty: 'Rahul Mehta (Pet Owner)',
        targetDate: '2026-07-05',
        acceptanceScope: 'BOTH_PARTIES',
        createdAt: '2026-06-26T10:00:00Z'
      }
    ],
    createdAt: '2026-06-25T09:30:00Z',
    updatedAt: '2026-06-26T10:00:00Z'
  }
];

for (let i = 2; i <= 8; i++) {
  mockDisputeMediations.push({
    id: `med-0${i}`,
    caseNumber: `MED-2026-0${i}`,
    issueId: `issue-0${i}`,
    issueNumber: `IF-2026-0${i}`,
    reporterFlat: `A-0${i}01`,
    involvedFlat: `A-0${i+1}01`,
    mediatorName: 'Anil Deshmukh',
    status: i % 2 === 0 ? 'RESOLUTION_PROPOSED' : 'ASSIGNED',
    notes: [],
    proposals: [],
    createdAt: `2026-06-${20 + i % 7}T10:00:00Z`,
    updatedAt: `2026-06-${20 + i % 7}T12:00:00Z`
  });
}
