import type { RepositoryError, RepositoryErrorCategory } from '../repositories/repository.types';

export type FaultScenario =
  | 'NORMAL'
  | 'SLOW'
  | 'OFFLINE'
  | 'TIMEOUT'
  | 'NOT_FOUND'
  | 'PERMISSION_DENIED'
  | 'FEATURE_DISABLED'
  | 'CONFLICT'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT'
  | 'EMPTY_DATA'
  | 'LARGE_DATASET'
  | 'MALFORMED_RESPONSE';

export interface FaultProfile {
  readonly scenario: FaultScenario;
  readonly latencyMs?: number;
  readonly forcedErrorCode?: string;
  readonly forcedErrorMessage?: string;
  readonly forcedErrorCategory?: RepositoryErrorCategory;
}

const DEFAULT_PROFILE: FaultProfile = { scenario: 'NORMAL' };

let activeProfile: FaultProfile = { ...DEFAULT_PROFILE };

export function getFaultProfile(): FaultProfile {
  return activeProfile;
}

export function setFaultProfile(profile: Partial<FaultProfile>): void {
  activeProfile = { ...DEFAULT_PROFILE, ...profile };
}

export function resetFaultProfile(): void {
  activeProfile = { ...DEFAULT_PROFILE };
}

/**
 * Execute an operation subject to the active fault injection profile.
 * Used at infrastructure/repository boundaries without scattering if-statements in UI/domain code.
 */
export async function executeWithFaultSimulation<T>(
  _operationName: string,
  execute: () => Promise<T>
): Promise<T> {
  const profile = getFaultProfile();
  if (profile.scenario === 'NORMAL') {
    return execute();
  }

  if (profile.scenario === 'SLOW' && profile.latencyMs) {
    await new Promise((r) => setTimeout(r, profile.latencyMs));
    return execute();
  }

  if (profile.scenario === 'OFFLINE') {
    const error: RepositoryError = {
      code: profile.forcedErrorCode ?? 'NETWORK_OFFLINE',
      message: profile.forcedErrorMessage ?? 'Device is currently offline. Please check your network connection.',
      category: 'OFFLINE',
      retryable: true,
      preserveInput: true,
    };
    throw error;
  }

  if (profile.scenario === 'TIMEOUT') {
    const error: RepositoryError = {
      code: profile.forcedErrorCode ?? 'REQUEST_TIMEOUT',
      message: profile.forcedErrorMessage ?? 'Request timed out waiting for server response.',
      category: 'TIMEOUT',
      retryable: true,
      preserveInput: true,
    };
    throw error;
  }

  if (profile.scenario === 'SERVER_ERROR') {
    const error: RepositoryError = {
      code: profile.forcedErrorCode ?? 'SERVER_ERROR',
      message: profile.forcedErrorMessage ?? 'Internal server error encountered.',
      category: 'SERVER_ERROR',
      retryable: true,
      preserveInput: true,
    };
    throw error;
  }

  if (profile.scenario === 'PERMISSION_DENIED') {
    const error: RepositoryError = {
      code: profile.forcedErrorCode ?? 'FORBIDDEN',
      message: profile.forcedErrorMessage ?? 'You do not have permission to perform this action.',
      category: 'FORBIDDEN',
      retryable: false,
      preserveInput: false,
    };
    throw error;
  }

  if (profile.scenario === 'CONFLICT') {
    const error: RepositoryError = {
      code: profile.forcedErrorCode ?? 'CONFLICT',
      message: profile.forcedErrorMessage ?? 'Conflict with current resource state.',
      category: 'CONFLICT',
      retryable: false,
      preserveInput: true,
    };
    throw error;
  }

  return execute();
}
