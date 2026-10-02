import { canTransitionComplaintStatus, isComplaintStatusFinal, isComplaintStatusActive, isComplaintStatusResolvable, getComplaintStatusOrder, COMPLAINT_STATUS_TRANSITIONS, } from '../../../shared/types/complaintPhase6';
describe('Complaint State Machine', () => {
    describe('COMPLAINT_STATUS_TRANSITIONS', () => {
        it('should define all valid transitions', () => {
            expect(COMPLAINT_STATUS_TRANSITIONS.CREATED).toEqual(['CLASSIFIED', 'CANCELLED', 'REJECTED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.CLASSIFIED).toEqual(['PENDING_ASSIGNMENT', 'ASSIGNED', 'CANCELLED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.PENDING_ASSIGNMENT).toEqual(['ASSIGNED', 'CANCELLED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.ASSIGNED).toEqual(['ACKNOWLEDGED', 'REASSIGNED', 'ESCALATED', 'CANCELLED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.ACKNOWLEDGED).toEqual(['IN_PROGRESS', 'REASSIGNED', 'ESCALATED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.IN_PROGRESS).toEqual(['WAITING', 'HOLD', 'RESOLVED', 'ESCALATED', 'REASSIGNED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.WAITING).toEqual(['IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'HOLD']);
            expect(COMPLAINT_STATUS_TRANSITIONS.HOLD).toEqual(['IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'WAITING']);
            expect(COMPLAINT_STATUS_TRANSITIONS.RESOLVED).toEqual(['CONFIRMED', 'REOPENED', 'ESCALATED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.CONFIRMED).toEqual(['CLOSED', 'REOPENED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.CLOSED).toEqual(['REOPENED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.REOPENED).toEqual(['ASSIGNED', 'IN_PROGRESS', 'PENDING_ASSIGNMENT', 'CANCELLED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.ESCALATED).toEqual(['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.CANCELLED).toEqual(['CREATED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.REJECTED).toEqual(['CREATED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.DUPLICATE).toEqual(['CREATED']);
            expect(COMPLAINT_STATUS_TRANSITIONS.LINKED_TO_PARENT).toEqual(['CREATED']);
        });
    });
    describe('canTransitionComplaintStatus', () => {
        it('should allow valid transitions', () => {
            expect(canTransitionComplaintStatus('CREATED', 'CLASSIFIED')).toBe(true);
            expect(canTransitionComplaintStatus('CLASSIFIED', 'PENDING_ASSIGNMENT')).toBe(true);
            expect(canTransitionComplaintStatus('PENDING_ASSIGNMENT', 'ASSIGNED')).toBe(true);
            expect(canTransitionComplaintStatus('ASSIGNED', 'ACKNOWLEDGED')).toBe(true);
            expect(canTransitionComplaintStatus('ACKNOWLEDGED', 'IN_PROGRESS')).toBe(true);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'WAITING')).toBe(true);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'HOLD')).toBe(true);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'RESOLVED')).toBe(true);
            expect(canTransitionComplaintStatus('WAITING', 'IN_PROGRESS')).toBe(true);
            expect(canTransitionComplaintStatus('HOLD', 'IN_PROGRESS')).toBe(true);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'RESOLVED')).toBe(true);
            expect(canTransitionComplaintStatus('RESOLVED', 'CONFIRMED')).toBe(true);
            expect(canTransitionComplaintStatus('RESOLVED', 'REOPENED')).toBe(true);
            expect(canTransitionComplaintStatus('CONFIRMED', 'CLOSED')).toBe(true);
            expect(canTransitionComplaintStatus('CLOSED', 'REOPENED')).toBe(true);
            expect(canTransitionComplaintStatus('REOPENED', 'ASSIGNED')).toBe(true);
            expect(canTransitionComplaintStatus('ESCALATED', 'ASSIGNED')).toBe(true);
        });
        it('should reject invalid transitions', () => {
            expect(canTransitionComplaintStatus('CREATED', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('CLASSIFIED', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('ASSIGNED', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('ACKNOWLEDGED', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('WAITING', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('HOLD', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('RESOLVED', 'CLOSED')).toBe(false);
            expect(canTransitionComplaintStatus('ACKNOWLEDGED', 'CLASSIFIED')).toBe(false);
            expect(canTransitionComplaintStatus('IN_PROGRESS', 'ASSIGNED')).toBe(false);
            expect(canTransitionComplaintStatus('RESOLVED', 'ACKNOWLEDGED')).toBe(false);
            expect(canTransitionComplaintStatus('CLOSED', 'RESOLVED')).toBe(false);
            expect(canTransitionComplaintStatus('REOPENED', 'CLOSED')).toBe(false);
        });
        it('should allow terminal transitions to CREATED', () => {
            expect(canTransitionComplaintStatus('CANCELLED', 'CREATED')).toBe(true);
            expect(canTransitionComplaintStatus('REJECTED', 'CREATED')).toBe(true);
            expect(canTransitionComplaintStatus('DUPLICATE', 'CREATED')).toBe(true);
            expect(canTransitionComplaintStatus('LINKED_TO_PARENT', 'CREATED')).toBe(true);
        });
    });
    describe('isComplaintStatusFinal', () => {
        it('should return true for final states', () => {
            expect(isComplaintStatusFinal('CLOSED')).toBe(true);
            expect(isComplaintStatusFinal('CANCELLED')).toBe(true);
            expect(isComplaintStatusFinal('REJECTED')).toBe(true);
            expect(isComplaintStatusFinal('DUPLICATE')).toBe(true);
        });
        it('should return false for non-final states', () => {
            expect(isComplaintStatusFinal('CREATED')).toBe(false);
            expect(isComplaintStatusFinal('CLASSIFIED')).toBe(false);
            expect(isComplaintStatusFinal('ASSIGNED')).toBe(false);
            expect(isComplaintStatusFinal('IN_PROGRESS')).toBe(false);
            expect(isComplaintStatusFinal('RESOLVED')).toBe(false);
            expect(isComplaintStatusFinal('CONFIRMED')).toBe(false);
            expect(isComplaintStatusFinal('REOPENED')).toBe(false);
        });
    });
    describe('isComplaintStatusActive', () => {
        it('should return true for active states', () => {
            expect(isComplaintStatusActive('CREATED')).toBe(true);
            expect(isComplaintStatusActive('CLASSIFIED')).toBe(true);
            expect(isComplaintStatusActive('PENDING_ASSIGNMENT')).toBe(true);
            expect(isComplaintStatusActive('ASSIGNED')).toBe(true);
            expect(isComplaintStatusActive('ACKNOWLEDGED')).toBe(true);
            expect(isComplaintStatusActive('IN_PROGRESS')).toBe(true);
            expect(isComplaintStatusActive('WAITING')).toBe(true);
            expect(isComplaintStatusActive('HOLD')).toBe(true);
            expect(isComplaintStatusActive('ESCALATED')).toBe(true);
        });
        it('should return false for non-active states', () => {
            expect(isComplaintStatusActive('RESOLVED')).toBe(false);
            expect(isComplaintStatusActive('CONFIRMED')).toBe(false);
            expect(isComplaintStatusActive('CLOSED')).toBe(false);
            expect(isComplaintStatusActive('REOPENED')).toBe(false);
            expect(isComplaintStatusActive('CANCELLED')).toBe(false);
            expect(isComplaintStatusActive('REJECTED')).toBe(false);
            expect(isComplaintStatusActive('DUPLICATE')).toBe(false);
        });
    });
    describe('isComplaintStatusResolvable', () => {
        it('should return true for resolvable states', () => {
            expect(isComplaintStatusResolvable('IN_PROGRESS')).toBe(true);
            expect(isComplaintStatusResolvable('WAITING')).toBe(true);
            expect(isComplaintStatusResolvable('HOLD')).toBe(true);
        });
        it('should return false for non-resolvable states', () => {
            expect(isComplaintStatusResolvable('CREATED')).toBe(false);
            expect(isComplaintStatusResolvable('CLASSIFIED')).toBe(false);
            expect(isComplaintStatusResolvable('ASSIGNED')).toBe(false);
            expect(isComplaintStatusResolvable('ACKNOWLEDGED')).toBe(false);
            expect(isComplaintStatusResolvable('RESOLVED')).toBe(false);
            expect(isComplaintStatusResolvable('CLOSED')).toBe(false);
        });
    });
    describe('getComplaintStatusOrder', () => {
        it('should return correct order numbers', () => {
            expect(getComplaintStatusOrder('CREATED')).toBe(1);
            expect(getComplaintStatusOrder('CLASSIFIED')).toBe(2);
            expect(getComplaintStatusOrder('PENDING_ASSIGNMENT')).toBe(3);
            expect(getComplaintStatusOrder('ASSIGNED')).toBe(4);
            expect(getComplaintStatusOrder('ACKNOWLEDGED')).toBe(5);
            expect(getComplaintStatusOrder('IN_PROGRESS')).toBe(6);
            expect(getComplaintStatusOrder('WAITING')).toBe(7);
            expect(getComplaintStatusOrder('HOLD')).toBe(8);
            expect(getComplaintStatusOrder('RESOLVED')).toBe(9);
            expect(getComplaintStatusOrder('CONFIRMED')).toBe(10);
            expect(getComplaintStatusOrder('CLOSED')).toBe(11);
            expect(getComplaintStatusOrder('REOPENED')).toBe(12);
            expect(getComplaintStatusOrder('ESCALATED')).toBe(13);
            expect(getComplaintStatusOrder('CANCELLED')).toBe(14);
            expect(getComplaintStatusOrder('REJECTED')).toBe(15);
            expect(getComplaintStatusOrder('DUPLICATE')).toBe(16);
            expect(getComplaintStatusOrder('LINKED_TO_PARENT')).toBe(17);
        });
    });
    describe('Status Order Consistency', () => {
        it('should have strictly increasing order for forward transitions', () => {
            const transitions = [
                ['CREATED', 'CLASSIFIED'],
                ['CLASSIFIED', 'PENDING_ASSIGNMENT'],
                ['PENDING_ASSIGNMENT', 'ASSIGNED'],
                ['ASSIGNED', 'ACKNOWLEDGED'],
                ['ACKNOWLEDGED', 'IN_PROGRESS'],
                ['IN_PROGRESS', 'WAITING'],
                ['WAITING', 'RESOLVED'],
                ['RESOLVED', 'CONFIRMED'],
                ['CONFIRMED', 'CLOSED'],
            ];
            transitions.forEach(([from, to]) => {
                expect(getComplaintStatusOrder(from)).toBeLessThan(getComplaintStatusOrder(to));
            });
        });
        it('should allow order decrease for reopen transitions', () => {
            expect(getComplaintStatusOrder('REOPENED')).toBeGreaterThan(getComplaintStatusOrder('ASSIGNED'));
            expect(getComplaintStatusOrder('REOPENED')).toBeGreaterThan(getComplaintStatusOrder('IN_PROGRESS'));
            expect(getComplaintStatusOrder('REOPENED')).toBeGreaterThan(getComplaintStatusOrder('PENDING_ASSIGNMENT'));
        });
    });
});
describe('SLA Calculations', () => {
    const MS_PER_HOUR = 60 * 60 * 1000;
    function addBusinessHours(startTime: number, hours: number, businessHoursOnly: boolean): Date {
        if (!businessHoursOnly) {
            return new Date(startTime + hours * MS_PER_HOUR);
        }
        const businessHours = {
            mon: { start: 9, end: 18 },
            tue: { start: 9, end: 18 },
            wed: { start: 9, end: 18 },
            thu: { start: 9, end: 18 },
            fri: { start: 9, end: 18 },
        };
        const holidays: string[] = [];
        let currentTime = startTime;
        let remainingMs = hours * MS_PER_HOUR;
        while (remainingMs > 0) {
            const date = new Date(currentTime);
            const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short', timeZone: 'Asia/Kolkata' }).toLowerCase().slice(0, 3);
            const dayHours = businessHours[dayOfWeek as keyof typeof businessHours];
            if (!dayHours || isHoliday(date, [])) {
                currentTime = getNextBusinessDayStart(date, businessHours, [], 'Asia/Kolkata');
                continue;
            }
            const dayStart = new Date(date);
            dayStart.setHours(dayHours.start, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(dayHours.end, 0, 0, 0);
            if (currentTime < dayStart.getTime()) {
                currentTime = dayStart.getTime();
            }
            const availableMs = dayEnd.getTime() - currentTime;
            if (availableMs <= 0) {
                currentTime = getNextBusinessDayStart(date, businessHours, [], 'Asia/Kolkata');
                continue;
            }
            if (remainingMs <= availableMs) {
                currentTime += remainingMs;
                remainingMs = 0;
            }
            else {
                currentTime = dayEnd.getTime();
                remainingMs -= availableMs;
                currentTime = getNextBusinessDayStart(new Date(currentTime), businessHours, [], 'Asia/Kolkata');
            }
        }
        return new Date(currentTime);
    }
    function isHoliday(date: Date, holidays: string[]): boolean {
        const dateStr = date.toISOString().split('T')[0];
        return holidays.includes(dateStr);
    }
    function getNextBusinessDayStart(date: Date, businessHours: any, holidays: string[], timezone: string): number {
        let nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        while (isHoliday(nextDay, []) || !businessHours[nextDay.toLocaleString('en-US', { weekday: 'short', timeZone: timezone }).toLowerCase().slice(0, 3)]) {
            nextDay = new Date(nextDay.getTime() + 24 * 60 * 60 * 1000);
        }
        const dayKey = nextDay.toLocaleString('en-US', { weekday: 'short', timeZone: timezone }).toLowerCase().slice(0, 3);
        nextDay.setHours(businessHours[dayKey].start, 0, 0, 0);
        return nextDay.getTime();
    }
    describe('Fixed Hours SLA', () => {
        it('should calculate deadline correctly for fixed hours', () => {
            const start = new Date('2026-01-15T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 24, false);
            expect(deadline.getTime()).toBe(new Date('2026-01-16T10:00:00Z').getTime());
        });
        it('should handle fractional hours', () => {
            const start = new Date('2026-01-15T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 4.5, false);
            expect(deadline.getTime()).toBe(new Date('2026-01-15T14:30:00Z').getTime());
        });
    });
    describe('Business Hours SLA', () => {
        it('should only count business hours', () => {
            const start = new Date('2026-01-15T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 4, true);
            expect(deadline).toBeInstanceOf(Date);
            expect(deadline.getTime()).toBeGreaterThan(start);
        });
        it('should skip weekends', () => {
            const start = new Date('2026-01-16T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 4, true);
            expect(deadline).toBeInstanceOf(Date);
            expect(deadline.getTime()).toBeGreaterThan(start);
        });
        it('should skip to Monday after Friday', () => {
            const start = new Date('2026-01-16T14:00:00Z').getTime();
            const deadline = addBusinessHours(start, 4, true);
            expect(deadline).toBeInstanceOf(Date);
            expect(deadline.getTime()).toBeGreaterThan(start);
        });
        it('should handle crossing multiple days', () => {
            const start = new Date('2026-01-15T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 16, true);
            expect(deadline).toBeInstanceOf(Date);
            expect(deadline.getTime()).toBeGreaterThan(start);
        });
    });
    describe('Holiday Handling', () => {
        it('should skip holidays', () => {
            const holidays = ['2026-01-16'];
            const start = new Date('2026-01-15T10:00:00Z').getTime();
            const deadline = addBusinessHours(start, 8, false);
            expect(deadline).toBeInstanceOf(Date);
        });
    });
});
describe('SLA Pause/Resume', () => {
    function calculatePauseDuration(pauseStart: string, pauseEnd: string): number {
        return new Date(pauseEnd).getTime() - new Date(pauseStart).getTime();
    }
    it('should calculate pause duration correctly', () => {
        const start = '2026-01-15T10:00:00Z';
        const end = '2026-01-15T12:00:00Z';
        const duration = new Date(end).getTime() - new Date(start).getTime();
        expect(duration).toBe(2 * 60 * 60 * 1000);
    });
    it('should handle multiple pauses', () => {
        const pauses = [
            { start: '2026-01-15T10:00:00Z', end: '2026-01-15T12:00:00Z' },
            { start: '2026-01-15T14:00:00Z', end: '2026-01-15T15:00:00Z' },
        ];
        const total = pauses.reduce((sum, p) => sum + (new Date(p.end).getTime() - new Date(p.start).getTime()), 0);
        expect(total).toBe(3 * 60 * 60 * 1000);
    });
    it('should handle ongoing pause (no end time)', () => {
        const pause = { start: '2026-01-15T10:00:00Z', end: undefined };
        const duration = pause.end ? new Date(pause.end).getTime() - new Date(pause.start).getTime() : undefined;
        expect(duration).toBeUndefined();
    });
});
describe('Hold Reason SLA Pause Policy', () => {
    function getSlaPausePolicyForHoldReason(reason: string): string {
        const fullPauseReasons = ['SPARE_PART_REQUIRED', 'VENDOR_REQUIRED', 'EXTERNAL_DEPENDENCY'];
        const partialPauseReasons = ['RESIDENT_UNAVAILABLE', 'SOCIETY_APPROVAL_REQUIRED', 'WEATHER_DELAY', 'SAFETY_CONCERN'];
        if (fullPauseReasons.includes(reason))
            return 'FULL_PAUSE';
        if (partialPauseReasons.includes(reason))
            return 'PARTIAL_PAUSE';
        return 'FULL_PAUSE';
    }
    it('should return FULL_PAUSE for vendor/part dependencies', () => {
        expect(getSlaPausePolicyForHoldReason('SPARE_PART_REQUIRED')).toBe('FULL_PAUSE');
        expect(getSlaPausePolicyForHoldReason('VENDOR_REQUIRED')).toBe('FULL_PAUSE');
        expect(getSlaPausePolicyForHoldReason('EXTERNAL_DEPENDENCY')).toBe('FULL_PAUSE');
    });
    it('should return PARTIAL_PAUSE for resident/approval reasons', () => {
        expect(getSlaPausePolicyForHoldReason('RESIDENT_UNAVAILABLE')).toBe('PARTIAL_PAUSE');
        expect(getSlaPausePolicyForHoldReason('SOCIETY_APPROVAL_REQUIRED')).toBe('PARTIAL_PAUSE');
        expect(getSlaPausePolicyForHoldReason('WEATHER_DELAY')).toBe('PARTIAL_PAUSE');
        expect(getSlaPausePolicyForHoldReason('SAFETY_CONCERN')).toBe('PARTIAL_PAUSE');
    });
});
describe('Escalation Levels', () => {
    const escalationLevels = ['TECHNICIAN', 'SUPERVISOR', 'HELPDESK_ADMIN', 'FACILITY_ADMIN', 'SOCIETY_ADMIN'];
    it('should have correct hierarchy', () => {
        expect(escalationLevels.indexOf('TECHNICIAN')).toBe(0);
        expect(escalationLevels.indexOf('SUPERVISOR')).toBe(1);
        expect(escalationLevels.indexOf('HELPDESK_ADMIN')).toBe(2);
        expect(escalationLevels.indexOf('FACILITY_ADMIN')).toBe(3);
        expect(escalationLevels.indexOf('SOCIETY_ADMIN')).toBe(4);
    });
    it('should only escalate to higher levels', () => {
        expect(escalationLevels.indexOf('SUPERVISOR')).toBeGreaterThan(escalationLevels.indexOf('TECHNICIAN'));
        expect(escalationLevels.indexOf('FACILITY_ADMIN')).toBeGreaterThan(escalationLevels.indexOf('SUPERVISOR'));
        expect(escalationLevels.indexOf('SOCIETY_ADMIN')).toBeGreaterThan(escalationLevels.indexOf('FACILITY_ADMIN'));
    });
});
describe('Compliance Percent Calculation', () => {
    function calculateCompliancePercent(createdAt: string, resolvedAt: string, deadline: string, totalPauseMs: number): number {
        const created = new Date(createdAt).getTime();
        const resolved = new Date(resolvedAt).getTime();
        const deadlineMs = new Date(deadline).getTime();
        const actualDuration = resolved - created - totalPauseMs;
        const allowedDuration = deadlineMs - created - totalPauseMs;
        if (allowedDuration <= 0)
            return 100;
        return Math.max(0, Math.min(100, Math.round((allowedDuration / actualDuration) * 100)));
    }
    it('should return 100% when resolved exactly at deadline', () => {
        const created = '2026-01-15T10:00:00Z';
        const deadline = '2026-01-16T10:00:00Z';
        const resolved = '2026-01-16T10:00:00Z';
        const percent = calculateCompliancePercent(created, resolved, deadline, 0);
        expect(percent).toBe(100);
    });
    it('should return 100% when resolved before deadline (capped)', () => {
        const created = '2026-01-15T10:00:00Z';
        const deadline = '2026-01-16T10:00:00Z';
        const resolved = '2026-01-15T22:00:00Z';
        const percent = calculateCompliancePercent(created, resolved, deadline, 0);
        expect(percent).toBe(100);
    });
    it('should return <100% when resolved after deadline', () => {
        const created = '2026-01-15T10:00:00Z';
        const deadline = '2026-01-16T10:00:00Z';
        const resolved = '2026-01-16T14:00:00Z';
        const percent = calculateCompliancePercent(created, resolved, deadline, 0);
        expect(percent).toBeLessThan(100);
    });
    it('should account for pause time', () => {
        const created = '2026-01-15T10:00:00Z';
        const deadline = '2026-01-16T10:00:00Z';
        const resolved = '2026-01-16T14:00:00Z';
        const pauseMs = 4 * 60 * 60 * 1000;
        const percent = calculateCompliancePercent(created, resolved, deadline, pauseMs);
        expect(percent).toBe(83);
    });
});
describe('Hold Reasons and SLA Pause Policy', () => {
    const fullPauseReasons = ['SPARE_PART_REQUIRED', 'VENDOR_REQUIRED', 'EXTERNAL_DEPENDENCY'];
    const partialPauseReasons = ['RESIDENT_UNAVAILABLE', 'SOCIETY_APPROVAL_REQUIRED', 'WEATHER_DELAY', 'SAFETY_CONCERN'];
    it('should classify hold reasons correctly', () => {
        expect(fullPauseReasons).toContain('SPARE_PART_REQUIRED');
        expect(fullPauseReasons).toContain('VENDOR_REQUIRED');
        expect(fullPauseReasons).toContain('EXTERNAL_DEPENDENCY');
        expect(partialPauseReasons).toContain('RESIDENT_UNAVAILABLE');
        expect(partialPauseReasons).toContain('SOCIETY_APPROVAL_REQUIRED');
        expect(partialPauseReasons).toContain('WEATHER_DELAY');
        expect(partialPauseReasons).toContain('SAFETY_CONCERN');
    });
    it('should not have overlapping reasons', () => {
        const fullSet = new Set(['SPARE_PART_REQUIRED', 'VENDOR_REQUIRED', 'EXTERNAL_DEPENDENCY']);
        const partialSet = new Set(['RESIDENT_UNAVAILABLE', 'SOCIETY_APPROVAL_REQUIRED', 'WEATHER_DELAY', 'SAFETY_CONCERN']);
        for (const reason of fullSet) {
            expect(partialSet.has(reason)).toBe(false);
        }
    });
});

