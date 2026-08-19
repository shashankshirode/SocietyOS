import type { EvCharger } from '../types/evCharging.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export const mockEvChargers: EvCharger[] = Array.from({ length: 6 }, (_, i) => ({
    id: `dev-${String(i + 43).padStart(3, '0')}`,
    name: `EV Charger ${i + 1}`,
    chargerCode: `EVC-DEV-${1040 + i}`,
    location: `Parking B1 - Slot ${10 + i}`,
    connectorType: getRequiredItem(['CCS Type 2', 'CHAdeMO', 'AC Type 2'], i % 3, "evChargers.mock.ts"),
    status: getRequiredItem((['AVAILABLE', 'OCCUPIED', 'RESERVED', 'OFFLINE', 'FAULTED', 'MAINTENANCE'] as const), i, "evChargers.mock.ts"),
    ...includeWhenPresent("currentSessionId", i === 1 ? 'evs-001' : undefined),
    totalEnergyDeliveredKwh: 450 + (i * 200),
    billingReadiness: 'READY'
}));

