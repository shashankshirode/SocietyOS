import type { AnprEvent } from '../types/gateHardware.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export const mockAnprEvents: AnprEvent[] = Array.from({ length: 25 }, (_, i) => ({
    id: `ane-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String((i % 3) + 6).padStart(3, '0')}`,
    deviceName: `ANPR Camera ${(i % 3) + 1}`,
    plateNumberMasked: `MH-15-******${1000 + i}`,
    matchConfidence: 85 + (i % 15),
    ...includeWhenPresent("matchedVehicleNumber", i % 5 === 0 ? undefined : `MH-15-AB-${3000 + i}`),
    ...includeWhenPresent("unitNumber", i % 5 === 0 ? undefined : `B-Wing 20${i}`),
    gateLocation: getRequiredItem(['Main Gate', 'Service Gate', 'Basement Gate'], i % 3, "anprEvents.mock.ts"),
    timestamp: new Date(Date.now() - (i * 20 * 60 * 1000)).toISOString(),
    status: getRequiredItem((['MATCHED', 'MATCHED', 'MATCHED', 'UNMATCHED', 'LOW_CONFIDENCE', 'DENIED'] as const), i % 6, "anprEvents.mock.ts")
}));

