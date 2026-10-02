import { repositorySuccess, repositoryFailure, type RepositoryResult } from '../../../core/repositories/repository.types';
import { staffAttendanceApiSource } from '../../staffAttendance/data/staffAttendance.apiSource';
import type { BiometricDevice, BiometricPunchSyncLog, MonthlyBiometricReportRow, UnknownEmployeeCode, VendorBillingAttendanceSummary } from './biometricAttendance.types';

type RegisterBiometricDeviceInput = { deviceName: string; location: string; vendorName: string };
type ResolveUnknownEmployeeInput = { unknownCodeId: string; staffName: string };

export const biometricApiSource = {
  getBiometricDevices: async (): Promise<RepositoryResult<BiometricDevice[]>> => {
    try {
      const devices = await staffAttendanceApiSource.getBiometricDevices();
      const mapped: BiometricDevice[] = devices.map(d => ({
        id: d.id,
        deviceName: d.deviceName,
        location: d.location,
        status: d.status === 'ACTIVE' ? 'ONLINE' : 'OFFLINE',
        lastSyncTime: d.lastSyncTime ?? 'Never',
      }));
      return repositorySuccess(mapped);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'BIOMETRIC_DEVICES_FETCH_ERROR',
        message: err.message,
      });
    }
  },

  listBiometricDevices: async (): Promise<RepositoryResult<BiometricDevice[]>> => {
    return biometricApiSource.getBiometricDevices();
  },

  registerBiometricDevice: async (input: RegisterBiometricDeviceInput): Promise<RepositoryResult<BiometricDevice>> => {
    try {
      const created: BiometricDevice = {
        id: `dev-${Date.now().toString(36)}`,
        deviceName: input.deviceName,
        location: input.location,
        status: 'ONLINE',
        lastSyncTime: new Date().toISOString(),
      };
      return repositorySuccess(created);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'BIOMETRIC_DEVICE_REGISTRATION_FAILED',
        message: err.message,
      });
    }
  },

  syncBiometricData: async (id: string): Promise<RepositoryResult<BiometricDevice>> => {
    try {
      const detail = await staffAttendanceApiSource.getBiometricDeviceDetail(id);
      const synced: BiometricDevice = {
        id: detail.id,
        deviceName: detail.deviceName,
        location: detail.location,
        status: detail.status === 'ACTIVE' ? 'ONLINE' : 'OFFLINE',
        lastSyncTime: new Date().toISOString(),
      };
      return repositorySuccess(synced);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'BIOMETRIC_SYNC_ERROR',
        message: err.message,
      });
    }
  },

  listBiometricPunchSyncLogs: async (): Promise<RepositoryResult<BiometricPunchSyncLog[]>> => {
    try {
      const punches = await staffAttendanceApiSource.getAttendancePunches();
      const logs: BiometricPunchSyncLog[] = punches.map(p => ({
        id: p.id,
        deviceName: p.deviceName ?? 'Biometric Terminal',
        employeeCode: p.biometricEmployeeCode ?? p.staffCode,
        ...(p.staffName ? { staffName: p.staffName } : {}),
        status: p.isDuplicate ? 'DUPLICATE' : p.isMapped ? 'SUCCESS' : 'UNKNOWN_EMPLOYEE',
        punchTime: p.punchTime,
      }));
      return repositorySuccess(logs);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'BIOMETRIC_PUNCH_LOGS_FAILED',
        message: err.message,
      });
    }
  },

  listUnknownEmployeeCodes: async (): Promise<RepositoryResult<UnknownEmployeeCode[]>> => {
    try {
      const errors = await staffAttendanceApiSource.getBiometricSyncErrors('all');
      const unknownErrors = errors.filter(err => err.errorType === 'UNKNOWN_EMPLOYEE_CODE');
      const records: UnknownEmployeeCode[] = unknownErrors.map(e => ({
        id: e.id,
        deviceName: e.deviceCode,
        employeeCode: e.biometricEmployeeCode ?? 'UNKNOWN',
        firstSeenAt: e.createdAt,
        resolutionStatus: e.status === 'RESOLVED' ? 'MAPPED' : 'OPEN',
      }));
      return repositorySuccess(records);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'UNKNOWN_EMPLOYEE_CODES_FETCH_FAILED',
        message: err.message,
      });
    }
  },

  resolveUnknownEmployeeCode: async (input: ResolveUnknownEmployeeInput): Promise<RepositoryResult<UnknownEmployeeCode>> => {
    try {
      await staffAttendanceApiSource.resolveSyncError(input.unknownCodeId, {
        resolutionNote: `Mapped to staff ${input.staffName}`,
        action: 'RESOLVE',
      });
      return repositorySuccess({
        id: input.unknownCodeId,
        deviceName: 'Biometric Device',
        employeeCode: 'RESOLVED',
        firstSeenAt: new Date().toISOString(),
        resolutionStatus: 'MAPPED',
      });
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'RESOLVE_UNKNOWN_CODE_FAILED',
        message: err.message,
      });
    }
  },

  getMonthlyBiometricReport: async (): Promise<RepositoryResult<MonthlyBiometricReportRow[]>> => {
    try {
      const report = await staffAttendanceApiSource.getMonthlyAttendanceReport({ month: '06', year: '2026' });
      const rows: MonthlyBiometricReportRow[] = report.map(r => ({
        id: r.staffId,
        staffName: r.staffName,
        vendorName: r.vendorName ?? 'Society Direct',
        location: 'All Zones',
        presentDays: r.presentDays,
        missingPunches: r.missingCheckoutCount,
      }));
      return repositorySuccess(rows);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'MONTHLY_REPORT_FETCH_FAILED',
        message: err.message,
      });
    }
  },

  getVendorBillingAttendanceSummary: async (): Promise<RepositoryResult<VendorBillingAttendanceSummary[]>> => {
    try {
      const report = await staffAttendanceApiSource.getVendorAttendanceReport({ month: '2026-06' });
      const rows: VendorBillingAttendanceSummary[] = report.map(v => ({
        id: v.vendorId,
        vendorName: v.vendorName,
        invoiceMonth: v.invoiceMonth,
        payableDays: v.presentManDays,
        disputedDays: v.absentDays,
        verificationStatus: v.verificationStatus === 'VERIFIED' ? 'READY' : 'NEEDS_REVIEW',
      }));
      return repositorySuccess(rows);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      return repositoryFailure({
        code: 'VENDOR_BILLING_SUMMARY_FAILED',
        message: err.message,
      });
    }
  },
};
