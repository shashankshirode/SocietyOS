import type { Proposal } from '../types/disputeMediation.types';
import { includeWhenPresent } from "../utils/presentProperty";
export const mockResolutionProposals: Proposal[] = [
    {
        id: 'prop-001',
        mediationId: 'med-001',
        proposedResolution: 'Pet owner agrees to keep the dog on a short leash at all times in the elevator and lobby. Reporter agrees to close the dispute upon 1 week of compliance.',
        responsibleParty: 'Rahul Mehta (Pet Owner)',
        targetDate: '2026-07-05',
        acceptanceScope: 'BOTH_PARTIES',
        ...includeWhenPresent("reporterAccepted", undefined),
        ...includeWhenPresent("involvedFlatAccepted", undefined),
        createdAt: '2026-06-26T10:00:00Z'
    }
];
for (let i = 2; i <= 8; i++) {
    mockResolutionProposals.push({
        id: `prop-0${i}`,
        mediationId: `med-0${i}`,
        proposedResolution: `Automated proposed resolution for dispute case ${i}. Please follow designated timelines.`,
        responsibleParty: `Flat A-0${i}01`,
        targetDate: `2026-07-1${i}`,
        acceptanceScope: 'BOTH_PARTIES',
        ...includeWhenPresent("reporterAccepted", i % 2 === 0 ? true : undefined),
        ...includeWhenPresent("involvedFlatAccepted", i % 3 === 0 ? true : undefined),
        createdAt: `2026-06-2${i}T10:00:00Z`
    });
}

