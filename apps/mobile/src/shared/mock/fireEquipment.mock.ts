import { FireEquipmentType, FireEquipmentStatus } from '../types/fireSafety.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export interface FireEquipment {
    id: string;
    equipmentCode: string;
    name: string;
    type: FireEquipmentType;
    location: string;
    status: FireEquipmentStatus;
    lastInspectionDate: string;
    nextInspectionDate: string;
    expiryDate?: string;
    capacity?: string;
}
export const mockFireEquipment: FireEquipment[] = Array.from({ length: 35 }, (_, idx) => {
    const types: FireEquipmentType[] = [
        'FIRE_EXTINGUISHER', 'HYDRANT', 'FIRE_ALARM_PANEL', 'SMOKE_DETECTOR',
        'SPRINKLER', 'FIRE_PUMP', 'HOSE_REEL', 'EMERGENCY_LIGHT', 'EXIT_SIGNAGE'
    ];
    const statuses: FireEquipmentStatus[] = [
        'ACTIVE', 'NEEDS_INSPECTION', 'EXPIRED', 'FAULTY', 'UNDER_MAINTENANCE'
    ];
    const type = getRequiredItem(types, idx % types.length, "fireEquipment.mock.ts");
    const status = idx === 2 ? 'EXPIRED' : idx === 5 ? 'FAULTY' : getRequiredItem(statuses, idx % statuses.length, "fireEquipment.mock.ts");
    const locations = ['A Wing Lobby', 'B Wing Floor 4', 'C Wing Parking', 'Clubhouse', 'Basement B1', 'Pump Room'];
    return {
        id: `fe-${idx + 1}`,
        equipmentCode: `EQ-FIRE-${String(idx + 1).padStart(3, '0')}`,
        name: `${type.replace(/_/g, ' ')} #${idx + 1}`,
        type,
        location: getRequiredItem(locations, idx % locations.length, "fireEquipment.mock.ts"),
        status,
        lastInspectionDate: '2026-06-10',
        nextInspectionDate: '2026-07-10',
        ...includeWhenPresent("expiryDate", type === 'FIRE_EXTINGUISHER' ? (status === 'EXPIRED' ? '2026-06-10' : '2027-06-10') : undefined),
        ...includeWhenPresent("capacity", type === 'FIRE_EXTINGUISHER' ? '6 kg (CO2)' : undefined)
    };
});

