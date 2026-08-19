import { appConfig } from '../../../core/config/appConfig';
import { biometricApiSource } from './biometricAttendance.apiSource';
import { biometricMockSource } from './biometricAttendance.mockSource';

export const biometricRepository =
  appConfig.dataSourceMode === 'api' ? biometricApiSource : biometricMockSource;
export default biometricRepository;
