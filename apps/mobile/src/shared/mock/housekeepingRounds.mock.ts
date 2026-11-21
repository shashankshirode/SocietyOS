import { HousekeepingRoundStatus, CleaningType } from '../types/housekeeping.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export interface HousekeepingRound {
    id: string;
    roundNumber: string;
    area: string;
    assignedStaff: string;
    cleaningType: CleaningType;
    startTime: string;
    endTime?: string;
    status: HousekeepingRoundStatus;
    checklist: {
        item: string;
        completed: boolean;
    }[];
    supervisorRemarks?: string;
    reworkRequired?: boolean;
}
export const mockHousekeepingRounds: HousekeepingRound[] = Array.from({ length: 30 }, (_, idx) => {
    const areas = ['Lobby A', 'Lobby B', 'Clubhouse', 'Lift A1', 'Lift B1', 'Staircase C'];
    const types: CleaningType[] = ['FLOOR_SWEEPING', 'FLOOR_MOPPING', 'LIFT_CLEANING', 'LOBBY_CLEANING'];
    const statuses: HousekeepingRoundStatus[] = [
        'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'VERIFICATION_PENDING', 'VERIFIED', 'REWORK_REQUIRED'
    ];
    const status = getRequiredItem(statuses, idx % statuses.length, "housekeepingRounds.mock.ts");
    return {
        id: `round-${idx + 1}`,
        roundNumber: `RND-2026-${String(idx + 1).padStart(3, '0')}`,
        area: getRequiredItem(areas, idx % areas.length, "housekeepingRounds.mock.ts"),
        assignedStaff: idx % 2 === 0 ? 'Sunita Bai' : 'Rahul Valmiki',
        cleaningType: getRequiredItem(types, idx % types.length, "housekeepingRounds.mock.ts"),
        startTime: '09:00 AM',
        ...includeWhenPresent("endTime", status === 'COMPLETED' || status === 'VERIFIED' ? '09:45 AM' : undefined),
        status,
        checklist: [
            { item: 'Sweep floor surfaces', completed: status !== 'SCHEDULED' && status !== 'IN_PROGRESS' },
            { item: 'Mop floor surfaces', completed: status === 'COMPLETED' || status === 'VERIFIED' },
            { item: 'Empty dustbins', completed: status === 'VERIFIED' }
        ],
        ...includeWhenPresent("supervisorRemarks", status === 'REWORK_REQUIRED' ? 'Corner areas still dusty. Rework needed.' : undefined),
        reworkRequired: status === 'REWORK_REQUIRED'
    };
});

