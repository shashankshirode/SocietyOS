export * from './contracts/api.types';
export * from './contracts/domains/auth.contracts';
export * from './contracts/domains/resident.contracts';
export * from './contracts/domains/visitor.contracts';
export * from './contracts/domains/complaint.contracts';
export * from './contracts/domains/billing.contracts';
export * from './contracts/domains/facility.contracts';
export * from './contracts/domains/notice.contracts';

export type { ApiClientConfig, RequestConfig } from './client/UniversalApiClient';
export { UniversalApiClient } from './client/UniversalApiClient';
export * from './services/ApiService';
export * from './hooks/useApi';
export * from './hooks/useDomainHooks';

export * from './mock/MockApiServer';