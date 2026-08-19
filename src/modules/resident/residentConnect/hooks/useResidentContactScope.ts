import { useMemo } from 'react';
import { useActiveResidentHome } from '../../homeContext/hooks/useActiveResidentHome';
import type { ResidentContactScope } from '../domain/residentContact.types';

export function useResidentContactScope(): ResidentContactScope & { dataScopeKey: string; canInitiateResidentContact: boolean } {
  const { activeContext } = useActiveResidentHome();
  return useMemo(() => ({
    societyId: activeContext.societyId,
    activeUnitId: activeContext.unitId,
    authenticatedUserId: `user-${activeContext.residentId}`,
    residentProfileId: activeContext.residentId,
    dataScopeKey: activeContext.dataScopeKey,
    canInitiateResidentContact: activeContext.residentRole === 'owner' || activeContext.residentRole === 'coOwner' || activeContext.residentRole === 'tenant',
  }), [activeContext.dataScopeKey, activeContext.residentId, activeContext.residentRole, activeContext.societyId, activeContext.unitId]);
}
