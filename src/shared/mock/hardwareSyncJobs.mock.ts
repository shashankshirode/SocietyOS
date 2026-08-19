import type { HardwareSyncJob } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockHardwareSyncJobs: HardwareSyncJob[] = Array.from({ length: 20 }, (_, i) => ({
    id: `hsj-${String(i + 1).padStart(3, '0')}`,
    deviceId: `dev-${String(i + 1).padStart(3, '0')}`,
    deviceName: `Device ${i + 1}`,
    deviceType: getRequiredItem((['RFID_READER', 'ANPR_CAMERA', 'SMART_ELECTRICITY_METER', 'BIOMETRIC_DEVICE'] as const), i % 4, "hardwareSyncJobs.mock.ts"),
    startedAt: new Date(Date.now() - (i * 4 * 60 * 60 * 1000)).toISOString(),
    completedAt: new Date(Date.now() - (i * 4 * 60 * 60 * 1000) + (5 * 60 * 1000)).toISOString(),
    status: getRequiredItem((['QUEUED', 'RUNNING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED', 'CANCELLED'] as const), i % 6, "hardwareSyncJobs.mock.ts"),
    totalRecords: 100,
    importedRecords: 95,
    failedRecords: i % 5 === 0 ? 5 : 0,
    duplicateRecords: 0,
    triggeredBy: getRequiredItem(['SYSTEM', 'MANUAL_FACILITY_MANAGER', 'CRON_JOB'], i % 3, "hardwareSyncJobs.mock.ts"),
}));

