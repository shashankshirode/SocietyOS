import type { EmergencyActionId } from './emergencyAction.types';
import { repositorySuccess, repositoryFailure, type RepositoryResult } from '../../../../core/repositories/repository.types';

export const residentEmergencyMockSource = {
  async triggerAction(actionId: EmergencyActionId): Promise<RepositoryResult<{ eventId: string }>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (actionId === 'FIRE_ALERT') {
          resolve(
            repositoryFailure({
              message: 'Fire alert failed to broadcast. Local networks unreachable.',
              code: 'NETWORK_ERROR',
            })
          );
        } else {
          resolve(
            repositorySuccess({
              eventId: `evt-mock-${actionId.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
            })
          );
        }
      }, 500);
    });
  },
};
