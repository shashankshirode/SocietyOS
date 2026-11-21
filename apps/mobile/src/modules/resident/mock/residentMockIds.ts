import type { ResidentMockFeatureKey } from './residentMockScenario.types';

export function createResidentMockId(
  homeContextId: string,
  feature: ResidentMockFeatureKey,
  ordinal: number
): string {
  return `${homeContextId}:${feature}:${String(ordinal + 1).padStart(3, '0')}`;
}

export function createResidentMockEdgeCaseId(
  homeContextId: string,
  feature: ResidentMockFeatureKey,
  state: string
): string {
  return `${homeContextId}:${feature}:edge:${state}`;
}
