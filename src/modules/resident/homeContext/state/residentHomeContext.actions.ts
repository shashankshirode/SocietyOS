import {
  isSelectableResidentHomeContext,
  mapContextToActive,
  residentHomeContextStore,
} from './residentHomeContext.store';
import { mockResidentHomeContexts } from '../data/residentHomeContext.mockData';
import { residentHomeContextStorage } from '../utils/residentHomeContextStorage';
import { getCurrentSession, setCurrentSession } from '../../../../core/auth/sessionStore';
import { mapContextRoleToAppRole } from '../utils/residentHomeContextPermissions';

export async function switchHomeAction(homeContextId: string): Promise<boolean> {
  const target = mockResidentHomeContexts.find((ctx) => ctx.homeContextId === homeContextId);
  if (!target) {
    return false;
  }
  if (!isSelectableResidentHomeContext(target)) {
    return false;
  }

  const activeContext = mapContextToActive(target);
  const saved = await residentHomeContextStorage.saveSelectedContextId(homeContextId);
  if (!saved) {
    return false;
  }

  const currentSessionData = getCurrentSession();
  if (currentSessionData) {
    const appRole = mapContextRoleToAppRole(target.residentRole);
    await setCurrentSession({
      ...currentSessionData,
      role: appRole,
      societyId: target.societyId,
      societyName: target.societyName,
      unitId: target.unitId,
      unitLabel: target.displayUnitName,
    });
  }

  residentHomeContextStore.setActiveContext(activeContext);

  return true;
}
