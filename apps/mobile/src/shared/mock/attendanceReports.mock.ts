import type { MonthlyAttendanceRow, VendorAttendanceRow } from '../types/attendance.types';
import { includeWhenPresent } from "../utils/presentProperty";
export const mockMonthlyAttendanceReport: MonthlyAttendanceRow[] = [
    { staffId: 'stf-001', staffName: 'Ramesh Pawar', staffCode: 'STF-SEC-001', category: 'SECURITY_GUARD', vendorName: 'SafeGuard Security Services', expectedDays: 26, presentDays: 25, absentDays: 0, lateDays: 1, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 96 },
    { staffId: 'stf-002', staffName: 'Vikas Thorat', staffCode: 'STF-SEC-002', category: 'SECURITY_GUARD', vendorName: 'SafeGuard Security Services', expectedDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 100 },
    { staffId: 'stf-003', staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', category: 'SECURITY_GUARD', vendorName: 'SafeGuard Security Services', expectedDays: 26, presentDays: 24, absentDays: 1, lateDays: 3, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 1, attendancePercentage: 92 },
    { staffId: 'stf-004', staffName: 'Dinesh Yadav', staffCode: 'STF-SEC-004', category: 'SECURITY_SUPERVISOR', vendorName: 'SafeGuard Security Services', expectedDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 100 },
    { staffId: 'stf-007', staffName: 'Meena Jadhav', staffCode: 'STF-HK-001', category: 'HOUSEKEEPING', vendorName: 'CleanPro Housekeeping', expectedDays: 26, presentDays: 24, absentDays: 1, lateDays: 1, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 92 },
    { staffId: 'stf-008', staffName: 'Sunita Bansode', staffCode: 'STF-HK-002', category: 'HOUSEKEEPING', vendorName: 'CleanPro Housekeeping', expectedDays: 26, presentDays: 20, absentDays: 4, lateDays: 0, halfDays: 1, missingCheckoutCount: 1, correctionsCount: 2, attendancePercentage: 77 },
    { staffId: 'stf-009', staffName: 'Rekha Shinde', staffCode: 'STF-HK-003', category: 'HOUSEKEEPING', vendorName: 'CleanPro Housekeeping', expectedDays: 26, presentDays: 25, absentDays: 1, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 96 },
    { staffId: 'stf-011', staffName: 'Rajesh Gaikwad', staffCode: 'STF-FAC-001', category: 'FACILITY_STAFF', expectedDays: 26, presentDays: 26, absentDays: 0, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 100 },
    { staffId: 'stf-012', staffName: 'Santosh More', staffCode: 'STF-FAC-002', category: 'GARDENER', expectedDays: 26, presentDays: 25, absentDays: 1, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 96 },
    { staffId: 'stf-014', staffName: 'Mohammad Ali', staffCode: 'STF-FAC-004', category: 'ELECTRICIAN', expectedDays: 26, presentDays: 24, absentDays: 2, lateDays: 0, halfDays: 0, missingCheckoutCount: 0, correctionsCount: 0, attendancePercentage: 92 },
];
export const mockVendorAttendanceReport: VendorAttendanceRow[] = [
    { vendorId: 'vendor-security-001', vendorName: 'SafeGuard Security Services', staffCount: 10, expectedManDays: 260, presentManDays: 252, absentDays: 8, lateCount: 6, correctionsCount: 2, verificationStatus: 'UNDER_REVIEW', invoiceMonth: 'June 2026' },
    { vendorId: 'vendor-hk-001', vendorName: 'CleanPro Housekeeping', staffCount: 8, expectedManDays: 208, presentManDays: 195, absentDays: 13, lateCount: 4, correctionsCount: 4, verificationStatus: 'DISPUTED', invoiceMonth: 'June 2026', ...includeWhenPresent("lockedAt", undefined) },
    { vendorId: 'vendor-amc-001', vendorName: 'OtisLift Services', staffCount: 1, expectedManDays: 26, presentManDays: 26, absentDays: 0, lateCount: 0, correctionsCount: 0, verificationStatus: 'VERIFIED', invoiceMonth: 'June 2026', lockedAt: '2026-06-29T10:00:00Z' },
    { vendorId: 'vendor-elec-001', vendorName: 'ShriGanesh Electricals', staffCount: 1, expectedManDays: 26, presentManDays: 24, absentDays: 2, lateCount: 1, correctionsCount: 1, verificationStatus: 'NOT_REVIEWED', invoiceMonth: 'June 2026' },
];

