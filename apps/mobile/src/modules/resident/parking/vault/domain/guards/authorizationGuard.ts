import type { ParkingVaultDecision, VaultActor, ParkingVaultScope } from '../types/primitives';
import { allowedWith, denied, violation } from '../types/primitives';

export function evaluateActionPermission(
  actor: VaultActor,
  _action: string,
): ParkingVaultDecision {
  if (!actor || !actor.userId) {
    return denied([
      violation('ACTOR_NOT_AUTHENTICATED', 'actor', 'Actor is not authenticated'),
    ]);
  }
  return allowedWith([]);
}

export function evaluateTenantBoundary(
  actor: VaultActor,
  target: { readonly societyId?: string } | ParkingVaultScope | undefined,
): ParkingVaultDecision {
  if (target && target.societyId && actor.societyId !== target.societyId) {
    return denied([
      violation('CROSS_SOCIETY_BLOCKED', 'societyId', 'Target resource belongs to a different society'),
    ]);
  }
  return allowedWith([]);
}
