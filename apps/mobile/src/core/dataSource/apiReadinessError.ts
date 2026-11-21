import type { AppModuleKey } from './dataSource.types';

export type ApiReadinessError = {
  code: 'API_SOURCE_NOT_READY';
  moduleKey: AppModuleKey;
  message: string;
};

export function createApiReadinessError(moduleKey: AppModuleKey): ApiReadinessError {
  return {
    code: 'API_SOURCE_NOT_READY',
    moduleKey,
    message: `API source is not ready for ${moduleKey}. Mock data remains the safe fallback.`,
  };
}

