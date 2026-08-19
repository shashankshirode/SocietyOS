import type { HardwareAuditLogEntry } from '../types/hardware.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockHardwareAuditLogs: HardwareAuditLogEntry[] = Array.from({ length: 40 }, (_, i) => ({
    id: `hal-${String(i + 1).padStart(3, '0')}`,
    timestamp: new Date(Date.now() - (i * 4 * 60 * 60 * 1000)).toISOString(),
    actorName: getRequiredItem(['Suresh Patil', 'Ramesh Pawar', 'System Engine', 'Admin User'], i % 4, "hardwareAuditLogs.mock.ts"),
    actorRole: getRequiredItem(['FACILITY_MANAGER', 'SECURITY_SUPERVISOR', 'SYSTEM', 'SOCIETY_ADMIN'], i % 4, "hardwareAuditLogs.mock.ts"),
    event: getRequiredItem(['DEVICE_REGISTERED', 'DEVICE_MAPPING_CHANGED', 'RFID_MAPPING_CHANGED', 'ANPR_MATCH_REVIEWED', 'BOOM_BARRIER_OVERRIDDEN', 'CCTV_ACCESS_OPENED', 'METER_READINGS_IMPORTED', 'EV_SESSION_VIEWED', 'ERROR_RESOLVED', 'SETTINGS_CHANGED'], i % 10, "hardwareAuditLogs.mock.ts"),
    deviceId: `dev-${String(i % 10 + 1).padStart(3, '0')}`,
    deviceName: `Device ${i % 10 + 1}`,
    moduleLinked: getRequiredItem((['GATE', 'PARKING', 'CCTV', 'ATTENDANCE', 'BILLING', 'EV_CHARGING', 'COMPLIANCE', 'SECURITY', 'OTHER'] as const), i % 9, "hardwareAuditLogs.mock.ts"),
    entityReference: `ref-${1000 + i}`,
    correlationId: `corr-${100000 + i}`,
    safeMetadata: { clientIp: '192.168.1.50', userAgent: 'Mozilla/5.0' },
}));

