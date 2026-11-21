import { parentIncidentService } from '../services/parentIncidentService';
import { complaintService } from '../services/complaintService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { Complaint, SlaPolicy } from '../../../shared/types/complaintPhase6';
describe('Parent Incident & Duplicate Lifecycle (Phase 6 Invariants 15 & 16)', () => {
    const societyId = 'soc-palm-grove-01';
    const otherSocietyId = 'soc-green-valley-02';
    const adminId = 'admin-helpdesk-01';
    const waterSlaPolicy: SlaPolicy = {
        id: 'sla-water-01',
        societyId,
        name: 'Water Supply SLA',
        description: 'SLA for water leaks and pressure',
        policyType: 'FIXED_HOURS',
        categoryId: 'WATER_LEAKAGE',
        priority: 'HIGH',
        responseTimeHours: 2,
        resolutionTimeHours: 12,
        acknowledgementTimeHours: 1,
        businessHoursOnly: false,
        warningThresholdPercent: 80,
        version: 1,
        isActive: true,
        effectiveFrom: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    beforeEach(() => {
        mockStore.getState().complaints = [];
        mockStore.getState().parentIncidents = [];
        mockStore.getState().correlationCandidates = [];
        mockStore.getState().slaPolicies = [waterSlaPolicy];
    });
    it('detects correlation candidates when multiple complaints match rule criteria', async () => {
        const c1Res = await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Severe low water pressure',
                description: 'No water pressure in master bath',
                priority: 'HIGH',
                location: 'Tower C Flat 301',
            },
            reporterUserId: 'user-c301',
            reporterDisplayName: 'Alice C',
            reporterRole: 'RESIDENT_OWNER',
            unitId: 'unit-c301',
            unitNumber: 'C-301',
            tower: 'Tower C',
            floor: 3,
            societyId,
        });
        const c2Res = await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Low pressure water supply',
                description: 'Taps have very low water pressure',
                priority: 'HIGH',
                location: 'Tower C Flat 402',
            },
            reporterUserId: 'user-c402',
            reporterDisplayName: 'Bob C',
            reporterRole: 'RESIDENT_TENANT',
            unitId: 'unit-c402',
            unitNumber: 'C-402',
            tower: 'Tower C',
            floor: 4,
            societyId,
        });
        const c3Res = await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Completely no water / low pressure',
                description: 'Taps sputtering with low pressure water',
                priority: 'HIGH',
                location: 'Tower C Flat 501',
            },
            reporterUserId: 'user-c501',
            reporterDisplayName: 'Charlie C',
            reporterRole: 'RESIDENT_OWNER',
            unitId: 'unit-c501',
            unitNumber: 'C-501',
            tower: 'Tower C',
            floor: 5,
            societyId,
        });
        expect(c1Res.success).toBe(true);
        expect(c2Res.success).toBe(true);
        expect(c3Res.success).toBe(true);
        const candidates = await parentIncidentService.evaluateForCorrelation(c3Res.complaint!);
        expect(candidates.length).toBeGreaterThan(0);
        const candidate = candidates[0]!;
        expect(candidate.ruleId).toBe('rule-water-pressure');
        expect(candidate.confidence).toBeGreaterThan(0.6);
        expect(candidate.complaintIds).toContain(c1Res.complaint!.id);
        expect(candidate.complaintIds).toContain(c2Res.complaint!.id);
        expect(candidate.complaintIds).toContain(c3Res.complaint!.id);
    });
    it('confirms correlation candidate into authoritative Parent Incident without losing child history (Invariant 15)', async () => {
        const c1 = (await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Low water pressure',
                description: 'Bathroom taps barely dripping',
                priority: 'HIGH',
            },
            reporterUserId: 'user-1',
            reporterDisplayName: 'User One',
            reporterRole: 'RESIDENT_OWNER',
            unitId: 'unit-1',
            tower: 'Tower A',
            societyId,
        })).complaint!;
        const c2 = (await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Low water pressure in kitchen',
                description: 'Sink has low water pressure',
                priority: 'HIGH',
            },
            reporterUserId: 'user-2',
            reporterDisplayName: 'User Two',
            reporterRole: 'RESIDENT_TENANT',
            unitId: 'unit-2',
            tower: 'Tower A',
            societyId,
        })).complaint!;
        const c3 = (await complaintService.createComplaint({
            payload: {
                category: 'WATER_LEAKAGE',
                title: 'Low water pressure',
                description: 'Entire apartment low water pressure',
                priority: 'HIGH',
            },
            reporterUserId: 'user-3',
            reporterDisplayName: 'User Three',
            reporterRole: 'RESIDENT_OWNER',
            unitId: 'unit-3',
            tower: 'Tower A',
            societyId,
        })).complaint!;
        const candidates = await parentIncidentService.evaluateForCorrelation(c3);
        expect(candidates.length).toBeGreaterThan(0);
        const result = await parentIncidentService.confirmCandidate(candidates[0]!.id, adminId);
        expect(result).not.toBeNull();
        expect(result?.parentIncidentId).toBeDefined();
        const parent = await parentIncidentService.getParentIncident(result!.parentIncidentId);
        expect(parent).toBeDefined();
        expect(parent.status).toBe('CONFIRMED');
        expect(parent.childComplaintIds.length).toBe(3);
        const child1 = (await complaintService.getComplaint(c1.id))!;
        expect(child1.parentIncidentId).toBe(result!.parentIncidentId);
        expect(child1.reportedByUserId).toBe('user-1');
        expect(child1.title).toBe('Low water pressure');
        expect(child1.ticketNumber).toBe(c1.ticketNumber);
        const child2 = (await complaintService.getComplaint(c2.id))!;
        expect(child2.parentIncidentId).toBe(result!.parentIncidentId);
        expect(child2.reportedByUserId).toBe('user-2');
    });
    it('unlinks false correlation restoring child complaint to independent operational state', async () => {
        const c1 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'user-1',
            reporterDisplayName: 'User One',
            reporterRole: 'RESIDENT_OWNER',
            societyId,
        })).complaint!;
        const c2 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'user-2',
            reporterDisplayName: 'User Two',
            reporterRole: 'RESIDENT_OWNER',
            societyId,
        })).complaint!;
        const parentResult = await parentIncidentService.createParentIncidentFromComplaints([c1.id, c2.id], 'rule-water-pressure', 0.9, adminId);
        expect(parentResult).not.toBeNull();
        const unlinkRes = await parentIncidentService.unlinkFromParent(c2.id);
        expect(unlinkRes.success).toBe(true);
        const unlinkedChild = (await complaintService.getComplaint(c2.id))!;
        expect(unlinkedChild.parentIncidentId).toBeUndefined();
        const remainingChild = (await complaintService.getComplaint(c1.id))!;
        expect(remainingChild.parentIncidentId).toBe(parentResult!.parentIncidentId);
        const parent = await parentIncidentService.getParentIncident(parentResult!.parentIncidentId);
        expect(parent.childComplaintIds).not.toContain(c2.id);
        expect(parent.childComplaintIds).toContain(c1.id);
    });
    it('resolves parent incident and updates children with reconciliation (Invariant 16)', async () => {
        const c1 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'user-1',
            reporterDisplayName: 'User One',
            reporterRole: 'RESIDENT_OWNER',
            societyId,
        })).complaint!;
        const c2 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'user-2',
            reporterDisplayName: 'User Two',
            reporterRole: 'RESIDENT_OWNER',
            societyId,
        })).complaint!;
        const parentResult = await parentIncidentService.createParentIncidentFromComplaints([c1.id, c2.id], 'rule-water-pressure', 0.95, adminId);
        await parentIncidentService.resolveParentIncident({
            parentIncidentId: parentResult!.parentIncidentId,
            adminId,
            rootCause: 'Main booster pump tripped due to voltage fluctuation',
            resolutionSummary: 'Replaced contactor switch and restarted pump. Full 3.5 bar pressure restored.',
        });
        const parent = await parentIncidentService.getParentIncident(parentResult!.parentIncidentId);
        expect(parent.status).toBe('RESOLVED');
        expect(parent.rootCause).toContain('booster pump');
        const child1 = (await complaintService.getComplaint(c1.id))!;
        expect(child1.status).toBe('RESOLVED');
        expect(child1.resolutionSummary).toContain('Full 3.5 bar pressure restored');
        const child2 = (await complaintService.getComplaint(c2.id))!;
        expect(child2.status).toBe('RESOLVED');
        expect(child2.resolutionSummary).toContain('Full 3.5 bar pressure restored');
    });
    it('rejects candidate when supervisor flags correlation as invalid', async () => {
        const c1 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'u1',
            reporterDisplayName: 'User 1',
            reporterRole: 'RESIDENT_OWNER',
            tower: 'Tower B',
            societyId,
        })).complaint!;
        const c2 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'u2',
            reporterDisplayName: 'User 2',
            reporterRole: 'RESIDENT_OWNER',
            tower: 'Tower B',
            societyId,
        })).complaint!;
        const c3 = (await complaintService.createComplaint({
            payload: { category: 'WATER_LEAKAGE', title: 'Low pressure water', description: 'desc', priority: 'HIGH' },
            reporterUserId: 'u3',
            reporterDisplayName: 'User 3',
            reporterRole: 'RESIDENT_OWNER',
            tower: 'Tower B',
            societyId,
        })).complaint!;
        const candidates = await parentIncidentService.evaluateForCorrelation(c3);
        expect(candidates.length).toBeGreaterThan(0);
        await parentIncidentService.rejectCandidate(candidates[0]!.id, adminId);
        const updatedCandidates = mockStore.getState().correlationCandidates || [];
        const rejected = updatedCandidates.find((c: any) => c.id === candidates[0]!.id);
        expect(rejected?.status).toBe('REJECTED');
    });
});

