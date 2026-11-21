import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { domesticHelpApiSource } from './domesticHelp.apiSource';
import { domesticHelpMockSource } from './domesticHelp.mockSource';

export const domesticHelpRepository = createRepository({
  moduleKey: 'residentDomesticHelp',
  mockRepository: domesticHelpMockSource,
  apiRepository: domesticHelpApiSource,
});
