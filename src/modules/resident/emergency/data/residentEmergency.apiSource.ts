import type { EmergencyActionId } from './emergencyAction.types';
import type { RepositoryResult } from '../../../../core/repositories/repository.types';

export const residentEmergencyApiSource = {
  async triggerAction(actionId: EmergencyActionId): Promise<RepositoryResult<{ eventId: string }>> {
    throw new Error('Backend Integration required');
  },
};
