import { WasteType, WastePickupStatus } from '../types/wasteCompliance.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface WastePickupRow {
    id: string;
    tower: string;
    floor: string;
    pickupType: WasteType;
    scheduledTime: string;
    assignedStaff: string;
    status: WastePickupStatus;
    verifiedBySupervisor: boolean;
}
export const mockWastePickupSchedule: WastePickupRow[] = Array.from({ length: 20 }, (_, idx) => {
    const towers = ['A Wing', 'B Wing', 'C Wing'];
    const types: WasteType[] = ['WET_WASTE', 'DRY_WASTE', 'E_WASTE', 'BULK_WASTE', 'GARDEN_WASTE'];
    const statuses: WastePickupStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'DELAYED'];
    return {
        id: `wp-${idx + 1}`,
        tower: getRequiredItem(towers, idx % towers.length, "wastePickupSchedule.mock.ts"),
        floor: `Floors ${String((idx * 2) + 1).padStart(2, '0')}-${String((idx * 2) + 2).padStart(2, '0')}`,
        pickupType: getRequiredItem(types, idx % types.length, "wastePickupSchedule.mock.ts"),
        scheduledTime: `${String(8 + (idx % 4)).padStart(2, '0')}:00 AM`,
        assignedStaff: idx % 2 === 0 ? 'Ramesh Kumar' : 'Sanjay Singh',
        status: getRequiredItem(statuses, idx % statuses.length, "wastePickupSchedule.mock.ts"),
        verifiedBySupervisor: idx % 2 === 0
    };
});

