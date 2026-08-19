import { LiftBreakdownType } from '../types/liftSafety.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export interface LiftBreakdown {
    id: string;
    liftId: string;
    liftNumber: string;
    breakdownType: LiftBreakdownType;
    reportedBy: string;
    startedAt: string;
    resolvedAt?: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    isPeopleStuck: boolean;
    description: string;
    status: 'REPORTED' | 'TECHNICIAN_NOTIFIED' | 'IN_PROGRESS' | 'RESOLVED';
    downtimeDurationMinutes?: number;
}
export const mockLiftBreakdowns: LiftBreakdown[] = Array.from({ length: 12 }, (_, idx) => {
    const liftIds = ['lift-1', 'lift-3', 'lift-5', 'lift-8'];
    const liftNumbers = ['LIFT-A1', 'LIFT-B1', 'LIFT-C1', 'LIFT-P1'];
    const types: LiftBreakdownType[] = ['DOOR_ISSUE', 'POWER_ISSUE', 'BUTTON_PANEL_ISSUE', 'STUCK_BETWEEN_FLOORS', 'SENSOR_ISSUE'];
    const liftIdx = idx % liftIds.length;
    const isPeopleStuck = idx === 3 || idx === 9;
    const status = idx === 0 ? 'REPORTED' : idx === 1 ? 'IN_PROGRESS' : 'RESOLVED';
    return {
        id: `bd-${idx + 1}`,
        liftId: getRequiredItem(liftIds, liftIdx, "liftBreakdowns.mock.ts"),
        liftNumber: getRequiredItem(liftNumbers, liftIdx, "liftBreakdowns.mock.ts"),
        breakdownType: getRequiredItem(types, idx % types.length, "liftBreakdowns.mock.ts"),
        reportedBy: idx % 2 === 0 ? 'Resident A-1204' : 'Security Guard',
        startedAt: `2026-06-${String((idx % 28) + 1).padStart(2, '0')} 10:00 AM`,
        ...includeWhenPresent("resolvedAt", status === 'RESOLVED' ? `2026-06-${String((idx % 28) + 1).padStart(2, '0')} 12:00 PM` : undefined),
        severity: isPeopleStuck ? 'CRITICAL' : 'HIGH',
        isPeopleStuck,
        description: isPeopleStuck ? 'Lift stopped between 4th and 5th floors. 2 residents stuck inside.' : 'Lift door not closing properly.',
        status,
        ...includeWhenPresent("downtimeDurationMinutes", status === 'RESOLVED' ? 120 : undefined)
    };
});

