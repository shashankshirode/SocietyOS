import type { RfidEvent } from '../types/gateHardware.types';
import { getRequiredItem } from "../utils/requiredItem";
import { includeWhenPresent } from "../utils/presentProperty";
export const mockRfidEvents: RfidEvent[] = Array.from({ length: 20 }, (_, i) => ({
    id: `rfe-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String(i % 5 + 1).padStart(3, '0')}`,
    deviceName: `RFID Reader ${i % 5 + 1}`,
    tagCodeMasked: `RF-TAG-******${1000 + i}`,
    ...includeWhenPresent("matchedVehicleNumber", i % 3 === 0 ? undefined : `MH-15-AB-${2000 + i}`),
    ...includeWhenPresent("matchedUnitNumber", i % 3 === 0 ? undefined : `A-Wing 10${i}`),
    timestamp: new Date(Date.now() - (i * 15 * 60 * 1000)).toISOString(),
    accessResult: getRequiredItem((['ALLOWED', 'ALLOWED', 'ALLOWED', 'DENIED', 'UNKNOWN_TAG', 'EXPIRED_TAG', 'BLOCKED_VEHICLE', 'MANUAL_REVIEW'] as const), i % 8, "rfidEvents.mock.ts"),
    gateLocation: getRequiredItem(['Main Gate', 'Service Gate', 'Basement Gate'], i % 3, "rfidEvents.mock.ts")
}));

