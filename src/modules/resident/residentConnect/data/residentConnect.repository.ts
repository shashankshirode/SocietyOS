import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { residentConnectApiSource } from './residentConnect.apiSource';
import { residentConnectMockSource } from './residentConnect.mockSource';

export const residentConnectRepository = createRepository({
  moduleKey: 'residentConnect',
  mockRepository: residentConnectMockSource,
  apiRepository: residentConnectApiSource,
});

export type { BlockedResidentInfo, ModerationReport } from '../../../../shared/types/privacy.types';
