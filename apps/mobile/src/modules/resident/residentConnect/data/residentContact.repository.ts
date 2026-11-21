import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import type { ResidentContactRepositoryContract } from '../domain/residentContact.types';
import { residentContactApiSource } from './residentContact.apiSource';
import { residentContactMockSource } from './residentContact.mockSource';

export const residentContactRepository: ResidentContactRepositoryContract = createRepository({
  moduleKey: 'residentConnect',
  mockRepository: residentContactMockSource,
  apiRepository: residentContactApiSource,
});
