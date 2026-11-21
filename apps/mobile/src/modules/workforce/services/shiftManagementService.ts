import { mockStore } from '../../../core/mockStore/mockStore';
import type {
    ShiftDefinition,
    ShiftAssignment,
    RosterDefinition,
    RosterEntry,
    SwapRequest,
    ShiftType,
    ShiftStatus,
    RosterStatus,
    RosterEntryStatus,
    SwapRequestStatus,
    ShiftAssignmentInput,
} from '../../../shared/types/workforcePhase11.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';
import { canTransitionRosterStatus } from '../../../shared/types/workforcePhase11.types';

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const shiftManagementService = {
    async createShift(
        input: Omit<ShiftDefinition, 'id' | 'createdAt' | 'updatedAt' | 'assignedStaffCount' | 'societyId'>,
        createdBy: string,
        societyId: string
    ): Promise<ShiftDefinition> {
        const now = new Date().toISOString();
        const shift: ShiftDefinition = {
            id: generateId('shift'),
            ...input,
            assignedStaffCount: 0,
            societyId,
            createdAt: now,
            updatedAt: now,
            createdBy,
        };
        const shifts = mockStore.getState().shifts;
        if (shifts) {
            shifts.push(shift);
        } else {
            mockStore.getState().shifts = [shift];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId,
            action: 'SHIFT_CREATED',
            entityType: 'SHIFT_DEFINITION',
            entityId: shift.id,
            newState: { name: shift.name, code: shift.code, type: shift.type, location: shift.location },
            idempotencyKey: createIdempotencyKey(`shift_create_${shift.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return shift;
    },

    async getShifts(filters: {
        societyId?: string;
        status?: ShiftStatus;
        location?: string;
    }): Promise<ShiftDefinition[]> {
        let shifts = mockStore.getState().shifts || [];
        if (filters.societyId) {
            shifts = shifts.filter(s => s.societyId === filters.societyId);
        }
        if (filters.status) {
            shifts = shifts.filter(s => s.status === filters.status);
        }
        if (filters.location) {
            shifts = shifts.filter(s => s.location === filters.location);
        }
        return shifts;
    },

    async getShift(shiftId: string): Promise<ShiftDefinition | null> {
        return mockStore.getState().shifts?.find(s => s.id === shiftId) || null;
    },

    async updateShift(shiftId: string, updates: Partial<ShiftDefinition>, updatedBy: string): Promise<ShiftDefinition | null> {
        const shifts = mockStore.getState().shifts;
        if (!shifts) return null;
        const index = shifts.findIndex(s => s.id === shiftId);
        if (index === -1) return null;
        const existing = shifts[index];
        if (!existing) return null;

        const updated: ShiftDefinition = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        shifts[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: existing.societyId ?? '',
            action: 'SHIFT_UPDATED',
            entityType: 'SHIFT_DEFINITION',
            entityId: shiftId,
            newState: { ...updates },
            idempotencyKey: createIdempotencyKey(`shift_update_${shiftId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async deleteShift(shiftId: string, deletedBy: string): Promise<boolean> {
        const shifts = mockStore.getState().shifts;
        if (!shifts) return false;
        const index = shifts.findIndex(s => s.id === shiftId);
        if (index === -1) return false;
        const shift = shifts[index];
        if (!shift) return false;

        const assignments = mockStore.getState().shiftAssignments?.filter(a => a.shiftId === shiftId) || [];
        if (assignments.length > 0) {
            throw new Error('Cannot delete shift with active assignments');
        }

        shifts.splice(index, 1);
        mockStore.notify();

        createAuditEntry({
            actorUserId: deletedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: shift.societyId ?? '',
            action: 'SHIFT_DELETED',
            entityType: 'SHIFT_DEFINITION',
            entityId: shiftId,
            newState: { name: shift.name, code: shift.code },
            idempotencyKey: createIdempotencyKey(`shift_delete_${shiftId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return true;
    },

    async assignStaffToShift(input: ShiftAssignmentInput, assignedBy: string): Promise<ShiftAssignment> {
        const shift = mockStore.getState().shifts?.find(s => s.id === input.shiftId);
        if (!shift) throw new Error('Shift not found');
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        if (!staff) throw new Error('Staff not found');

        const existingAssignment = mockStore.getState().shiftAssignments?.find(
            a => a.staffId === input.staffId && a.shiftId === input.shiftId && a.effectiveTo === undefined
        );
        if (existingAssignment) {
            throw new Error('Staff already assigned to this shift');
        }

        const now = new Date().toISOString();
        const assignment: ShiftAssignment = {
            id: generateId('sassign'),
            shiftId: input.shiftId,
            shiftName: shift.name,
            staffId: input.staffId,
            staffName: staff.name,
            staffCode: staff.staffCode || '',
            effectiveFrom: input.effectiveFrom,
            location: input.location,
            weeklyOffDays: input.weeklyOffDays,
            isTemporary: input.isTemporary ?? false,
            status: 'ACTIVE',
            assignedBy,
            assignedAt: now,
            ...(staff.societyId ? { societyId: staff.societyId } : {}),
            ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
            ...(input.temporaryReason ? { temporaryReason: input.temporaryReason } : {}),
            ...(input.originalAssignmentId ? { originalAssignmentId: input.originalAssignmentId } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
        };

        const assignments = mockStore.getState().shiftAssignments;
        if (assignments) {
            assignments.push(assignment);
        } else {
            mockStore.getState().shiftAssignments = [assignment];
        }

        shift.assignedStaffCount = (shift.assignedStaffCount || 0) + 1;
        mockStore.notify();

        createAuditEntry({
            actorUserId: assignedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: staff.societyId ?? '',
            action: 'STAFF_ASSIGNED_TO_SHIFT',
            entityType: 'SHIFT_ASSIGNMENT',
            entityId: assignment.id,
            newState: { shiftId: input.shiftId, staffId: input.staffId, location: input.location },
            idempotencyKey: createIdempotencyKey(`shift_assign_${input.staffId}_${input.shiftId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return assignment;
    },

    async createRoster(
        input: Omit<RosterDefinition, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'societyId' | 'shiftAssignments' | 'publishedAt' | 'publishedBy' | 'previousVersionId'>,
        createdBy: string,
        societyId: string
    ): Promise<RosterDefinition> {
        const now = new Date().toISOString();
        const roster: RosterDefinition = {
            id: generateId('roster'),
            ...input,
            shiftAssignments: [],
            status: 'DRAFT',
            version: 1,
            societyId,
            createdBy,
            createdAt: now,
            updatedAt: now,
        };

        const rosters = mockStore.getState().rosters;
        if (rosters) {
            rosters.push(roster);
        } else {
            mockStore.getState().rosters = [roster];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId,
            action: 'ROSTER_CREATED',
            entityType: 'ROSTER_DEFINITION',
            entityId: roster.id,
            newState: { name: roster.name, periodStart: roster.periodStart, periodEnd: roster.periodEnd },
            idempotencyKey: createIdempotencyKey(`roster_create_${roster.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return roster;
    },

    async getRosters(filters: {
        societyId?: string;
        status?: RosterStatus;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<RosterDefinition[]> {
        let rosters = mockStore.getState().rosters || [];
        if (filters.societyId) {
            rosters = rosters.filter(r => r.societyId === filters.societyId);
        }
        if (filters.status) {
            rosters = rosters.filter(r => r.status === filters.status);
        }
        if (filters.dateFrom) {
            rosters = rosters.filter(r => r.periodEnd >= filters.dateFrom!);
        }
        if (filters.dateTo) {
            rosters = rosters.filter(r => r.periodStart <= filters.dateTo!);
        }
        return rosters;
    },

    async getRoster(rosterId: string): Promise<RosterDefinition | null> {
        return mockStore.getState().rosters?.find(r => r.id === rosterId) || null;
    },

    async addRosterEntry(
        rosterId: string,
        input: Omit<RosterEntry, 'id' | 'rosterId' | 'societyId'>,
        createdBy: string
    ): Promise<RosterEntry> {
        const roster = mockStore.getState().rosters?.find(r => r.id === rosterId);
        if (!roster) throw new Error('Roster not found');
        if (roster.status !== 'DRAFT') {
            throw new Error('Cannot add entries to non-draft roster');
        }
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        if (!staff) throw new Error('Staff not found');
        const shift = mockStore.getState().shifts?.find(s => s.id === input.shiftId);
        if (!shift) throw new Error('Shift not found');

        const entry: RosterEntry = {
            id: generateId('rentry'),
            rosterId,
            ...input,
            ...(roster.societyId ? { societyId: roster.societyId } : {}),
        };
        roster.shiftAssignments.push(entry);
        roster.updatedAt = new Date().toISOString();
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: roster.societyId ?? '',
            action: 'ROSTER_ENTRY_ADDED',
            entityType: 'ROSTER_ENTRY',
            entityId: entry.id,
            newState: { staffId: input.staffId, shiftId: input.shiftId, date: input.date },
            idempotencyKey: createIdempotencyKey(`roster_entry_${rosterId}_${input.staffId}_${input.date}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return entry;
    },

    async updateRosterEntry(
        rosterId: string,
        entryId: string,
        updates: Partial<RosterEntry>,
        updatedBy: string
    ): Promise<RosterEntry | null> {
        const roster = mockStore.getState().rosters?.find(r => r.id === rosterId);
        if (!roster) return null;
        if (roster.status !== 'DRAFT' && roster.status !== 'REVIEW') {
            throw new Error('Cannot modify entries in published roster');
        }
        const entryIndex = roster.shiftAssignments.findIndex(e => e.id === entryId);
        if (entryIndex === -1) return null;
        const existingEntry = roster.shiftAssignments[entryIndex];
        if (!existingEntry) return null;

        const updated = { ...existingEntry, ...updates };
        roster.shiftAssignments[entryIndex] = updated;
        roster.updatedAt = new Date().toISOString();
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: roster.societyId ?? '',
            action: 'ROSTER_ENTRY_UPDATED',
            entityType: 'ROSTER_ENTRY',
            entityId: entryId,
            newState: { ...updates },
            idempotencyKey: createIdempotencyKey(`roster_entry_update_${entryId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async publishRoster(rosterId: string, publishedBy: string): Promise<RosterDefinition | null> {
        const rosters = mockStore.getState().rosters;
        if (!rosters) return null;
        const index = rosters.findIndex(r => r.id === rosterId);
        if (index === -1) return null;
        const roster = rosters[index];
        if (!roster) return null;

        if (!canTransitionRosterStatus(roster.status, 'PUBLISHED')) {
            throw new Error(`Cannot publish roster in status: ${roster.status}`);
        }
        const now = new Date().toISOString();
        const updated: RosterDefinition = {
            ...roster,
            status: 'PUBLISHED',
            publishedAt: now,
            publishedBy,
            updatedAt: now,
        };
        rosters[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: publishedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: roster.societyId ?? '',
            action: 'ROSTER_PUBLISHED',
            entityType: 'ROSTER_DEFINITION',
            entityId: rosterId,
            previousState: { status: roster.status },
            newState: { status: 'PUBLISHED', publishedAt: now },
            idempotencyKey: createIdempotencyKey(`roster_publish_${rosterId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async requestSwap(
        input: Omit<SwapRequest, 'id' | 'requestedAt' | 'status' | 'approvedAt' | 'approvedBy' | 'societyId' | 'requesterStaffName' | 'targetStaffName'>,
        requesterId: string
    ): Promise<SwapRequest> {
        const requester = mockStore.getState().staff?.find(s => s.id === requesterId);
        if (!requester) throw new Error('Requester staff not found');
        const roster = mockStore.getState().rosters?.find(r => r.id === input.rosterId);
        if (!roster) throw new Error('Roster not found');
        const targetStaff = mockStore.getState().staff?.find(s => s.id === input.targetStaffId);
        if (!targetStaff) throw new Error('Target staff not found');

        const requesterEntry = roster.shiftAssignments.find(e => e.staffId === requesterId && e.date === input.date);
        if (!requesterEntry) throw new Error('Requester not scheduled for this date');
        const targetEntry = roster.shiftAssignments.find(e => e.staffId === input.targetStaffId && e.date === input.date);
        if (!targetEntry) throw new Error('Target staff not scheduled for this date');

        if (requesterEntry.shiftId !== input.requesterShiftId || targetEntry.shiftId !== input.targetShiftId) {
            throw new Error('Shift IDs do not match roster entries');
        }

        const now = new Date().toISOString();
        const swap: SwapRequest = {
            id: generateId('swap'),
            rosterId: input.rosterId,
            requesterStaffId: requesterId,
            requesterStaffName: requester.name,
            targetStaffId: input.targetStaffId,
            targetStaffName: targetStaff.name,
            date: input.date,
            requesterShiftId: input.requesterShiftId,
            targetShiftId: input.targetShiftId,
            status: 'PENDING',
            requestedAt: now,
            ...(roster.societyId ? { societyId: roster.societyId } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
        };

        const swaps = mockStore.getState().swapRequests;
        if (swaps) {
            swaps.push(swap);
        } else {
            mockStore.getState().swapRequests = [swap];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: requesterId,
            actorType: 'STAFF',
            societyId: roster.societyId ?? '',
            action: 'SHIFT_SWAP_REQUESTED',
            entityType: 'SWAP_REQUEST',
            entityId: swap.id,
            newState: { requester: requester.name, target: targetStaff.name, date: input.date },
            idempotencyKey: createIdempotencyKey(`swap_request_${swap.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return swap;
    },

    async approveSwap(swapId: string, approvedBy: string): Promise<SwapRequest | null> {
        const swapRequests = mockStore.getState().swapRequests;
        if (!swapRequests) return null;
        const index = swapRequests.findIndex(s => s.id === swapId);
        if (index === -1) return null;
        const swap = swapRequests[index];
        if (!swap) return null;

        if (swap.status !== 'PENDING') {
            throw new Error(`Cannot approve swap in status: ${swap.status}`);
        }
        const roster = mockStore.getState().rosters?.find(r => r.id === swap.rosterId);
        if (!roster) throw new Error('Roster not found');
        if (roster.status !== 'PUBLISHED') {
            throw new Error('Can only approve swaps in published roster');
        }

        const now = new Date().toISOString();
        const updated: SwapRequest = {
            ...swap,
            status: 'APPROVED',
            approvedAt: now,
            approvedBy,
        };
        swapRequests[index] = updated;

        const requesterEntry = roster.shiftAssignments.find(e => e.staffId === swap.requesterStaffId && e.date === swap.date);
        const targetEntry = roster.shiftAssignments.find(e => e.staffId === swap.targetStaffId && e.date === swap.date);
        if (requesterEntry && targetEntry) {
            const requesterShiftId = requesterEntry.shiftId;
            requesterEntry.shiftId = targetEntry.shiftId;
            requesterEntry.shiftName = targetEntry.shiftName;
            requesterEntry.status = 'SWAPPED';
            requesterEntry.swapRequestId = swapId;
            targetEntry.shiftId = requesterShiftId;
            targetEntry.shiftName = swap.requesterShiftId;
            targetEntry.status = 'SWAPPED';
            targetEntry.swapRequestId = swapId;
            roster.updatedAt = now;
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: approvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: roster.societyId ?? '',
            action: 'SHIFT_SWAP_APPROVED',
            entityType: 'SWAP_REQUEST',
            entityId: swapId,
            previousState: { status: 'PENDING' },
            newState: { status: 'APPROVED', approvedAt: now },
            idempotencyKey: createIdempotencyKey(`swap_approve_${swapId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async rejectSwap(swapId: string, rejectedBy: string, reason: string): Promise<SwapRequest | null> {
        const swapRequests = mockStore.getState().swapRequests;
        if (!swapRequests) return null;
        const index = swapRequests.findIndex(s => s.id === swapId);
        if (index === -1) return null;
        const swap = swapRequests[index];
        if (!swap) return null;

        if (swap.status !== 'PENDING') {
            throw new Error(`Cannot reject swap in status: ${swap.status}`);
        }
        const now = new Date().toISOString();
        const updated: SwapRequest = {
            ...swap,
            status: 'REJECTED',
            rejectionReason: reason,
        };
        swapRequests[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: rejectedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: swap.societyId ?? '',
            action: 'SHIFT_SWAP_REJECTED',
            entityType: 'SWAP_REQUEST',
            entityId: swapId,
            previousState: { status: 'PENDING' },
            newState: { status: 'REJECTED', rejectionReason: reason },
            idempotencyKey: createIdempotencyKey(`swap_reject_${swapId}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async getSwapRequests(filters: {
        societyId?: string;
        rosterId?: string;
        status?: SwapRequestStatus;
    }): Promise<SwapRequest[]> {
        let swaps = mockStore.getState().swapRequests || [];
        if (filters.societyId) {
            swaps = swaps.filter(s => s.societyId === filters.societyId);
        }
        if (filters.rosterId) {
            swaps = swaps.filter(s => s.rosterId === filters.rosterId);
        }
        if (filters.status) {
            swaps = swaps.filter(s => s.status === filters.status);
        }
        return swaps;
    },

    async getShiftAssignments(filters: {
        societyId?: string;
        staffId?: string;
        shiftId?: string;
        status?: string;
    }): Promise<ShiftAssignment[]> {
        let assignments = mockStore.getState().shiftAssignments || [];
        if (filters.societyId) {
            assignments = assignments.filter(a => a.societyId === filters.societyId);
        }
        if (filters.staffId) {
            assignments = assignments.filter(a => a.staffId === filters.staffId);
        }
        if (filters.shiftId) {
            assignments = assignments.filter(a => a.shiftId === filters.shiftId);
        }
        if (filters.status) {
            assignments = assignments.filter(a => a.status === filters.status);
        }
        return assignments;
    },

    async getShiftCoverage(societyId: string, date: string): Promise<{
        byShift: Record<string, {
            expected: number;
            assigned: number;
            present: number;
        }>;
        totalExpected: number;
        totalAssigned: number;
        totalPresent: number;
    }> {
        const rosters = mockStore.getState().rosters?.filter(r => r.societyId === societyId && r.status === 'PUBLISHED') || [];
        const targetRoster = rosters.find(r => r.periodStart <= date && r.periodEnd >= date);
        if (!targetRoster) {
            return { byShift: {}, totalExpected: 0, totalAssigned: 0, totalPresent: 0 };
        }
        const entries = targetRoster.shiftAssignments.filter(e => e.date === date);
        const byShift: Record<string, {
            expected: number;
            assigned: number;
            present: number;
        }> = {};
        for (const entry of targetRoster.shiftAssignments) {
            const shift = mockStore.getState().shifts?.find(s => s.id === entry.shiftId);
            if (!shift) continue;
            if (!byShift[shift.id]) {
                byShift[shift.id] = { expected: 0, assigned: 0, present: 0 };
            }
            const record = byShift[shift.id];
            if (record) {
                record.expected++;
            }
        }
        for (const entry of entries) {
            const record = byShift[entry.shiftId];
            if (record) {
                record.assigned++;
            }
        }
        const byShiftWithPresent = { ...byShift };
        for (const key of Object.keys(byShiftWithPresent)) {
            const record = byShiftWithPresent[key];
            if (record) {
                record.present = record.assigned;
            }
        }
        return {
            byShift: byShiftWithPresent,
            totalExpected: Object.values(byShift).reduce((sum, v) => sum + v.expected, 0),
            totalAssigned: Object.values(byShift).reduce((sum, v) => sum + v.assigned, 0),
            totalPresent: Object.values(byShiftWithPresent).reduce((sum, v) => sum + v.present, 0),
        };
    },
};

export default shiftManagementService;
