import { appConfig } from '../../../core/config/appConfig';
import { smartAutomationApiSource } from './smartAutomation.apiSource';
import { smartAutomationMockSource } from './smartAutomation.mockSource';

export const smartAutomationRepository =
  appConfig.dataSourceMode === 'api' ? smartAutomationApiSource : smartAutomationMockSource;
export default smartAutomationRepository;
