import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { documentApiSource } from './document.apiSource';
import { documentMockSource } from './document.mockSource';

export const documentRepository = createRepository({
  moduleKey: 'residentDocuments',
  mockRepository: documentMockSource,
  apiRepository: documentApiSource,
});
