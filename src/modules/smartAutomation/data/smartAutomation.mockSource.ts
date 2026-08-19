import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../core/repositories/repository.types';
import type { AutomationController } from './smartAutomation.types';
import { mockAutomationControllers } from './smartAutomation.mockData';
import { getRequiredItem } from "../../../shared/utils/requiredItem";
export const smartAutomationMockSource = {
    async getControllers(): Promise<RepositoryResult<AutomationController[]>> {
        await withMockDelay();
        return repositorySuccess(mockAutomationControllers);
    },
    async toggleController(id: string): Promise<RepositoryResult<AutomationController>> {
        await withMockDelay();
        const ctrl = mockAutomationControllers.find(c => c.id === id);
        if (ctrl) {
            ctrl.status = ctrl.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            ctrl.lastRunTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
            return repositorySuccess(ctrl);
        }
        return repositorySuccess(getRequiredItem(mockAutomationControllers, 0, "smartAutomation.mockSource.ts"));
    },
};

