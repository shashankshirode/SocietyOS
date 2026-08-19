import type { Inspection } from '../types/disputeMediation.types';
import { includeWhenPresent } from "../utils/presentProperty";
export const mockFacilityInspections: Inspection[] = [
    {
        id: 'insp-001',
        inspectionNumber: 'INSP-2026-001',
        issueId: 'issue-001',
        issueNumber: 'IF-2026-001',
        assignedToName: 'Suresh Patil',
        scheduledTime: '2026-06-29T10:00:00Z',
        status: 'SCHEDULED',
        ...includeWhenPresent("findings", undefined),
        ...includeWhenPresent("rootCause", undefined),
        ...includeWhenPresent("recommendedAction", undefined),
        evidence: []
    },
    {
        id: 'insp-002',
        inspectionNumber: 'INSP-2026-002',
        issueId: 'issue-005',
        issueNumber: 'IF-2026-005',
        assignedToName: 'Suresh Patil',
        scheduledTime: '2026-06-21T14:00:00Z',
        status: 'COMPLETED',
        findings: 'Plaster scraped off over 3x2 feet area. Lighting fixture glass cover broken due to cabinet corner impact.',
        rootCause: 'Improper packing and handling during furniture movement.',
        recommendedAction: 'Involved resident must cover costs for wall plastering, painting, and fixture replacement.',
        evidence: [
            {
                id: 'ev-003',
                evidenceType: 'PHOTO',
                fileName: 'lobby_scraped_wall.jpg',
                fileSizePlaceholder: '3.1 MB',
                uploadedByUserName: 'Anil Kulkarni',
                uploadedAt: '2026-06-20T15:00:00Z'
            }
        ],
        completedAt: '2026-06-21T15:30:00Z'
    }
];
for (let i = 3; i <= 10; i++) {
    mockFacilityInspections.push({
        id: `insp-0${i}`,
        inspectionNumber: `INSP-2026-0${i}`,
        issueId: `issue-0${i}`,
        issueNumber: `IF-2026-0${i}`,
        assignedToName: 'Ramesh Pawar',
        scheduledTime: `2026-06-${20 + i % 8}T11:00:00Z`,
        status: i % 2 === 0 ? 'COMPLETED' : 'REQUESTED',
        ...includeWhenPresent("findings", i % 2 === 0 ? 'Normal wear and tear. No immediate violation found.' : undefined),
        evidence: []
    });
}

