import { resolveDataSource } from '../../../../core/dataSource/dataSourceResolver';
import { DATA_SOURCE_ENV_KEY } from '../../../../core/dataSource/dataSource.constants';
import type { RepositoryError, RepositoryResult } from '../../../../core/repositories/repository.types';
const MODULE_KEY = 'residentInterFlatIssues' as const;
export function isExplicitDemoMode(): boolean {
    const configured = process.env[DATA_SOURCE_ENV_KEY];
    return configured === 'mock' || configured === 'hybrid';
}
export function isJestRun(): boolean {
    return process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
}
export function mockSourcePermitted(): boolean {
    return isJestRun() || isExplicitDemoMode();
}
const MOCK_NOT_PERMITTED: RepositoryError = {
    code: 'DISPUTE_SOURCE_NOT_TRUSTED',
    category: 'INTEGRATION_UNAVAILABLE',
    retryable: false,
    message: 'Inter-flat dispute data is unavailable because no trusted backend is configured. ' +
        'Mock disputes are served only in tests or an explicitly selected demo build, never by default.',
};
export function disputeSourceNotTrusted<T>(): RepositoryResult<T> {
    return { ok: false, error: { ...MOCK_NOT_PERMITTED } };
}
export function guardDisputeSource<T>(operation: string): RepositoryResult<T> | Absent {
    const resolved = resolveDataSource(MODULE_KEY);
    if (resolved.isApi) {
        return undefined;
    }
    if (mockSourcePermitted()) {
        return undefined;
    }
    return {
        ok: false,
        error: {
            ...MOCK_NOT_PERMITTED,
            message: `${MOCK_NOT_PERMITTED.message} (operation: ${operation})`,
        },
    };
}
type Absent = undefined;

