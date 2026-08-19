import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { BiometricDevice, BiometricPunchSyncLog, MonthlyBiometricReportRow, UnknownEmployeeCode, VendorBillingAttendanceSummary } from './biometricAttendance.types';

type RegisterBiometricDeviceInput = { deviceName: string; location: string; vendorName: string };
type ResolveUnknownEmployeeInput = { unknownCodeId: string; staffName: string };
const notImplemented = <T>(): Promise<RepositoryResult<T>> => Promise.resolve({ ok: false, error: { message: 'API source not implemented', code: 'NOT_IMPLEMENTED' } });

export const biometricApiSource = {
  getBiometricDevices: () => notImplemented<BiometricDevice[]>(),
  listBiometricDevices: () => notImplemented<BiometricDevice[]>(),
  registerBiometricDevice: (_input: RegisterBiometricDeviceInput) => notImplemented<BiometricDevice>(),
  syncBiometricData: (_id: string) => notImplemented<BiometricDevice>(),
  listBiometricPunchSyncLogs: () => notImplemented<BiometricPunchSyncLog[]>(),
  listUnknownEmployeeCodes: () => notImplemented<UnknownEmployeeCode[]>(),
  resolveUnknownEmployeeCode: (_input: ResolveUnknownEmployeeInput) => notImplemented<UnknownEmployeeCode>(),
  getMonthlyBiometricReport: () => notImplemented<MonthlyBiometricReportRow[]>(),
  getVendorBillingAttendanceSummary: () => notImplemented<VendorBillingAttendanceSummary[]>(),
};
