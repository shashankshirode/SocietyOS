import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { BiometricDevice, BiometricPunchSyncLog, MonthlyBiometricReportRow, UnknownEmployeeCode, VendorBillingAttendanceSummary } from './biometricAttendance.types';
import { biometricDeviceMockData, biometricPunchSyncLogMockData, monthlyBiometricReportMockData, unknownEmployeeCodeMockData, vendorBillingAttendanceMockData } from './biometricAttendance.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
type RegisterBiometricDeviceInput = {
    deviceName: string;
    location: string;
    vendorName: string;
};
type ResolveUnknownEmployeeInput = {
    unknownCodeId: string;
    staffName: string;
};
export const biometricMockSource = {
    async getBiometricDevices(): Promise<RepositoryResult<BiometricDevice[]>> {
        await withMockDelay();
        return repositorySuccess(biometricDeviceMockData);
    },
    async listBiometricDevices(): Promise<RepositoryResult<BiometricDevice[]>> {
        await withMockDelay();
        return repositorySuccess(biometricDeviceMockData);
    },
    async registerBiometricDevice(input: RegisterBiometricDeviceInput): Promise<RepositoryResult<BiometricDevice>> {
        await withMockDelay();
        const device: BiometricDevice = { id: `bio-${Date.now()}`, deviceName: input.deviceName, location: input.location, status: 'OFFLINE', lastSyncTime: 'Not synced' };
        biometricDeviceMockData.unshift(device);
        return repositorySuccess(device);
    },
    async syncBiometricData(id: string): Promise<RepositoryResult<BiometricDevice>> {
        await withMockDelay();
        const device = biometricDeviceMockData.find((item) => item.id === id);
        if (device) {
            device.status = 'ONLINE';
            device.lastSyncTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            return repositorySuccess(device);
        }
        return repositorySuccess(getRequiredItem(biometricDeviceMockData, 0, "biometricAttendance.mockSource.ts"));
    },
    async listBiometricPunchSyncLogs(): Promise<RepositoryResult<BiometricPunchSyncLog[]>> {
        await withMockDelay();
        return repositorySuccess([...biometricPunchSyncLogMockData]);
    },
    async listUnknownEmployeeCodes(): Promise<RepositoryResult<UnknownEmployeeCode[]>> {
        await withMockDelay();
        return repositorySuccess([...unknownEmployeeCodeMockData]);
    },
    async resolveUnknownEmployeeCode(input: ResolveUnknownEmployeeInput): Promise<RepositoryResult<UnknownEmployeeCode>> {
        await withMockDelay();
        const record = unknownEmployeeCodeMockData.find((item) => item.id === input.unknownCodeId) ?? getRequiredItem(unknownEmployeeCodeMockData, 0, "biometricAttendance.mockSource.ts");
        record.resolutionStatus = 'MAPPED';
        biometricPunchSyncLogMockData.unshift({ id: `bps-${Date.now()}`, deviceName: record.deviceName, employeeCode: record.employeeCode, staffName: input.staffName, status: 'SUCCESS', punchTime: new Date().toISOString().replace('T', ' ').substring(0, 16) });
        return repositorySuccess(record);
    },
    async getMonthlyBiometricReport(): Promise<RepositoryResult<MonthlyBiometricReportRow[]>> {
        await withMockDelay();
        return repositorySuccess([...monthlyBiometricReportMockData]);
    },
    async getVendorBillingAttendanceSummary(): Promise<RepositoryResult<VendorBillingAttendanceSummary[]>> {
        await withMockDelay();
        return repositorySuccess([...vendorBillingAttendanceMockData]);
    },
};

