import { appConfig } from '../../../core/config/appConfig';
import { hardwareApiSource } from './hardware.apiSource';
import { hardwareMockSource } from './hardware.mockSource';

export const hardwareRepository =
  appConfig.dataSourceMode === 'api' ? hardwareApiSource : hardwareMockSource;
export default hardwareRepository;
