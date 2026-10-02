import { complaintService } from '../services/complaintService';
import { assignmentService } from '../services/assignmentService';
import { slaEngine } from '../services/slaEngine';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { Complaint, SlaPolicy } from '../../../shared/types/complaintPhase6';
describe('Complaint Lifecycle & State Machine (Phase 6 Core Invariants)', () => {
    const societyId = 'soc-palm-grove-01';
    const otherSocietyId = 'soc-green-valley-02';
    const reporterUserId = 'user-resident-101';
    const technicianUserId = 'tech-plumber-201';
    const adminUserId = 'admin-helpdesk-301';
    const defaultSlaPolicy: SlaPolicy = {
        id: 'sla-policy-plumbing-01',
        societyId,
        name: 'Plumbing Standard SLA',
        description: 'Standard 4h response, 24h resolution for plumbing',
        policyType: 'FIXED_HOURS',
        categoryId: 'PLUMBING',
        priority: 'NORMAL',
        responseTimeHours: 4,
        resolutionTimeHours: 24,
        acknowledgementTimeHours: 2,
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
        mockStore.getState().complaintAssignments = [];
        mockStore.getState().complaintHolds = [];
        mockStore.getState().complaintResolutions = [];
        mockStore.getState().complaintReopens = [];
        mockStore.getState().complaintFeedback = [];
        mockStore.getState().complaintComments = [];
        mockStore.getState().slaPolicies = [defaultSlaPolicy];
        mockStore.getState().staff = [
            {
                id: technicianUserId,
                name: 'Ramesh Plumber',
                role: 'TECHNICIAN',
                status: 'ACTIVE',
                societyId,
                skills: ['PLUMBING'],
                currentWorkload: 1,
                maxWorkload: 5,
                isAvailable: true,
            } as any,
        ];
    });
    describe('Invariant 1 & 3: Authoritative Creation, Stable Reference & Idempotency', () => {
        it('creates complaint with stable CMP-YYYY-XXXXXX reference and initializes SLA', async () => {
            const result = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Severe pipeline leakage under sink',
                    description: 'Water is gushing out rapidly into kitchen cabinet.',
                    priority: 'HIGH',
                    location: 'Kitchen, Flat 402',
                    isPrivate: false,
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                tower: 'Tower A',
                floor: 4,
                societyId,
                isPrivate: false,
            });
            expect(result.success).toBe(true);
            expect(result.complaint).toBeDefined();
            const complaint = result.complaint!;
            expect(complaint.status).toBe('CREATED');
            expect(complaint.ticketNumber).toMatch(/^CMP-\d{4}-\d{6}$/);
            expect(complaint.societyId).toBe(societyId);
            expect(complaint.reportedByUserId).toBe(reporterUserId);
            expect(complaint.slaPolicyId).toBe(defaultSlaPolicy.id);
            expect(complaint.slaResolutionDeadline).toBeDefined();
            expect(complaint.dataVersion).toBe(1);
        });
        it('idempotently returns same complaint when submitting identical idempotency key', async () => {
            const idempotencyKey = 'unique-submit-token-xyz-123';
            const input = {
                payload: {
                    category: 'PLUMBING' as const,
                    title: 'Pipe block',
                    description: 'Slow drainage in master bathroom washbasin.',
                    priority: 'NORMAL' as const,
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
                idempotencyKey,
            };
            const first = await complaintService.createComplaint(input);
            const second = await complaintService.createComplaint(input);
            expect(first.success).toBe(true);
            expect(second.success).toBe(true);
            expect(first.complaint?.id).toBe(second.complaint?.id);
            expect(first.complaint?.ticketNumber).toBe(second.complaint?.ticketNumber);
            expect(mockStore.getState().complaints.length).toBe(1);
        });
        it('fails when active SLA policy for category is missing', async () => {
            const result = await complaintService.createComplaint({
                payload: {
                    category: 'FIRE_SAFETY',
                    title: 'Extinguisher pressure low',
                    description: 'Corridor fire extinguisher gauge in red zone.',
                    priority: 'CRITICAL',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe('SLA_POLICY_NOT_FOUND');
        });
    });
    describe('Invariant 2: Explicit State Machine & Transition Rules', () => {
        let complaint: Complaint;
        beforeEach(async () => {
            const res = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Bathroom tap leak',
                    description: 'Continuous dripping faucet in guest bath.',
                    priority: 'NORMAL',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            complaint = res.complaint!;
        });
        it('rejects illegal transition directly from CREATED to CLOSED', async () => {
            const res = await complaintService.transitionStatus(complaint.id, 'CLOSED', adminUserId, 'Admin Officer', 'ADMIN');
            expect(res.success).toBe(false);
            expect(res.errorCode).toBe('INVALID_TRANSITION');
        });
        it('rejects illegal transition from CREATED to IN_PROGRESS directly', async () => {
            const res = await complaintService.transitionStatus(complaint.id, 'IN_PROGRESS', adminUserId, 'Admin Officer', 'ADMIN');
            expect(res.success).toBe(false);
            expect(res.errorCode).toBe('INVALID_TRANSITION');
        });
        it('allows legal classification and reassesses SLA priority', async () => {
            const classRes = await complaintService.classifyComplaint({
                complaintId: complaint.id,
                category: 'PLUMBING',
                priority: 'CRITICAL',
                classifiedByUserId: adminUserId,
                classifiedByDisplayName: 'Supervisor Roy',
                reason: 'Risk of flooding adjacent electrical riser',
            });
            expect(classRes.success).toBe(true);
            expect(classRes.complaint?.status).toBe('CLASSIFIED');
            expect(classRes.complaint?.priority).toBe('CRITICAL');
            expect(classRes.complaint?.dataVersion).toBe(2);
        });
    });
    describe('Invariant 11 & 12: Assignment, Acknowledgement & Reassignment History', () => {
        let complaint: Complaint;
        beforeEach(async () => {
            const res = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Main valve issue',
                    description: 'Water valve jammed open.',
                    priority: 'HIGH',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            complaint = res.complaint!;
            const classRes = await complaintService.classifyComplaint({
                complaintId: complaint.id,
                category: 'PLUMBING',
                classifiedByUserId: adminUserId,
                classifiedByDisplayName: 'Admin',
            });
            complaint = classRes.complaint!;
        });
        it('assigns eligible technician and records assignment history', async () => {
            const assignRes = await assignmentService.assignComplaint(complaint, technicianUserId, adminUserId, 'Admin Desk');
            expect(assignRes.success).toBe(true);
            expect(assignRes.assignment).toBeDefined();
            expect(assignRes.assignment?.assignedToUserId).toBe(technicianUserId);
            const latest = await complaintService.getComplaint(complaint.id);
            expect(latest?.status).toBe('ASSIGNED');
            expect(latest?.assignedToUserId).toBe(technicianUserId);
            expect(mockStore.getState().complaintAssignments?.length).toBe(1);
        });
        it('rejects technician from a different society (cross-society isolation)', async () => {
            mockStore.getState().staff.push({
                id: 'tech-alien-999',
                name: 'Alien Tech',
                role: 'TECHNICIAN',
                skills: ['PLUMBING'],
                societyId: otherSocietyId,
                status: 'ACTIVE',
                currentWorkload: 0,
                maxWorkload: 5,
                isAvailable: true,
            } as any);
            const assignRes = await assignmentService.assignComplaint(complaint, 'tech-alien-999', adminUserId, 'Admin Desk');
            expect(assignRes.success).toBe(false);
            expect(assignRes.errorCode).toBe('CROSS_SOCIETY');
        });
        it('allows assigned technician to acknowledge work and records timestamp', async () => {
            await assignmentService.assignComplaint(complaint, technicianUserId, adminUserId, 'Admin Desk');
            const assignedComplaint = (await complaintService.getComplaint(complaint.id))!;
            const ackRes = await assignmentService.acknowledgeAssignment(assignedComplaint, technicianUserId, 'Ramesh Plumber');
            expect(ackRes.success).toBe(true);
            expect(ackRes.acknowledgedAt).toBeDefined();
            const latest = await complaintService.getComplaint(complaint.id);
            expect(latest?.status).toBe('ACKNOWLEDGED');
            expect(latest?.acknowledgedAt).toBeDefined();
        });
        it('denies acknowledgement from unauthorized technician', async () => {
            await assignmentService.assignComplaint(complaint, technicianUserId, adminUserId, 'Admin Desk');
            const assignedComplaint = (await complaintService.getComplaint(complaint.id))!;
            const ackRes = await assignmentService.acknowledgeAssignment(assignedComplaint, 'impostor-technician', 'Impostor');
            expect(ackRes.success).toBe(false);
            expect(ackRes.errorCode).toBe('NOT_ASSIGNED');
        });
        it('starts work and transitions from ACKNOWLEDGED to IN_PROGRESS', async () => {
            await assignmentService.assignComplaint(complaint, technicianUserId, adminUserId, 'Admin Desk');
            const assigned = (await complaintService.getComplaint(complaint.id))!;
            await assignmentService.acknowledgeAssignment(assigned, technicianUserId, 'Ramesh');
            const startRes = await complaintService.startComplaintWork({
                complaintId: complaint.id,
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                workNote: 'Arrived at unit with replacement valve washers.',
            });
            expect(startRes.success).toBe(true);
            expect(startRes.complaint?.status).toBe('IN_PROGRESS');
            expect(startRes.complaint?.workStartedAt).toBeDefined();
        });
    });
    describe('Invariant 9 & 10: Hold, Wait, SLA Pause Policy & Resume', () => {
        let inProgressComplaint: Complaint;
        beforeEach(async () => {
            const res = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Pump motor fault',
                    description: 'Booster pump not priming.',
                    priority: 'HIGH',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            inProgressComplaint = res.complaint!;
            const classRes = await complaintService.classifyComplaint({
                complaintId: inProgressComplaint.id,
                category: 'PLUMBING',
                classifiedByUserId: adminUserId,
                classifiedByDisplayName: 'Admin',
            });
            inProgressComplaint = classRes.complaint!;
            await assignmentService.assignComplaint(inProgressComplaint, technicianUserId, adminUserId, 'Admin');
            const assigned = (await complaintService.getComplaint(inProgressComplaint.id))!;
            await assignmentService.acknowledgeAssignment(assigned, technicianUserId, 'Ramesh');
            const started = await complaintService.startComplaintWork({
                complaintId: inProgressComplaint.id,
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
            });
            inProgressComplaint = started.complaint!;
        });
        it('pauses SLA on approved vendor dependency HOLD', async () => {
            const holdRes = await complaintService.placeComplaintOnHold({
                complaintId: inProgressComplaint.id,
                holdReason: 'WAITING_FOR_PART',
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                actorRole: 'TECHNICIAN',
                notes: 'Awaiting OEM 2-inch non-return valve from distributor.',
            });
            expect(holdRes.success).toBe(true);
            expect(holdRes.complaint?.status).toBe('HOLD');
            expect(holdRes.complaint?.slaIsPaused).toBe(true);
            expect(holdRes.complaint?.slaPauseReason).toBe('WAITING_FOR_PART');
            expect(holdRes.complaint?.slaPausePolicy).toBe('FULL_PAUSE');
        });
        it('resumes from HOLD to IN_PROGRESS and unpauses SLA without resetting baseline', async () => {
            await complaintService.placeComplaintOnHold({
                complaintId: inProgressComplaint.id,
                holdReason: 'WAITING_FOR_PART',
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                actorRole: 'TECHNICIAN',
                notes: 'Awaiting part',
            });
            const resumeRes = await complaintService.resumeComplaint({
                complaintId: inProgressComplaint.id,
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                actorRole: 'TECHNICIAN',
                resumeNotes: 'Part received, commencing installation',
            });
            expect(resumeRes.success).toBe(true);
            expect(resumeRes.complaint?.status).toBe('IN_PROGRESS');
            expect(resumeRes.complaint?.slaIsPaused).toBe(false);
            expect(resumeRes.complaint?.holdReason).toBeUndefined();
        });
        it('supports WAITING status and resume back to IN_PROGRESS', async () => {
            const waitRes = await complaintService.placeComplaintOnWait({
                complaintId: inProgressComplaint.id,
                waitReason: 'Resident requested evening inspection after 6 PM',
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                actorRole: 'TECHNICIAN',
            });
            expect(waitRes.success).toBe(true);
            expect(waitRes.complaint?.status).toBe('WAITING');
            const resumeRes = await complaintService.resumeComplaint({
                complaintId: inProgressComplaint.id,
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
                actorRole: 'TECHNICIAN',
            });
            expect(resumeRes.success).toBe(true);
            expect(resumeRes.complaint?.status).toBe('IN_PROGRESS');
        });
    });
    describe('Invariant 13 & 14: Resolution Evidence, Confirmation & Reopen Lifecycle', () => {
        let inProgressComplaint: Complaint;
        beforeEach(async () => {
            const res = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Washbasin drain leak',
                    description: 'Trap seal defective.',
                    priority: 'NORMAL',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            inProgressComplaint = res.complaint!;
            const classRes = await complaintService.classifyComplaint({
                complaintId: inProgressComplaint.id,
                category: 'PLUMBING',
                classifiedByUserId: adminUserId,
                classifiedByDisplayName: 'Admin',
            });
            inProgressComplaint = classRes.complaint!;
            await assignmentService.assignComplaint(inProgressComplaint, technicianUserId, adminUserId, 'Admin');
            const assigned = (await complaintService.getComplaint(inProgressComplaint.id))!;
            await assignmentService.acknowledgeAssignment(assigned, technicianUserId, 'Ramesh');
            const started = await complaintService.startComplaintWork({
                complaintId: inProgressComplaint.id,
                actorUserId: technicianUserId,
                actorDisplayName: 'Ramesh',
            });
            inProgressComplaint = started.complaint!;
        });
        it('rejects resolution if confirmation requires evidence and evidence is missing', async () => {
            const res = await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Replaced trap seal gasket.',
                evidenceIds: [],
                requiresConfirmation: true,
                confirmationPolicy: 'REQUIRE_EXPLICIT_CONFIRMATION',
            });
            expect(res.success).toBe(false);
            expect(res.errorCode).toBe('RESOLUTION_EVIDENCE_REQUIRED');
        });
        it('resolves complaint successfully when valid evidence is attached', async () => {
            const res = await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Replaced bottle trap with PVC unit. Leak verified dry.',
                evidenceIds: ['doc-after-repair-photo-001'],
                requiresConfirmation: true,
                confirmationPolicy: 'REQUIRE_EXPLICIT_CONFIRMATION',
            });
            expect(res.success).toBe(true);
            expect(res.complaint?.status).toBe('RESOLVED');
            expect(res.complaint?.resolvedAt).toBeDefined();
        });
        it('allows resident to confirm resolution moving status to CONFIRMED', async () => {
            await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Fixed',
                evidenceIds: ['doc-repair-01'],
                requiresConfirmation: true,
                confirmationPolicy: 'REQUIRE_EXPLICIT_CONFIRMATION',
            });
            const confirmRes = await complaintService.confirmResolution({
                complaintId: inProgressComplaint.id,
                confirmedByUserId: reporterUserId,
                confirmedByDisplayName: 'John Doe',
            });
            expect(confirmRes.success).toBe(true);
            expect(confirmRes.complaint?.status).toBe('CONFIRMED');
            expect(confirmRes.complaint?.confirmedAt).toBeDefined();
        });
        it('allows admin or policy to close confirmed complaint', async () => {
            await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Fixed',
                evidenceIds: ['doc-repair-01'],
                requiresConfirmation: true,
                confirmationPolicy: 'REQUIRE_EXPLICIT_CONFIRMATION',
            });
            await complaintService.confirmResolution({
                complaintId: inProgressComplaint.id,
                confirmedByUserId: reporterUserId,
                confirmedByDisplayName: 'John Doe',
            });
            const closeRes = await complaintService.closeComplaint({
                complaintId: inProgressComplaint.id,
                closedByUserId: adminUserId,
                closedByDisplayName: 'Admin Desk',
                closeReason: 'All checks passed',
            });
            expect(closeRes.success).toBe(true);
            expect(closeRes.complaint?.status).toBe('CLOSED');
            expect(closeRes.complaint?.closedAt).toBeDefined();
        });
        it('allows resident to reopen when issue recurs, preserving prior resolution history', async () => {
            await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Fixed seal',
                evidenceIds: ['doc-repair-01'],
                requiresConfirmation: true,
                confirmationPolicy: 'REQUIRE_EXPLICIT_CONFIRMATION',
            });
            const reopenRes = await complaintService.reopenComplaint({
                complaintId: inProgressComplaint.id,
                reopenedByUserId: reporterUserId,
                reopenedByDisplayName: 'John Doe',
                reason: 'ISSUE_PERSISTS',
                description: 'Dripping has restarted under moderate pressure.',
                slaPolicy: 'CONTINUE',
            });
            expect(reopenRes.success).toBe(true);
            expect(reopenRes.complaint?.status).toBe('REOPENED');
            expect(reopenRes.complaint?.reopenedAt).toBeDefined();
            expect(mockStore.getState().complaintReopens?.length).toBe(1);
        });
        it('allows resident to submit 1-5 feedback after resolution/confirmation', async () => {
            await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Fixed seal',
                evidenceIds: ['doc-repair-01'],
                requiresConfirmation: false,
                confirmationPolicy: 'AUTO_CLOSE_AFTER_PERIOD',
            });
            const feedbackRes = await complaintService.submitFeedback({
                complaintId: inProgressComplaint.id,
                residentUserId: reporterUserId,
                rating: 5,
                comment: 'Very polite technician and clean work.',
            });
            expect(feedbackRes.success).toBe(true);
            expect(mockStore.getState().complaintFeedback?.length).toBe(1);
            const dupRes = await complaintService.submitFeedback({
                complaintId: inProgressComplaint.id,
                residentUserId: reporterUserId,
                rating: 4,
            });
            expect(dupRes.success).toBe(false);
            expect(dupRes.errorCode).toBe('ALREADY_SUBMITTED');
        });
        it('denies feedback submission by unrelated user', async () => {
            await complaintService.resolveComplaint({
                complaintId: inProgressComplaint.id,
                resolvedByUserId: technicianUserId,
                resolvedByDisplayName: 'Ramesh',
                outcome: 'FIXED',
                summary: 'Fixed',
                evidenceIds: ['doc-repair-01'],
                requiresConfirmation: false,
                confirmationPolicy: 'AUTO_CLOSE_AFTER_PERIOD',
            });
            const unauthFeedback = await complaintService.submitFeedback({
                complaintId: inProgressComplaint.id,
                residentUserId: 'random-intruder-user-999',
                rating: 1,
            });
            expect(unauthFeedback.success).toBe(false);
            expect(unauthFeedback.errorCode).toBe('UNAUTHORIZED');
        });
    });
    describe('Invariant 4: Multi-Tenant Society Isolation', () => {
        it('rejects cross-society status transition or close operations', async () => {
            const res = await complaintService.createComplaint({
                payload: {
                    category: 'PLUMBING',
                    title: 'Pipe issue',
                    description: 'Water leak',
                    priority: 'NORMAL',
                },
                reporterUserId,
                reporterDisplayName: 'John Doe',
                reporterRole: 'RESIDENT_OWNER',
                unitId: 'unit-402',
                unitNumber: '402',
                societyId,
                isPrivate: false,
            });
            const crossSocietyClose = await complaintService.closeComplaint({
                complaintId: res.complaint!.id,
                closedByUserId: 'admin-society-b',
                closedByDisplayName: 'Admin B',
                societyId: otherSocietyId,
            });
            expect(crossSocietyClose.success).toBe(false);
            expect(crossSocietyClose.errorCode).toBe('FORBIDDEN_SOCIETY_MISMATCH');
        });
    });
});

