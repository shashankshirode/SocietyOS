import { resolveStaffAttendanceSourceMode } from './staffAttendanceSourceGuard';
import { staffAttendanceMockSource } from './staffAttendance.mockSource';
import { staffAttendanceApiSource } from './staffAttendance.apiSource';

export const staffAttendanceRepository =
  resolveStaffAttendanceSourceMode() === 'api'
    ? staffAttendanceApiSource
    : staffAttendanceMockSource;

