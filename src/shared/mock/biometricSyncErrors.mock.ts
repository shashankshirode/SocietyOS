import type { BiometricSyncError, BiometricSyncErrorType } from '../types/biometric.types';
import { getRequiredItem } from "../utils/requiredItem";
export const mockBiometricSyncErrors: BiometricSyncError[] = [
    {
        id: 'err-001', syncJobId: 'job-010', deviceId: 'bio-device-003', deviceCode: 'BIO-OFFICE-01',
        errorType: 'UNKNOWN_EMPLOYEE_CODE', biometricEmployeeCode: 'BIO-9999', punchTime: '2026-06-29T09:05:00Z', punchType: 'IN',
        errorMessage: 'Employee code BIO-9999 not found in society staff directory.',
        suggestedAction: 'Map this employee code to an existing staff profile or register a new staff member.',
        status: 'OPEN', createdAt: '2026-06-29T23:05:00Z',
    },
    {
        id: 'err-002', syncJobId: 'job-010', deviceId: 'bio-device-003', deviceCode: 'BIO-OFFICE-01',
        errorType: 'DEVICE_TIME_MISMATCH', biometricEmployeeCode: 'BIO-3001', punchTime: '2026-06-29T10:05:00Z', punchType: 'IN',
        errorMessage: 'Device punch time (10:05) differs from server sync time (09:05) by more than configured threshold.',
        suggestedAction: 'Verify device timezone settings and calibrate device clock.',
        status: 'OPEN', createdAt: '2026-06-29T23:06:00Z',
    },
    {
        id: 'err-003', syncJobId: 'job-010', deviceId: 'bio-device-003', deviceCode: 'BIO-OFFICE-01',
        errorType: 'OUT_OF_ORDER_PUNCH', biometricEmployeeCode: 'BIO-2003', punchTime: '2026-06-29T08:30:00Z', punchType: 'IN',
        errorMessage: 'OUT punch recorded at 08:00 but IN punch recorded at 08:30. Sequence is out of order.',
        suggestedAction: 'Manually review punch history for this staff member and apply corrections.',
        status: 'OPEN', createdAt: '2026-06-29T23:08:00Z',
    },
    {
        id: 'err-004', syncJobId: 'job-010', deviceId: 'bio-device-003', deviceCode: 'BIO-OFFICE-01',
        errorType: 'STAFF_MAPPING_MISSING', biometricEmployeeCode: 'BIO-2005', punchTime: '2026-06-29T08:07:00Z', punchType: 'IN',
        errorMessage: 'Staff member found but active biometric mapping is missing for this device.',
        suggestedAction: 'Create biometric mapping for BIO-2005 on device BIO-OFFICE-01.',
        status: 'OPEN', createdAt: '2026-06-29T23:09:00Z',
    },
    {
        id: 'err-005', syncJobId: 'job-010', deviceId: 'bio-device-003', deviceCode: 'BIO-OFFICE-01',
        errorType: 'DUPLICATE_PUNCH', biometricEmployeeCode: 'BIO-1001', punchTime: '2026-06-29T06:58:15Z', punchType: 'IN',
        errorMessage: 'Duplicate IN punch within 15 seconds of previous punch.',
        suggestedAction: 'Resolve duplicate punch by keeping the earlier record.',
        status: 'RESOLVED', resolvedBy: 'Suresh Patil', resolvedAt: '2026-06-29T23:45:00Z', resolutionNote: 'Duplicate ignored. Kept first punch.',
        createdAt: '2026-06-29T23:10:00Z',
    },
    ...Array.from({ length: 20 }).map((_, idx) => {
        const idNum = idx + 6;
        const errorTypes: BiometricSyncErrorType[] = [
            'UNKNOWN_EMPLOYEE_CODE', 'DUPLICATE_PUNCH', 'INVALID_PUNCH_TYPE',
            'DEVICE_TIME_MISMATCH', 'STAFF_MAPPING_MISSING', 'SHIFT_NOT_FOUND',
            'OUT_OF_ORDER_PUNCH', 'IMPORT_FILE_INVALID', 'API_CONNECTOR_ERROR'
        ];
        const selectedErrorType = getRequiredItem(errorTypes, idx % errorTypes.length, "biometricSyncErrors.mock.ts");
        return {
            id: `err-0${idNum}`,
            syncJobId: 'job-010',
            deviceId: 'bio-device-003',
            deviceCode: 'BIO-OFFICE-01',
            errorType: selectedErrorType,
            biometricEmployeeCode: `BIO-80${idNum}`,
            punchTime: `2026-06-29T10:${String(idNum).padStart(2, '0')}:00Z`,
            punchType: 'IN',
            errorMessage: `Error of type ${selectedErrorType} occurred during synchronization.`,
            suggestedAction: 'Please check device logs or staff mapping configurations.',
            status: 'OPEN' as const,
            createdAt: new Date().toISOString(),
        };
    }),
];

