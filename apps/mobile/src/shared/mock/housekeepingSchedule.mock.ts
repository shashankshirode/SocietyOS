import { CleaningType, CleaningFrequency, HousekeepingRoundStatus } from '../types/housekeeping.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export interface HousekeepingScheduleRow {
    id: string;
    area: string;
    cleaningType: CleaningType;
    frequency: CleaningFrequency;
    scheduledTime: string;
    assignedStaff: string;
    status: HousekeepingRoundStatus;
    verifiedBySupervisor: boolean;
    lastCompletedTime?: string;
}
export const mockHousekeepingSchedule: HousekeepingScheduleRow[] = Array.from({ length: 25 }, (_, idx) => {
    const areas = ['Lobby A', 'Lobby B', 'Clubhouse', 'Staircase A1', 'Staircase B1', 'Basement B1', 'Basement B2', 'Terrace A'];
    const types: CleaningType[] = ['FLOOR_SWEEPING', 'FLOOR_MOPPING', 'LIFT_CLEANING', 'LOBBY_CLEANING', 'STAIRCASE_CLEANING'];
    const frequencies: CleaningFrequency[] = ['DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND'];
    const statuses: HousekeepingRoundStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'VERIFICATION_PENDING', 'VERIFIED'];
    return {
        id: `hk-sched-${idx + 1}`,
        area: getRequiredItem(areas, idx % areas.length, "housekeepingSchedule.mock.ts"),
        cleaningType: getRequiredItem(types, idx % types.length, "housekeepingSchedule.mock.ts"),
        frequency: getRequiredItem(frequencies, idx % frequencies.length, "housekeepingSchedule.mock.ts"),
        scheduledTime: `${String(7 + (idx % 8)).padStart(2, '0')}:30 AM`,
        assignedStaff: idx % 2 === 0 ? 'Sunita Bai' : 'Rahul Valmiki',
        status: getRequiredItem(statuses, idx % statuses.length, "housekeepingSchedule.mock.ts"),
        verifiedBySupervisor: idx % 3 === 0,
        ...includeWhenPresent("lastCompletedTime", idx % 2 === 0 ? '2026-06-29 09:30 AM' : undefined)
    };
});

