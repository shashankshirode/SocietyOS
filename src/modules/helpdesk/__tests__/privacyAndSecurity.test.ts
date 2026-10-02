import { complaintService } from '../services/complaintService';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { SlaPolicy } from '../../../shared/types/complaintPhase6';
describe('Phase 6 Privacy, Security, IDOR Protection & Multi-Tenant Boundaries', () => {
    const societyA = 'soc-alpha-01';
    const societyB = 'soc-beta-02';
    const residentA = 'user-resident-a';
    const residentB = 'user-resident-b';
    const techUser = 'tech-001';
    const adminUser = 'admin-helpdesk-01';
    const defaultPolicy: SlaPolicy = {
        id: 'sla-default',
        societyId: societyA,
        name: 'Default SLA',
        description: 'SLA for privacy tests',
        policyType: 'FIXED_HOURS',
        categoryId: 'SECURITY',
        priority: 'HIGH',
        responseTimeHours: 1,
        resolutionTimeHours: 8,
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
        mockStore.getState().complaintComments = [];
        mockStore.getState().slaPolicies = [
            defaultPolicy,
            { ...defaultPolicy, id: 'sla-beta', societyId: societyB },
        ];
    });
    describe('Invariant 6: Internal Comment Privacy', () => {
        it('never leaks internal comments to residents while allowing staff to view them', async () => {
            const createRes = await complaintService.createComplaint({
                payload: {
                    category: 'SECURITY',
                    title: 'Suspicious individual in corridor',
                    description: 'Loitering near fire stairwell.',
                    priority: 'HIGH',
                },
                reporterUserId: residentA,
                reporterDisplayName: 'Resident Alice',
                reporterRole: 'RESIDENT_OWNER',
                societyId: societyA,
            });
            const complaintId = createRes.complaint!.id;
            await complaintService.addComment({
                complaintId,
                authorUserId: adminUser,
                authorDisplayName: 'Admin Desk',
                authorRole: 'ADMIN',
                content: 'Security patrol has been dispatched.',
                visibility: 'PUBLIC',
            });
            await complaintService.addComment({
                complaintId,
                authorUserId: adminUser,
                authorDisplayName: 'Admin Desk',
                authorRole: 'ADMIN',
                content: 'CCTV footage shows suspect matches vendor contractor ID #492. Police may need to be notified.',
                visibility: 'INTERNAL_ONLY',
            });
            const residentComments = await complaintService.getComplaintComments(complaintId, 'RESIDENT_OWNER');
            expect(residentComments.length).toBe(1);
            expect(residentComments[0].visibility).toBe('PUBLIC');
            expect(residentComments.some(c => c.content.includes('CCTV footage'))).toBe(false);
            const staffComments = await complaintService.getComplaintComments(complaintId, 'ADMIN');
            expect(staffComments.length).toBe(2);
            expect(staffComments.some(c => c.visibility === 'INTERNAL_ONLY')).toBe(true);
        });
    });
    describe('Invariant 7: Private Complaint Boundary & Authorization', () => {
        it('restricts private complaint access exclusively to reporter and authorized staff', async () => {
            const privateComplaint = (await complaintService.createComplaint({
                payload: {
                    category: 'SECURITY',
                    title: 'Harassment complaint regarding neighbor',
                    description: 'Confidential sensitive grievance.',
                    priority: 'HIGH',
                    isPrivate: true,
                },
                reporterUserId: residentA,
                reporterDisplayName: 'Resident Alice',
                reporterRole: 'RESIDENT_OWNER',
                societyId: societyA,
                isPrivate: true,
            })).complaint!;
            expect(privateComplaint.isPrivate).toBe(true);
            const reporterView = await complaintService.getComplaint(privateComplaint.id, {
                userId: residentA,
                role: 'RESIDENT_OWNER',
                societyId: societyA,
            });
            expect(reporterView).not.toBeNull();
            expect(reporterView?.id).toBe(privateComplaint.id);
            const adminView = await complaintService.getComplaint(privateComplaint.id, {
                userId: adminUser,
                role: 'ADMIN',
                societyId: societyA,
            });
            expect(adminView).not.toBeNull();
            const otherResidentView = await complaintService.getComplaint(privateComplaint.id, {
                userId: residentB,
                role: 'RESIDENT_OWNER',
                societyId: societyA,
            });
            expect(otherResidentView).toBeNull();
        });
    });
    describe('Invariant 4 & 5: Multi-Tenant Society Isolation & IDOR Protection', () => {
        it('denies access to complaints across society boundaries', async () => {
            const complaintA = (await complaintService.createComplaint({
                payload: {
                    category: 'SECURITY',
                    title: 'Gate sensor offline',
                    description: 'Barrier arm not opening automatically.',
                    priority: 'HIGH',
                },
                reporterUserId: residentA,
                reporterDisplayName: 'Resident Alice',
                reporterRole: 'RESIDENT_OWNER',
                societyId: societyA,
            })).complaint!;
            const crossSocietyView = await complaintService.getComplaint(complaintA.id, {
                userId: 'admin-society-b',
                role: 'ADMIN',
                societyId: societyB,
            });
            expect(crossSocietyView).toBeNull();
            const closeRes = await complaintService.closeComplaint({
                complaintId: complaintA.id,
                closedByUserId: 'admin-society-b',
                closedByDisplayName: 'Cross Admin',
                societyId: societyB,
            });
            expect(closeRes.success).toBe(false);
            expect(closeRes.errorCode).toBe('FORBIDDEN_SOCIETY_MISMATCH');
        });
    });
});

