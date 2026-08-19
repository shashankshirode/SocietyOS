import type { DailyAttendanceSummary, AttendanceDashboard } from '../types/attendance.types';
import { mockAttendancePunches } from './attendancePunches.mock';
import { getRequiredItem } from "../utils/requiredItem";
export const mockDailySummaries: DailyAttendanceSummary[] = Array.from({ length: 30 }).map((_, idx) => {
    const dayOffset = idx;
    const present = 24 - (idx % 3);
    const absent = 3 + (idx % 3);
    const late = 2 + (idx % 2);
    const missingCheckout = idx % 5 === 0 ? 1 : 0;
    const dateStr = `2026-06-${String(29 - dayOffset).padStart(2, '0')}`;
    return {
        date: dateStr,
        totalExpected: 30,
        present,
        absent,
        late,
        halfDay: idx % 10 === 0 ? 1 : 0,
        onLeave: 2,
        weeklyOff: idx % 7 === 0 ? 4 : 0,
        missingCheckout,
        manualEntries: idx % 4 === 0 ? 2 : 0,
        biometricEntries: present - (idx % 4 === 0 ? 2 : 0),
        correctionsPending: idx % 6 === 0 ? 1 : 0,
        attendancePercentage: Math.round((present / 30) * 100),
    };
});
export const mockAttendanceDashboard: AttendanceDashboard = {
    date: '2026-06-29',
    summary: getRequiredItem(mockDailySummaries, 0, "attendanceSummaries.mock.ts"),
    byCategory: [
        { category: 'SECURITY_GUARD', total: 10, present: 9, absent: 0, late: 1 },
        { category: 'HOUSEKEEPING', total: 8, present: 7, absent: 1, late: 0 },
        { category: 'FACILITY_STAFF', total: 6, present: 5, absent: 1, late: 0 },
        { category: 'OFFICE_STAFF', total: 2, present: 2, absent: 0, late: 0 },
        { category: 'CLUBHOUSE_STAFF', total: 2, present: 1, absent: 1, late: 0 },
        { category: 'VENDOR_WORKER', total: 2, present: 2, absent: 0, late: 0 },
    ],
    byVendor: [
        { vendorName: 'SafeGuard Security Services', total: 10, present: 9, absent: 0 },
        { vendorName: 'CleanPro Housekeeping', total: 8, present: 7, absent: 1 },
        { vendorName: 'OtisLift Services', total: 1, present: 1, absent: 0 },
        { vendorName: 'ShriGanesh Electricals', total: 1, present: 1, absent: 0 },
    ],
    byLocation: [
        { location: 'Main Gate', total: 8, present: 8, absent: 0 },
        { location: 'B Wing Gate', total: 2, present: 1, absent: 0 },
        { location: 'A Wing', total: 3, present: 3, absent: 0 },
        { location: 'B Wing', total: 3, present: 2, absent: 1 },
        { location: 'C Wing', total: 2, present: 2, absent: 0 },
        { location: 'Clubhouse', total: 3, present: 2, absent: 1 },
    ],
    recentPunches: mockAttendancePunches.slice(0, 10),
    lateArrivals: [
        { staffName: 'Suresh Kamble', staffCode: 'STF-SEC-003', punchTime: '07:18 AM', minutesLate: 18 },
        { staffName: 'Kavita Patil', staffCode: 'STF-HK-004', punchTime: '08:25 AM', minutesLate: 25 },
    ],
    missingCheckouts: [
        { staffName: 'Leela Deshpande', staffCode: 'STF-HK-006', lastPunchTime: '08:05 AM', shiftEndTime: '16:00' },
    ],
};

