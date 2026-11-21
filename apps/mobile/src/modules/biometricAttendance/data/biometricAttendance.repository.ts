import { resolveStaffAttendanceSourceMode } from '../../staffAttendance/data/staffAttendanceSourceGuard';
import { biometricApiSource } from './biometricAttendance.apiSource';
import { biometricMockSource } from './biometricAttendance.mockSource';

export const biometricRepository =
  resolveStaffAttendanceSourceMode() === 'api' ? biometricApiSource : biometricMockSource;
export default biometricRepository;

