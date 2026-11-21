import type { AuthGateway } from './authGateway.types';
import { mockAuthGateway } from './mockAuthGateway';
import { restAuthGateway } from './restAuthGateway';
import { runtimePolicy } from '../config/runtimePolicy';

export function getAuthGateway(): AuthGateway {
  if (runtimePolicy.isProduction() || runtimePolicy.isApiMode()) {
    return restAuthGateway;
  }
  return mockAuthGateway;
}

export { mockAuthGateway, restAuthGateway };
