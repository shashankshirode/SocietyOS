import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { residentAuthApiSource } from './residentAuth.apiSource';
import { residentAuthMockSource } from './residentAuth.mockSource';

export const residentAuthRepository = resolveDataSource('residentAuth').isApi
  ? residentAuthApiSource
  : residentAuthMockSource;
