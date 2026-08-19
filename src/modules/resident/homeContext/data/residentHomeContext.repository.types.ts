import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentHomeContext, ActiveResidentHomeContext, SwitchResidentHomeInput, SwitchResidentHomeResult } from './residentHomeContext.types';

export type ResidentHomeContextRepository = {
  getHomeContexts(): Promise<RepositoryResult<ResidentHomeContext[]>>;
  getActiveHomeContext(): Promise<RepositoryResult<ActiveResidentHomeContext>>;
  switchHomeContext(input: SwitchResidentHomeInput): Promise<RepositoryResult<SwitchResidentHomeResult>>;
};
