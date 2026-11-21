import type { InterFlatIssue, InterFlatIssueType, InterFlatIssueSeverity, InterFlatIssueStatus } from '../types/interFlat.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockInterFlatIssues: InterFlatIssue[] = [
    {
        id: 'issue-001',
        issueNumber: 'IF-2026-001',
        issueType: 'WATER_LEAKAGE',
        severity: 'HIGH',
        status: 'INSPECTION_SCHEDULED',
        reporterUserId: 'resident-001',
        reporterUserName: 'Shashank',
        reporterFlat: 'A-1204',
        reporterTower: 'A Wing',
        involvedFlat: 'A-1304',
        involvedTower: 'A Wing',
        involvedResidentName: 'Amit Sharma',
        location: 'Master Bathroom Ceiling',
        description: 'Continuous dampness and water dripping from the ceiling near the shower area. Suspect leakage from the flat above.',
        preferredResolution: 'Identify and repair the pipe leak in the upper bathroom floor slab.',
        evidence: [
            {
                id: 'ev-001',
                evidenceType: 'PHOTO',
                fileName: 'ceiling_dampness.jpg',
                fileSizePlaceholder: '2.4 MB',
                uploadedByUserName: 'Shashank',
                uploadedAt: '2026-06-25T10:00:00Z',
                note: 'Damp spot spreading on bathroom ceiling'
            }
        ],
        responses: [],
        inspectionId: 'insp-001',
        createdAt: '2026-06-25T10:05:00Z',
        updatedAt: '2026-06-25T14:30:00Z'
    },
    {
        id: 'issue-002',
        issueNumber: 'IF-2026-002',
        issueType: 'NOISE_DISTURBANCE',
        severity: 'MEDIUM',
        status: 'NEIGHBOUR_NOTIFIED',
        reporterUserId: 'resident-002',
        reporterUserName: 'Karan Malhotra',
        reporterFlat: 'B-0802',
        reporterTower: 'B Wing',
        involvedFlat: 'B-0803',
        involvedTower: 'B Wing',
        involvedResidentName: 'Vikram Seth',
        location: 'Common Wall Living Room',
        description: 'Loud music and TV noise past 11:00 PM on weekdays. Repeated disturbance despite multiple polite requests.',
        preferredResolution: 'Observe quiet hours after 10:00 PM as per society rules.',
        evidence: [
            {
                id: 'ev-002',
                evidenceType: 'AUDIO_NOTE',
                fileName: 'night_noise_recording.mp3',
                fileSizePlaceholder: '1.2 MB',
                uploadedByUserName: 'Karan Malhotra',
                uploadedAt: '2026-06-26T23:15:00Z',
                note: 'Recorded at 11:30 PM in the bedroom'
            }
        ],
        responses: [],
        createdAt: '2026-06-27T08:00:00Z',
        updatedAt: '2026-06-27T08:05:00Z'
    },
    {
        id: 'issue-003',
        issueNumber: 'IF-2026-003',
        issueType: 'RENOVATION_DISTURBANCE',
        severity: 'MEDIUM',
        status: 'RESPONSE_RECEIVED',
        reporterUserId: 'resident-001',
        reporterUserName: 'Shashank',
        reporterFlat: 'A-1204',
        reporterTower: 'A Wing',
        involvedFlat: 'A-1203',
        involvedTower: 'A Wing',
        involvedResidentName: 'Rajesh Gupta',
        location: 'Adjacent Wall',
        description: 'Heavy drilling and wall demolition work continues past 6:30 PM, violating the allowed working hours (9 AM - 6 PM).',
        preferredResolution: 'Stop all noisy renovation work strictly by 6:00 PM.',
        evidence: [],
        responses: [
            {
                id: 'resp-001',
                responseType: 'ACKNOWLEDGE_AND_COOPERATE',
                explanation: 'Apologies for the inconvenience. The contractors were finishing a critical slab casting. I have instructed them to stop all work by 5:30 PM henceforth.',
                willCooperateWithInspection: true,
                responderName: 'Rajesh Gupta',
                responderFlat: 'A-1203',
                respondedAt: '2026-06-28T11:00:00Z',
                evidence: []
            }
        ],
        createdAt: '2026-06-28T09:00:00Z',
        updatedAt: '2026-06-28T11:00:00Z'
    },
    {
        id: 'issue-004',
        issueNumber: 'IF-2026-004',
        issueType: 'PET_NUISANCE',
        severity: 'LOW',
        status: 'MEDIATION_ACTIVE',
        reporterUserId: 'resident-001',
        reporterUserName: 'Current resident',
        reporterFlat: 'A-1204',
        reporterTower: 'Tower A',
        involvedFlat: 'C-1502',
        involvedTower: 'C Wing',
        involvedResidentName: 'Rahul Mehta',
        location: 'Common Lobby and Lift Area',
        description: 'Pet dog is frequently left unleashed in the common lobby. It barks and frightens children and senior citizens near the lift.',
        preferredResolution: 'Ensure the dog is always leashed in all common areas of the society.',
        evidence: [],
        responses: [
            {
                id: 'resp-002',
                responseType: 'DISAGREE',
                explanation: 'My dog is extremely friendly and trained. I only leash him inside the elevator, but I will try to be more mindful in the lobby.',
                willCooperateWithInspection: true,
                responderName: 'Rahul Mehta',
                responderFlat: 'C-1502',
                respondedAt: '2026-06-29T10:00:00Z',
                evidence: []
            }
        ],
        mediationId: 'med-001',
        createdAt: '2026-06-29T08:30:00Z',
        updatedAt: '2026-06-29T10:00:00Z'
    },
    {
        id: 'issue-005',
        issueNumber: 'IF-2026-005',
        issueType: 'PARKING_DISPUTE',
        severity: 'MEDIUM',
        status: 'PROPOSAL_PENDING',
        reporterUserId: 'resident-001',
        reporterUserName: 'Shashank',
        reporterFlat: 'A-1204',
        reporterTower: 'Tower A',
        involvedFlat: 'A-1205',
        involvedTower: 'Tower A',
        involvedResidentName: 'Deepak Joshi',
        location: 'Basement Parking B2-P114',
        description: 'Neighbor repeatedly parks their SUV over the white line demarcation, making it difficult to open the driver-side door of flat A-1204 car.',
        preferredResolution: 'Re-align vehicle within the designated yellow boundary markings.',
        evidence: [],
        responses: [],
        createdAt: '2026-07-02T14:20:00Z',
        updatedAt: '2026-07-03T09:10:00Z'
    },
    {
        id: 'issue-006',
        issueNumber: 'IF-2026-006',
        issueType: 'TRASH_DISPOSAL',
        severity: 'LOW',
        status: 'RESOLVED',
        reporterUserId: 'resident-004',
        reporterUserName: 'Anil Kulkarni',
        reporterFlat: 'B-0402',
        reporterTower: 'B Wing',
        involvedFlat: 'B-0403',
        involvedTower: 'B Wing',
        involvedResidentName: 'Sanjay Shah',
        location: 'Floor 4 Lift Lobby',
        description: 'While moving heavy furniture, the shifting crew scraped and damaged the decorative wall plaster and lighting fixture in the lobby.',
        preferredResolution: 'Repair the wall plaster and replace the broken light fixture casing.',
        evidence: [
            {
                id: 'ev-003',
                evidenceType: 'PHOTO',
                fileName: 'lobby_scraped_wall.jpg',
                fileSizePlaceholder: '3.1 MB',
                uploadedByUserName: 'Anil Kulkarni',
                uploadedAt: '2026-06-20T15:00:00Z',
                note: 'Wall damage right next to lift B-2'
            }
        ],
        responses: [
            {
                id: 'resp-003',
                responseType: 'ACKNOWLEDGE_AND_COOPERATE',
                explanation: 'The shifting agency made a mistake. I agree to pay for the repair or get my own painter to fix the wall next weekend.',
                willCooperateWithInspection: true,
                responderName: 'Sanjay Shah',
                responderFlat: 'B-0403',
                respondedAt: '2026-06-21T10:00:00Z',
                evidence: []
            }
        ],
        resolvedAt: '2026-06-24T17:00:00Z',
        closedAt: '2026-06-25T09:00:00Z',
        closureSummary: 'Involved resident hired the society painter and restored the lobby wall plaster to original condition. Verified by Facility Manager.',
        createdAt: '2026-06-20T16:15:00Z',
        updatedAt: '2026-06-25T09:00:00Z'
    }
];
for (let i = 6; i <= 20; i++) {
    const types: InterFlatIssueType[] = ['WATER_LEAKAGE', 'NOISE_DISTURBANCE', 'RENOVATION_DISTURBANCE', 'PET_NUISANCE', 'COMMON_AREA_DAMAGE', 'ODOUR_OR_SMOKE', 'PARKING_RELATED', 'OBJECT_IN_COMMON_AREA', 'OTHER'];
    const severities: InterFlatIssueSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const statuses: InterFlatIssueStatus[] = ['SUBMITTED', 'NEIGHBOUR_NOTIFIED', 'AWAITING_RESPONSE', 'RESOLVED', 'CLOSED'];
    const type = getRequiredItem(types, i % types.length, "interFlatIssues.mock.ts");
    const severity = getRequiredItem(severities, i % severities.length, "interFlatIssues.mock.ts");
    const status = getRequiredItem(statuses, i % statuses.length, "interFlatIssues.mock.ts");
    mockInterFlatIssues.push({
        id: `issue-0${i}`,
        issueNumber: `IF-2026-0${i}`,
        issueType: type,
        severity: severity,
        status: status,
        reporterUserId: `resident-0${i % 5 + 1}`,
        reporterUserName: i % 2 === 0 ? 'Meera Nair' : 'Suresh Menon',
        reporterFlat: `A-0${i}01`,
        reporterTower: 'A Wing',
        involvedFlat: `A-0${i + 1}01`,
        involvedTower: 'A Wing',
        involvedResidentName: i % 2 === 0 ? 'Prakash Rao' : 'Vijay Joshi',
        location: 'Balcony / Passage Area',
        description: `Automated mock description for a ${type} concern on the balcony area. Needs attention.`,
        evidence: [],
        responses: [],
        createdAt: `2026-06-${10 + i % 15}T09:00:00Z`,
        updatedAt: `2026-06-${10 + i % 15}T11:00:00Z`
    });
}

