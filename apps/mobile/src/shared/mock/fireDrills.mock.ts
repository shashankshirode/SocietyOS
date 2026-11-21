import { FireDrillType, FireDrillStatus } from '../types/fireSafety.types';
import { getRequiredItem } from "../utils/requiredItem";
export interface FireDrillRecord {
    id: string;
    drillName: string;
    drillType: FireDrillType;
    date: string;
    targetArea: string;
    participantsCount: number;
    status: FireDrillStatus;
    observations: string;
    followUpActions: string;
}
export const mockFireDrills: FireDrillRecord[] = Array.from({ length: 8 }, (_, idx) => {
    const types: FireDrillType[] = [
        'FIRE_DRILL', 'EVACUATION_DRILL', 'LIFT_RESCUE_DRILL', 'MEDICAL_RESPONSE_DRILL'
    ];
    const type = getRequiredItem(types, idx % types.length, "fireDrills.mock.ts");
    const status = idx === 0 ? 'PLANNED' : idx === 1 ? 'REVIEW_PENDING' : 'COMPLETED';
    return {
        id: `drill-${idx + 1}`,
        drillName: `${type.replace(/_/g, ' ')} 2026 Q${(idx % 4) + 1}`,
        drillType: type,
        date: `2026-06-${String((idx % 28) + 1).padStart(2, '0')}`,
        targetArea: idx % 2 === 0 ? 'A & B Wings' : 'C Wing & Clubhouse',
        participantsCount: status === 'COMPLETED' ? 120 - idx * 5 : 0,
        status,
        observations: status === 'COMPLETED' ? 'Evacuation completed in 4.5 minutes. Assembly point signage was clear.' : 'Drill is scheduled.',
        followUpActions: status === 'COMPLETED' ? 'Need to replace 1 alarm speaker in Wing B 3rd floor.' : 'Prepare evacuation routes and notify residents.'
    };
});

