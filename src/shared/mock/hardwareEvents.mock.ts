import type { HardwareEvent } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockHardwareEvents: HardwareEvent[] = Array.from({ length: 30 }, (_, i) => ({
    id: `hwe-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String(i % 10 + 1).padStart(3, '0')}`,
    deviceName: `Device ${i % 10 + 1}`,
    eventType: getRequiredItem((['RFID_SCAN', 'ANPR_CAPTURE', 'BOOM_BARRIER_STATUS', 'CCTV_ACCESS_REQUEST', 'METER_READING', 'EV_CHARGING_SESSION', 'BIOMETRIC_PUNCH', 'DEVICE_HEARTBEAT', 'DEVICE_ERROR', 'MANUAL_OVERRIDE_PLACEHOLDER'] as const), i % 10, "hardwareEvents.mock.ts"),
    moduleLinked: getRequiredItem((['GATE', 'PARKING', 'CCTV', 'ATTENDANCE', 'BILLING', 'EV_CHARGING', 'COMPLIANCE', 'SECURITY', 'OTHER'] as const), i % 9, "hardwareEvents.mock.ts"),
    timestamp: new Date(Date.now() - (i * 30 * 60 * 1000)).toISOString(),
    status: getRequiredItem((['RECEIVED', 'MATCHED', 'UNMATCHED', 'IGNORED', 'FAILED', 'REVIEW_REQUIRED'] as const), i % 6, "hardwareEvents.mock.ts"),
    matchedEntityReference: `ref-${1000 + i}`,
    riskLevel: getRequiredItem((['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const), i % 4, "hardwareEvents.mock.ts"),
    safeMetadata: { rawPayloadSize: '128B', signalStrength: '-65dBm' },
}));

