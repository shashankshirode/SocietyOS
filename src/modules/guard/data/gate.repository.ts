import { appConfig } from '../../../core/config/appConfig';
import { gateApiSource } from './gate.apiSource';
import { gateMockSource } from './gate.mockSource';

export const gateRepository =
  appConfig.dataSourceMode === 'api' ? gateApiSource : gateMockSource;

