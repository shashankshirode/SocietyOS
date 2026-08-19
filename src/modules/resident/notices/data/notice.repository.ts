import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { noticeApiSource } from './notice.apiSource';
import { noticeMockSource } from './notice.mockSource';

export const noticeRepository = createRepository({
  moduleKey: 'residentNotices',
  mockRepository: noticeMockSource,
  apiRepository: noticeApiSource,
});
