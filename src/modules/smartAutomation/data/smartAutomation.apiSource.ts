import type { RepositoryResult } from '../../../core/repositories/repository.types';
import type { AutomationController } from './smartAutomation.types';

export const smartAutomationApiSource = {
  async getControllers(): Promise<RepositoryResult<AutomationController[]>> {
    throw new Error('Not implemented');
  },

  async toggleController(id: string): Promise<RepositoryResult<AutomationController>> {
    throw new Error('Not implemented');
  },
};
