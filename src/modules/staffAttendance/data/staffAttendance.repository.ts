import { DATA_SOURCE_MODE } from '../../../core/config/dataSourceMode';
import { staffAttendanceMockSource } from './staffAttendance.mockSource';
import { staffAttendanceApiSource } from './staffAttendance.apiSource';

export const staffAttendanceRepository =
  DATA_SOURCE_MODE === 'mock' ? staffAttendanceMockSource : staffAttendanceApiSource;
