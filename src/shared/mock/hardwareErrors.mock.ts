import type { HardwareErrorRecord } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockHardwareErrors: HardwareErrorRecord[] = Array.from({ length: 25 }, (_, i) => ({
    id: `her-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String(i % 10 + 1).padStart(3, '0')}`,
    deviceName: `Device ${i % 10 + 1}`,
    errorType: getRequiredItem((['DEVICE_OFFLINE', 'AUTHENTICATION_FAILED', 'INVALID_PAYLOAD', 'UNKNOWN_DEVICE', 'UNKNOWN_TAG', 'UNMATCHED_VEHICLE', 'DUPLICATE_EVENT', 'METER_READING_INVALID', 'EV_SESSION_ERROR', 'TIME_DRIFT', 'VENDOR_API_ERROR', 'PERMISSION_DENIED'] as const), i % 12, "hardwareErrors.mock.ts"),
    message: `Error signature detected on channel ${i}`,
    createdAt: new Date(Date.now() - (i * 3 * 60 * 60 * 1000)).toISOString(),
    status: getRequiredItem((['OPEN', 'REVIEWED', 'RESOLVED', 'IGNORED', 'ESCALATED'] as const), i % 5, "hardwareErrors.mock.ts"),
    suggestedAction: 'Check network connectivity and credentials reset.',
}));

