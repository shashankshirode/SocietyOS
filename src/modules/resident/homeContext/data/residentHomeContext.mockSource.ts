import { repositorySuccess, repositoryFailure, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { ResidentHomeContext, ActiveResidentHomeContext, SwitchResidentHomeInput, SwitchResidentHomeResult } from './residentHomeContext.types';
import { mockResidentHomeContexts } from './residentHomeContext.mockData';
import { isSelectableResidentHomeContext, mapContextToActive } from '../state/residentHomeContext.store';
import { activeHomeStore } from './activeHomeStore';
import { enMessages } from '../../../../messages/en';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
export function setActiveContextIdSync(id: string) {
    activeHomeStore.setActiveContextId(id);
}
export function getActiveContextIdSync(): string {
    return activeHomeStore.getActiveContextId();
}
export const residentHomeContextMockSource = {
    async getHomeContexts(): Promise<RepositoryResult<ResidentHomeContext[]>> {
        await withMockDelay();
        const currentId = activeHomeStore.getActiveContextId();
        const list = mockResidentHomeContexts.map((ctx) => ({
            ...ctx,
            isCurrent: ctx.homeContextId === currentId,
        }));
        return repositorySuccess(list);
    },
    async getActiveHomeContext(): Promise<RepositoryResult<ActiveResidentHomeContext>> {
        await withMockDelay();
        const currentId = activeHomeStore.getActiveContextId();
        const found = mockResidentHomeContexts.find((ctx) => ctx.homeContextId === currentId) || getRequiredItem(mockResidentHomeContexts, 0, "residentHomeContext.mockSource.ts");
        const active = mapContextToActive(found);
        return repositorySuccess(active);
    },
    async switchHomeContext(input: SwitchResidentHomeInput): Promise<RepositoryResult<SwitchResidentHomeResult>> {
        await withMockDelay();
        const target = mockResidentHomeContexts.find((ctx) => ctx.homeContextId === input.homeContextId);
        if (!target) {
            return repositoryFailure({
                code: 'CONTEXT_NOT_FOUND',
                message: enMessages.resident.homeContext.contextNotFound,
            });
        }
        if (target.status === 'pendingApproval') {
            return repositoryFailure({
                code: 'CONTEXT_PENDING_APPROVAL',
                message: enMessages.resident.homeContext.pendingHomeUnavailable,
            });
        }
        if (!isSelectableResidentHomeContext(target)) {
            return repositoryFailure({
                code: 'CONTEXT_PENDING_APPROVAL',
                message: enMessages.resident.homeContext.pendingHomeUnavailable,
            });
        }
        if (target.status === 'inactive') {
            return repositoryFailure({
                code: 'CONTEXT_INACTIVE',
                message: enMessages.resident.homeContext.inactiveHomeUnavailable,
            });
        }
        const active = mapContextToActive(target);
        const updatedContexts = mockResidentHomeContexts.map((ctx) => ({
            ...ctx,
            isCurrent: ctx.homeContextId === target.homeContextId,
        }));
        return repositorySuccess({
            activeContext: active,
            availableContexts: updatedContexts,
        });
    },
};
export default residentHomeContextMockSource;

