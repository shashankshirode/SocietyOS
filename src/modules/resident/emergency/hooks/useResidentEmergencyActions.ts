import { useCallback } from 'react';
import type { EmergencyActionId } from '../data/emergencyAction.types';
import type { SosCommandDockState } from '../data/residentEmergency.types';
import { residentEmergencyRepository } from '../data/residentEmergency.repository';

export function useResidentEmergencyActions(
  onChangeState: (newState: SosCommandDockState) => void
) {
  const triggerAction = useCallback(async (actionId: EmergencyActionId) => {
    onChangeState({ status: 'triggering', actionId });
    try {
      const result = await residentEmergencyRepository.triggerAction(actionId);
      if (result.ok) {
        onChangeState({
          status: 'success',
          actionId,
          eventId: result.data.eventId,
        });
      } else {
        onChangeState({
          status: 'failed',
          actionId,
          errorMessageKey: 'resident.emergency.errors.triggerFailed',
        });
      }
    } catch {
      onChangeState({
        status: 'failed',
        actionId,
        errorMessageKey: 'resident.emergency.errors.triggerFailed',
      });
    }
  }, [onChangeState]);

  return {
    triggerAction,
  };
}

export default useResidentEmergencyActions;
