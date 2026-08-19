import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { parcelApiSource } from './parcelHandover.apiSource';
import { parcelMockSource } from './parcelHandover.mockSource';

export const parcelRepository = createRepository({
  moduleKey: 'residentParcelHandover',
  mockRepository: parcelMockSource,
  apiRepository: parcelApiSource,
});
export default parcelRepository;
