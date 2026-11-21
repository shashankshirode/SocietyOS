import { mockStore } from '../../../core/mockStore/mockStore';
import type {
    BiometricDevice,
    BiometricMapping,
    BiometricSyncJob,
    BiometricSyncError,
    DuplicatePunchCandidate,
    MissingCheckoutRecord,
    BiometricDeviceStatus,
    BiometricSyncType,
    BiometricMappingStatus,
    BiometricSyncJobStatus,
    BiometricSyncErrorType,
    SyncErrorStatus,
    AttendanceSettings,
    AttendancePunch,
    AttendanceCorrectionRequest,
    PunchType,
    CorrectionType,
} from '../../../shared/types/workforcePhase11.types';
import type { Absent } from '../../../shared/types/absence.types';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import { auditService, createAuditEntry } from '../../../core/audit';

function generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const biometricSyncService = {
    async registerDevice(
        input: Omit<BiometricDevice, 'id' | 'mappedStaffCount' | 'unmappedEmployeeCodes' | 'recentErrorCount' | 'lastSyncTime' | 'lastSyncJobId' | 'lastSyncStatus' | 'lastSyncPunchCount' | 'societyId' | 'createdAt' | 'updatedAt'>,
        createdBy: string,
        societyId: string
    ): Promise<BiometricDevice> {
        const existing = mockStore.getState().biometricDevices?.find(d => d.deviceCode === input.deviceCode);
        if (existing) throw new Error('Device code already exists');

        const now = new Date().toISOString();
        const device: BiometricDevice = {
            id: generateId('bdev'),
            ...input,
            mappedStaffCount: 0,
            unmappedEmployeeCodes: 0,
            recentErrorCount: 0,
            societyId,
            createdAt: now,
            updatedAt: now,
        };

        const devices = mockStore.getState().biometricDevices;
        if (devices) {
            devices.push(device);
        } else {
            mockStore.getState().biometricDevices = [device];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId,
            action: 'BIOMETRIC_DEVICE_REGISTERED',
            entityType: 'BIOMETRIC_DEVICE',
            entityId: device.id,
            newState: { deviceCode: device.deviceCode, deviceName: device.deviceName, syncType: device.syncType },
            idempotencyKey: createIdempotencyKey(`bdev_register_${device.id}`),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return device;
    },

    async getDevices(filters: {
        societyId?: string;
        status?: BiometricDeviceStatus;
    }): Promise<BiometricDevice[]> {
        let devices = mockStore.getState().biometricDevices || [];
        if (filters.societyId) {
            devices = devices.filter(d => d.societyId === filters.societyId);
        }
        if (filters.status) {
            devices = devices.filter(d => d.status === filters.status);
        }
        return devices;
    },

    async getDevice(deviceId: string): Promise<BiometricDevice | null> {
        return mockStore.getState().biometricDevices?.find(d => d.id === deviceId) || null;
    },

    async updateDevice(deviceId: string, updates: Partial<BiometricDevice>, updatedBy: string): Promise<BiometricDevice | null> {
        const devices = mockStore.getState().biometricDevices;
        if (!devices) return null;
        const index = devices.findIndex(d => d.id === deviceId);
        if (index === -1) return null;
        const existingDevice = devices[index];
        if (!existingDevice) return null;

        const updated: BiometricDevice = {
            ...existingDevice,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        devices[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: existingDevice.societyId ?? '',
            action: 'BIOMETRIC_DEVICE_UPDATED',
            entityType: 'BIOMETRIC_DEVICE',
            entityId: deviceId,
            newState: { ...updates },
            idempotencyKey: generateId('bdev_update_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async createMapping(input: {
        deviceId: string;
        biometricEmployeeCode: string;
        staffId: string;
        effectiveFrom: string;
        effectiveTo?: string;
        notes?: string;
        createdBy: string;
    }): Promise<BiometricMapping> {
        const targetDevice = mockStore.getState().biometricDevices?.find(d => d.id === input.deviceId);
        if (!targetDevice) throw new Error('Device not found');
        const staff = mockStore.getState().staff?.find(s => s.id === input.staffId);
        if (!staff) throw new Error('Staff not found');

        const existing = mockStore.getState().biometricMappings?.find(
            m => m.deviceId === input.deviceId && m.biometricEmployeeCode === input.biometricEmployeeCode && m.status === 'ACTIVE'
        );
        if (existing) throw new Error('Mapping already exists for this employee code on this device');

        const now = new Date().toISOString();
        const mapping: BiometricMapping = {
            id: generateId('bmap'),
            deviceId: input.deviceId,
            deviceName: targetDevice.deviceName,
            deviceCode: targetDevice.deviceCode,
            biometricEmployeeCode: input.biometricEmployeeCode,
            staffId: input.staffId,
            staffName: staff.name,
            status: 'ACTIVE',
            effectiveFrom: input.effectiveFrom,
            createdBy: input.createdBy,
            createdAt: now,
            updatedAt: now,
            ...(targetDevice.societyId ? { societyId: targetDevice.societyId } : {}),
            ...(staff.staffCode ? { staffCode: staff.staffCode } : {}),
            ...(input.effectiveTo ? { effectiveTo: input.effectiveTo } : {}),
            ...(input.notes ? { notes: input.notes } : {}),
        };

        const mappings = mockStore.getState().biometricMappings;
        if (mappings) {
            mappings.push(mapping);
        } else {
            mockStore.getState().biometricMappings = [mapping];
        }

        targetDevice.mappedStaffCount = (targetDevice.mappedStaffCount || 0) + 1;
        mockStore.notify();

        createAuditEntry({
            actorUserId: input.createdBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: targetDevice.societyId ?? '',
            action: 'BIOMETRIC_MAPPING_CREATED',
            entityType: 'BIOMETRIC_MAPPING',
            entityId: mapping.id,
            newState: { deviceId: input.deviceId, employeeCode: input.biometricEmployeeCode, staffId: input.staffId },
            idempotencyKey: generateId('bmap_create_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return mapping;
    },

    async updateMapping(mappingId: string, updates: Partial<BiometricMapping>, updatedBy: string): Promise<BiometricMapping | null> {
        const mappings = mockStore.getState().biometricMappings;
        if (!mappings) return null;
        const index = mappings.findIndex(m => m.id === mappingId);
        if (index === -1) return null;
        const existingMapping = mappings[index];
        if (!existingMapping) return null;

        const updated: BiometricMapping = {
            ...existingMapping,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        mappings[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: existingMapping.societyId ?? '',
            action: 'BIOMETRIC_MAPPING_UPDATED',
            entityType: 'BIOMETRIC_MAPPING',
            entityId: mappingId,
            newState: { ...updates },
            idempotencyKey: generateId('bmap_update_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async deleteMapping(mappingId: string, deletedBy: string): Promise<boolean> {
        const mappings = mockStore.getState().biometricMappings;
        if (!mappings) return false;
        const index = mappings.findIndex(m => m.id === mappingId);
        if (index === -1) return false;
        const mapping = mappings[index];
        if (!mapping) return false;

        mappings.splice(index, 1);
        const device = mockStore.getState().biometricDevices?.find(d => d.id === mapping.deviceId);
        if (device) {
            device.mappedStaffCount = Math.max(0, (device.mappedStaffCount || 1) - 1);
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: deletedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: mapping.societyId ?? '',
            action: 'BIOMETRIC_MAPPING_DELETED',
            entityType: 'BIOMETRIC_MAPPING',
            entityId: mappingId,
            newState: { employeeCode: mapping.biometricEmployeeCode },
            idempotencyKey: generateId('bmap_delete_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return true;
    },

    async getMappings(filters: {
        deviceId?: string;
        staffId?: string;
        status?: BiometricMappingStatus;
    }): Promise<BiometricMapping[]> {
        let mappings = mockStore.getState().biometricMappings || [];
        if (filters.deviceId) {
            mappings = mappings.filter(m => m.deviceId === filters.deviceId);
        }
        if (filters.staffId) {
            mappings = mappings.filter(m => m.staffId === filters.staffId);
        }
        if (filters.status) {
            mappings = mappings.filter(m => m.status === filters.status);
        }
        return mappings;
    },

    async syncDevice(deviceId: string, triggeredBy: string): Promise<BiometricSyncJob> {
        const device = mockStore.getState().biometricDevices?.find(d => d.id === deviceId);
        if (!device) throw new Error('Device not found');

        const now = new Date().toISOString();
        const syncJob: BiometricSyncJob = {
            id: generateId('sync'),
            deviceId: device.id,
            deviceName: device.deviceName,
            deviceCode: device.deviceCode,
            startedAt: now,
            status: 'RUNNING',
            totalPunchesFromDevice: 0,
            importedPunches: 0,
            duplicatePunches: 0,
            failedPunches: 0,
            unmappedEmployeeCodes: 0,
            errorCount: 0,
            triggeredBy,
            syncType: device.syncType,
            ...(device.societyId ? { societyId: device.societyId } : {}),
        };

        const syncJobs = mockStore.getState().biometricSyncJobs;
        if (syncJobs) {
            syncJobs.push(syncJob);
        } else {
            mockStore.getState().biometricSyncJobs = [syncJob];
        }
        mockStore.notify();

        setTimeout(async () => {
            try {
                const simulatedPunches = mockStore.getState().biometricDevicePunches?.filter(p => p['deviceId'] === deviceId) || [];
                let imported = 0;
                let duplicates = 0;
                let failed = 0;
                let unmapped = 0;
                const errors: { errorType: string; message: string }[] = [];

                for (const punch of simulatedPunches) {
                    const rawPunchCode = typeof punch['biometricEmployeeCode'] === 'string' ? punch['biometricEmployeeCode'] : '';
                    const rawPunchTime = typeof punch['punchTime'] === 'string' ? punch['punchTime'] : '';
                    const rawPunchTypeVal = typeof punch['punchType'] === 'string' ? punch['punchType'] : '';
                    const punchType: PunchType = (rawPunchTypeVal === 'IN' || rawPunchTypeVal === 'OUT' || rawPunchTypeVal === 'BREAK_IN' || rawPunchTypeVal === 'BREAK_OUT') ? rawPunchTypeVal : 'UNKNOWN';

                    const mapping = mockStore.getState().biometricMappings?.find(
                        m => m.deviceId === deviceId && m.biometricEmployeeCode === rawPunchCode && m.status === 'ACTIVE'
                    );
                    if (!mapping || !mapping.staffId) {
                        unmapped++;
                        await this.logSyncError({
                            syncJobId: syncJob.id,
                            deviceId: device.id,
                            deviceCode: device.deviceCode,
                            errorType: 'UNKNOWN_EMPLOYEE_CODE',
                            biometricEmployeeCode: rawPunchCode,
                            punchTime: rawPunchTime,
                            punchType,
                            errorMessage: 'Unknown biometric employee code',
                            suggestedAction: 'REVIEW_MANUALLY',
                        });
                        continue;
                    }
                    const duplicateKey = `${mapping.staffId}-${rawPunchTime}-${punchType}`;
                    const existing = mockStore.getState().attendancePunches?.find(p => p.duplicateKey === duplicateKey);
                    if (existing) {
                        duplicates++;
                        continue;
                    }
                    const staff = mockStore.getState().staff?.find(s => s.id === mapping.staffId);
                    if (!staff) {
                        failed++;
                        errors.push({ errorType: 'STAFF_NOT_FOUND', message: 'Mapped staff not found' });
                        continue;
                    }
                    const attendancePunch: AttendancePunch = {
                        id: generateId('punch'),
                        staffId: mapping.staffId,
                        staffName: mapping.staffName ?? '',
                        staffCode: staff.staffCode || '',
                        biometricEmployeeCode: rawPunchCode,
                        punchTime: rawPunchTime,
                        punchType,
                        source: 'BIOMETRIC_DEVICE',
                        deviceId: device.id,
                        deviceName: device.deviceName,
                        location: device.location,
                        isDuplicate: false,
                        duplicateKey,
                        isMapped: true,
                        mappingStatus: 'MAPPED',
                        attendanceStatus: 'PRESENT',
                        createdAt: new Date().toISOString(),
                        ...(device.societyId ? { societyId: device.societyId } : {}),
                    };
                    const punches = mockStore.getState().attendancePunches;
                    if (punches) {
                        punches.push(attendancePunch);
                    } else {
                        mockStore.getState().attendancePunches = [attendancePunch];
                    }
                    imported++;
                }

                const completedAt = new Date().toISOString();
                const updatedJob: BiometricSyncJob = {
                    ...syncJob,
                    status: failed > 0 && imported === 0 ? 'FAILED' : errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED',
                    completedAt,
                    importedPunches: imported,
                    duplicatePunches: duplicates,
                    failedPunches: failed,
                    unmappedEmployeeCodes: unmapped,
                    errorCount: errors.length,
                };
                const existingJobs = mockStore.getState().biometricSyncJobs;
                if (existingJobs) {
                    mockStore.getState().biometricSyncJobs = existingJobs.map(j => (j.id === syncJob.id ? updatedJob : j));
                }

                const deviceIndex = mockStore.getState().biometricDevices?.findIndex(d => d.id === deviceId);
                const existingDev = deviceIndex !== undefined && deviceIndex !== -1 ? mockStore.getState().biometricDevices?.[deviceIndex] : undefined;
                if (existingDev && deviceIndex !== undefined && deviceIndex !== -1) {
                    const devList = mockStore.getState().biometricDevices;
                    if (devList) {
                        devList[deviceIndex] = {
                            ...existingDev,
                            lastSyncTime: completedAt,
                            lastSyncJobId: syncJob.id,
                            lastSyncStatus: updatedJob.status,
                            lastSyncPunchCount: imported,
                        };
                    }
                }
                mockStore.notify();

                createAuditEntry({
                    actorUserId: 'SYSTEM',
                    actorType: 'SYSTEM',
                    societyId: device.societyId ?? '',
                    action: 'BIOMETRIC_SYNC_COMPLETED',
                    entityType: 'BIOMETRIC_SYNC_JOB',
                    entityId: syncJob.id,
                    newState: { imported, duplicates, failed, unmapped, errors: errors.length },
                    idempotencyKey: createIdempotencyKey(`sync_complete_${syncJob.id}`),
                    source: 'SYSTEM_JOB',
                    outcome: 'SUCCESS',
                });
                await this.detectDuplicates(syncJob.id);
            } catch (err) {
                const completedAt = new Date().toISOString();
                const failedJob: BiometricSyncJob = {
                    ...syncJob,
                    status: 'FAILED',
                    completedAt,
                    errorCount: 1,
                };
                const existingJobs = mockStore.getState().biometricSyncJobs;
                if (existingJobs) {
                    mockStore.getState().biometricSyncJobs = existingJobs.map(j => (j.id === syncJob.id ? failedJob : j));
                }
                mockStore.notify();

                createAuditEntry({
                    actorUserId: 'SYSTEM',
                    actorType: 'SYSTEM',
                    societyId: device.societyId ?? '',
                    action: 'BIOMETRIC_SYNC_FAILED',
                    entityType: 'BIOMETRIC_SYNC_JOB',
                    entityId: syncJob.id,
                    newState: { error: err instanceof Error ? err.message : 'Unknown error' },
                    idempotencyKey: createIdempotencyKey(`sync_failed_${syncJob.id}`),
                    source: 'SYSTEM_JOB',
                    outcome: 'FAILURE',
                });
            }
        }, 1000);
        return syncJob;
    },

    async logSyncError(input: {
        syncJobId: string;
        deviceId: string;
        deviceCode: string;
        errorType: BiometricSyncErrorType;
        biometricEmployeeCode?: string;
        punchTime?: string;
        punchType?: string;
        errorMessage: string;
        suggestedAction: string;
    }): Promise<BiometricSyncError> {
        const error: BiometricSyncError = {
            id: generateId('sync_err'),
            syncJobId: input.syncJobId,
            deviceId: input.deviceId,
            deviceCode: input.deviceCode,
            errorType: input.errorType,
            errorMessage: input.errorMessage,
            suggestedAction: input.suggestedAction,
            status: 'OPEN',
            createdAt: new Date().toISOString(),
            ...(input.biometricEmployeeCode ? { biometricEmployeeCode: input.biometricEmployeeCode } : {}),
            ...(input.punchTime ? { punchTime: input.punchTime } : {}),
            ...(input.punchType ? { punchType: input.punchType } : {}),
        };
        const errors = mockStore.getState().biometricSyncErrors;
        if (errors) {
            errors.push(error);
        } else {
            mockStore.getState().biometricSyncErrors = [error];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: '',
            action: 'BIOMETRIC_SYNC_ERROR',
            entityType: 'BIOMETRIC_SYNC_ERROR',
            entityId: error.id,
            newState: { errorType: input.errorType, deviceId: input.deviceId },
            idempotencyKey: generateId('sync_err_'),
            source: 'SYSTEM_JOB',
            outcome: 'PARTIAL',
        });
        return error;
    },

    async resolveSyncError(
        errorId: string,
        resolutionNote: string,
        action: 'RESOLVE' | 'IGNORE',
        resolvedBy: string
    ): Promise<BiometricSyncError | null> {
        const errors = mockStore.getState().biometricSyncErrors;
        if (!errors) return null;
        const index = errors.findIndex(e => e.id === errorId);
        if (index === -1) return null;
        const existing = errors[index];
        if (!existing) return null;

        const now = new Date().toISOString();
        const updated: BiometricSyncError = {
            ...existing,
            status: action === 'RESOLVE' ? 'RESOLVED' : 'IGNORED',
            resolvedBy,
            resolvedAt: now,
            resolutionNote,
            updatedAt: now,
        };
        errors[index] = updated;
        mockStore.notify();

        createAuditEntry({
            actorUserId: resolvedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId: existing.societyId ?? '',
            action: 'BIOMETRIC_SYNC_ERROR_RESOLVED',
            entityType: 'BIOMETRIC_SYNC_ERROR',
            entityId: errorId,
            previousState: { status: 'OPEN' },
            newState: { status: updated.status, resolutionNote },
            idempotencyKey: generateId('sync_err_resolve_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async getSyncErrors(filters: {
        syncJobId?: string;
        deviceId?: string;
        status?: SyncErrorStatus;
    }): Promise<BiometricSyncError[]> {
        let errors = mockStore.getState().biometricSyncErrors || [];
        if (filters.syncJobId) {
            errors = errors.filter(e => e.syncJobId === filters.syncJobId);
        }
        if (filters.deviceId) {
            errors = errors.filter(e => e.deviceId === filters.deviceId);
        }
        if (filters.status) {
            errors = errors.filter(e => e.status === filters.status);
        }
        return errors;
    },

    async detectDuplicates(syncJobId: string): Promise<DuplicatePunchCandidate[]> {
        const punches = mockStore.getState().attendancePunches || [];
        const duplicates: DuplicatePunchCandidate[] = [];

        for (const punch of punches) {
            if (punch.duplicateKey) {
                const existing = mockStore.getState().attendancePunches?.find(
                    p => p.duplicateKey === punch.duplicateKey && p.id !== punch.id
                );
                if (existing) {
                    const duplicate: DuplicatePunchCandidate = {
                        id: generateId('dup'),
                        deviceId: punch.deviceId || '',
                        deviceCode: '',
                        punchTime: punch.punchTime,
                        punchType: punch.punchType,
                        duplicateKey: punch.duplicateKey,
                        existingPunchId: existing.id,
                        newPunchId: punch.id,
                        suggestedAction: 'KEEP_EXISTING',
                        status: 'OPEN',
                        createdAt: new Date().toISOString(),
                        ...(punch.staffId ? { staffId: punch.staffId } : {}),
                        ...(punch.staffName ? { staffName: punch.staffName } : {}),
                        ...(punch.staffCode ? { staffCode: punch.staffCode } : {}),
                        ...(punch.biometricEmployeeCode ? { biometricEmployeeCode: punch.biometricEmployeeCode } : {}),
                        ...(punch.societyId ? { societyId: punch.societyId } : {}),
                    };
                    duplicates.push(duplicate);
                    const storeDuplicates = mockStore.getState().duplicatePunches;
                    if (storeDuplicates) {
                        storeDuplicates.push(duplicate);
                    } else {
                        mockStore.getState().duplicatePunches = [duplicate];
                    }
                }
            }
        }
        mockStore.notify();
        return duplicates;
    },

    async resolveDuplicate(
        duplicateId: string,
        action: 'KEEP_EXISTING' | 'KEEP_NEWER' | 'IGNORE',
        resolvedBy: string
    ): Promise<DuplicatePunchCandidate | null> {
        const duplicates = mockStore.getState().duplicatePunches;
        if (!duplicates) return null;
        const index = duplicates.findIndex(d => d.id === duplicateId);
        if (index === -1) return null;
        const duplicate = duplicates[index];
        if (!duplicate) return null;

        if (action === 'KEEP_EXISTING') {
            const punches = mockStore.getState().attendancePunches;
            if (punches) {
                const punchIndex = punches.findIndex(p => p.id === duplicate.newPunchId);
                if (punchIndex !== -1) punches.splice(punchIndex, 1);
            }
        } else if (action === 'KEEP_NEWER') {
            const punches = mockStore.getState().attendancePunches;
            if (punches) {
                const punchIndex = punches.findIndex(p => p.id === duplicate.existingPunchId);
                if (punchIndex !== -1) punches.splice(punchIndex, 1);
            }
        }

        const updated: DuplicatePunchCandidate = {
            ...duplicate,
            status: action === 'KEEP_EXISTING' ? 'RESOLVED_KEEP_EXISTING' : action === 'KEEP_NEWER' ? 'RESOLVED_KEEP_NEWER' : 'IGNORED',
        };
        duplicates[index] = updated;
        mockStore.notify();

        const auditActionMap = {
            KEEP_EXISTING: 'DUPLICATE_PUNCH_KEEP_EXISTING' as const,
            KEEP_NEWER: 'DUPLICATE_PUNCH_KEEP_NEWER' as const,
            IGNORE: 'DUPLICATE_PUNCH_IGNORE' as const,
        };

        createAuditEntry({
            actorUserId: resolvedBy || 'SYSTEM',
            actorType: 'SYSTEM',
            societyId: duplicate.societyId ?? '',
            action: auditActionMap[action],
            entityType: 'DUPLICATE_PUNCH',
            entityId: duplicateId,
            previousState: { status: 'OPEN' },
            newState: { status: updated.status },
            idempotencyKey: generateId('dup_resolve_'),
            source: 'SYSTEM_JOB',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async checkMissingCheckouts(date: string, societyId: string): Promise<MissingCheckoutRecord[]> {
        const punches = mockStore.getState().attendancePunches?.filter(
            p => p.societyId === societyId && p.punchTime.startsWith(date) && p.punchType === 'IN'
        ) || [];
        const missing: MissingCheckoutRecord[] = [];

        for (const punch of punches) {
            const hasOut = mockStore.getState().attendancePunches?.some(
                p => p.staffId === punch.staffId && p.punchTime.startsWith(date) && p.punchType === 'OUT'
            );
            if (!hasOut) {
                const staff = mockStore.getState().staff?.find(s => s.id === punch.staffId);
                const shift = staff?.shiftId ? mockStore.getState().shifts?.find(s => s.id === staff.shiftId) : null;
                const hoursEstimate = shift
                    ? Math.max(0, (new Date(`${date}T${shift.endTime}`).getTime() - new Date(punch.punchTime).getTime()) / 3600000)
                    : undefined;

                const record: MissingCheckoutRecord = {
                    id: generateId('miss_chk'),
                    staffId: punch.staffId,
                    staffName: punch.staffName,
                    staffCode: punch.staffCode || staff?.staffCode || '',
                    date,
                    firstCheckInTime: punch.punchTime,
                    shiftEndTime: shift?.endTime || '18:00',
                    shiftName: shift?.name || 'Unknown',
                    correctionStatus: 'OPEN',
                    createdAt: new Date().toISOString(),
                    societyId,
                    ...(hoursEstimate !== undefined ? { hoursWorkedEstimate: hoursEstimate } : {}),
                };

                const records = mockStore.getState().missingCheckouts;
                if (records) {
                    records.push(record);
                } else {
                    mockStore.getState().missingCheckouts = [record];
                }
                missing.push(record);
            }
        }
        mockStore.notify();
        return missing;
    },

    async createCorrectionForMissingCheckout(missingCheckoutId: string, input: {
        correctionType: CorrectionType;
        existingValue?: string;
        requestedCorrection: string;
        reason: string;
        requestedBy: string;
        requestedByRole: string;
    }): Promise<AttendanceCorrectionRequest> {
        const missing = mockStore.getState().missingCheckouts?.find(m => m.id === missingCheckoutId);
        if (!missing) throw new Error('Missing checkout record not found');

        const now = new Date().toISOString();
        const correction: AttendanceCorrectionRequest = {
            id: generateId('corr'),
            requestNumber: `CORR-${Date.now()}`,
            staffId: missing.staffId,
            staffName: missing.staffName,
            staffCode: missing.staffCode,
            attendanceDate: missing.date,
            correctionType: input.correctionType,
            requestedCorrection: input.requestedCorrection,
            reason: input.reason,
            requestedBy: input.requestedBy,
            requestedByRole: input.requestedByRole,
            status: 'PENDING',
            createdAt: now,
            updatedAt: now,
            ...(missing.societyId ? { societyId: missing.societyId } : {}),
            ...(input.existingValue ? { existingValue: input.existingValue } : {}),
        };

        const corrections = mockStore.getState().attendanceCorrections;
        if (corrections) {
            corrections.push(correction);
        } else {
            mockStore.getState().attendanceCorrections = [correction];
        }
        missing.correctionStatus = 'CORRECTION_CREATED';
        missing.correctionRequestId = correction.id;
        mockStore.notify();
        return correction;
    },

    async getMissingCheckouts(filters: {
        societyId?: string;
        date?: string;
        status?: 'OPEN' | 'CORRECTION_CREATED' | 'RESOLVED' | 'IGNORED';
    }): Promise<MissingCheckoutRecord[]> {
        let records = mockStore.getState().missingCheckouts || [];
        if (filters.societyId) {
            records = records.filter(r => r.societyId === filters.societyId);
        }
        if (filters.date) {
            records = records.filter(r => r.date === filters.date);
        }
        if (filters.status) {
            records = records.filter(r => r.correctionStatus === filters.status);
        }
        return records;
    },

    async getAttendanceSettings(societyId: string): Promise<AttendanceSettings> {
        return mockStore.getState().attendanceSettings?.find(s => s.societyId === societyId) || {
            shiftGracePeriodMinutes: 15,
            lateMarkingThresholdMinutes: 30,
            missingCheckoutWindowHours: 4,
            autoDuplicateWindowMinutes: 5,
            correctionApprovalRequired: true,
            correctionApprovalRoles: ['WORKFORCE_ADMIN', 'PAYROLL_ADMIN'],
            vendorReportLockDayOfMonth: 5,
            biometricSyncSchedule: '0 */30 * * * *',
            dataRetentionMonths: 36,
            societyId,
        };
    },

    async updateAttendanceSettings(societyId: string, settings: Partial<AttendanceSettings>, updatedBy: string): Promise<AttendanceSettings> {
        const current = await this.getAttendanceSettings(societyId);
        const updated: AttendanceSettings = {
            ...current,
            ...settings,
            societyId,
        };
        const currentList = mockStore.getState().attendanceSettings || [];
        const index = currentList.findIndex(s => s.societyId === societyId);
        if (index >= 0) {
            currentList[index] = updated;
            mockStore.getState().attendanceSettings = [...currentList];
        } else {
            mockStore.getState().attendanceSettings = [...currentList, updated];
        }
        mockStore.notify();

        createAuditEntry({
            actorUserId: updatedBy,
            actorType: 'WORKFORCE_ADMIN',
            societyId,
            action: 'ATTENDANCE_SETTINGS_UPDATED',
            entityType: 'ATTENDANCE_SETTINGS',
            entityId: societyId,
            newState: { updatedBy, societyId },
            idempotencyKey: generateId('att_settings_'),
            source: 'MOBILE',
            outcome: 'SUCCESS',
        });
        return updated;
    },

    async getSyncJobs(filters: {
        deviceId?: string;
        status?: BiometricSyncJobStatus;
        dateFrom?: string;
        dateTo?: string;
    }): Promise<BiometricSyncJob[]> {
        let jobs = mockStore.getState().biometricSyncJobs || [];
        if (filters.deviceId) {
            jobs = jobs.filter(j => j.deviceId === filters.deviceId);
        }
        if (filters.status) {
            jobs = jobs.filter(j => j.status === filters.status);
        }
        if (filters.dateFrom) {
            jobs = jobs.filter(j => new Date(j.startedAt) >= new Date(filters.dateFrom!));
        }
        if (filters.dateTo) {
            jobs = jobs.filter(j => new Date(j.startedAt) <= new Date(filters.dateTo!));
        }
        return jobs.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    },

    async getSyncStats(societyId: string, dateFrom?: string, dateTo?: string): Promise<{
        totalJobs: number;
        completed: number;
        failed: number;
        totalPunches: number;
        totalDuplicates: number;
        totalErrors: number;
        avgDurationMs: number;
    }> {
        const jobs = mockStore.getState().biometricSyncJobs?.filter(j => j.societyId === societyId) || [];
        let filtered = jobs;
        if (dateFrom) {
            filtered = filtered.filter(j => new Date(j.startedAt) >= new Date(dateFrom));
        }
        if (dateTo) {
            filtered = filtered.filter(j => new Date(j.startedAt) <= new Date(dateTo));
        }
        const stats = {
            totalJobs: filtered.length,
            completed: filtered.filter(j => j.status === 'COMPLETED').length,
            failed: filtered.filter(j => j.status === 'FAILED').length,
            totalPunches: filtered.reduce((sum, j) => sum + (j.importedPunches || 0), 0),
            totalDuplicates: filtered.reduce((sum, j) => sum + (j.duplicatePunches || 0), 0),
            totalErrors: filtered.reduce((sum, j) => sum + (j.errorCount || 0), 0),
            avgDurationMs: filtered.length > 0
                ? filtered.reduce((sum, j) => sum + (j.completedAt ? new Date(j.completedAt).getTime() - new Date(j.startedAt).getTime() : 0), 0) / filtered.length
                : 0,
        };
        return stats;
    },
};

export default biometricSyncService;
