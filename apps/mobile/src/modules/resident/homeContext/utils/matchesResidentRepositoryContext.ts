import type { ResidentScopedEntity } from '../../../../shared/types/residentScope.types';
import type { ResidentRepositoryRequestContext } from '../data/residentHomeContext.types';

export function matchesResidentRepositoryContext(
  entity: ResidentScopedEntity,
  context: ResidentRepositoryRequestContext
): boolean {
  return (
    entity.homeContextId === context.activeHome.homeContextId &&
    entity.societyId === context.activeHome.societyId &&
    entity.unitId === context.activeHome.unitId &&
    entity.dataScopeKey === context.dataScopeKey
  );
}

export function matchesResidentSocietyContext(
  entity: ResidentScopedEntity,
  context: ResidentRepositoryRequestContext
): boolean {
  return entity.societyId === context.activeHome.societyId;
}
