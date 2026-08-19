import { resolveDataSource } from './dataSourceResolver';
import type { RepositorySourcePair } from './dataSource.types';

export function createRepository<TMockRepository, TApiRepository>({
  moduleKey,
  mockRepository,
  apiRepository,
}: RepositorySourcePair<TMockRepository, TApiRepository>): TMockRepository | TApiRepository {
  const resolved = resolveDataSource(moduleKey);
  return resolved.isApi ? apiRepository : mockRepository;
}
