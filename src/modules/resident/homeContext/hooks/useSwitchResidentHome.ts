import { useCallback, useRef, useState } from 'react';
import { residentHomeContextRepository } from '../data/residentHomeContext.repository';
import { residentHomeContextStorage } from '../utils/residentHomeContextStorage';
import { mapContextRoleToAppRole } from '../utils/residentHomeContextPermissions';
import { getCurrentSession, setCurrentSession } from '../../../../core/auth/sessionStore';
import { residentHomeContextStore } from '../state/residentHomeContext.store';
import { useMessages } from '../../../../messages/useMessages';

export function useSwitchResidentHome() {
  const messages = useMessages();
  const switchInFlight = useRef(false);
  const [switchingHomeContextId, setSwitchingHomeContextId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const switchHome = useCallback(async (homeContextId: string): Promise<boolean> => {
    const previousActiveContext = residentHomeContextStore.getActiveContext();
    if (previousActiveContext.homeContextId === homeContextId) {
      return true;
    }
    if (switchInFlight.current) {
      return false;
    }

    switchInFlight.current = true;
    setSwitchingHomeContextId(homeContextId);
    setError(null);

    try {
      const result = await residentHomeContextRepository.switchHomeContext({ homeContextId });
      if (!result.ok) {
        setError(result.error.message);
        return false;
      }

      const saved = await residentHomeContextStorage.saveSelectedContextId(
        result.data.activeContext.homeContextId
      );
      if (!saved) {
        setError(messages.resident.homeContext.persistenceFailed);
        return false;
      }

      const currentSessionData = getCurrentSession();
      if (currentSessionData) {
        const appRole = mapContextRoleToAppRole(result.data.activeContext.residentRole);
        await setCurrentSession({
          ...currentSessionData,
          role: appRole,
          societyId: result.data.activeContext.societyId,
          societyName: result.data.activeContext.societyName,
          unitId: result.data.activeContext.unitId,
          unitLabel: result.data.activeContext.displayUnitName,
        });
      }

      residentHomeContextStore.setActiveContext(result.data.activeContext);
      return true;
    } catch {
      await residentHomeContextStorage.saveSelectedContextId(
        previousActiveContext.homeContextId
      );
      residentHomeContextStore.setActiveContext(previousActiveContext);
      setError(messages.resident.homeContext.unableToSwitch);
      return false;
    } finally {
      switchInFlight.current = false;
      setSwitchingHomeContextId(null);
    }
  }, [messages]);

  return {
    switchHome,
    isSubmitting: switchingHomeContextId !== null,
    switchingHomeContextId,
    error,
  };
}

export default useSwitchResidentHome;
