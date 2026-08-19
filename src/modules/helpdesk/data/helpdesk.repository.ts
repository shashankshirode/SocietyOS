import { appConfig } from '../../../core/config/appConfig';
import { helpdeskApiSource } from './helpdesk.apiSource';
import { helpdeskMockSource } from './helpdesk.mockSource';

export const helpdeskRepository =
  appConfig.dataSourceMode === 'api' ? helpdeskApiSource : helpdeskMockSource;

