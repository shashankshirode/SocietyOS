import { sosEventMockSource } from './sosEvent.mockSource';
import type { SosEventRepositoryContract, TriggerSosInput } from './sosEvent.repository.contract';
import type { SosResidenceContext } from './sosResponsePlan.types';
export type { SosEventRepositoryContract, TriggerSosInput } from './sosEvent.repository.contract';
export const sosEventRepository: SosEventRepositoryContract = {
    triggerSos(input: TriggerSosInput) {
        return sosEventMockSource.triggerSos(input);
    },
    getActiveSosEvent(context: SosResidenceContext) {
        return sosEventMockSource.getActiveSosEvent(context);
    },
    getSosEvent(eventId: string) {
        return sosEventMockSource.getSosEvent(eventId);
    },
    acknowledgeSos(eventId: string, recipientId: string) {
        return sosEventMockSource.acknowledgeSos(eventId, recipientId);
    },
    cancelSos(eventId: string, reason: string) {
        return sosEventMockSource.cancelSos(eventId, reason);
    },
    resolveSos(eventId: string) {
        return sosEventMockSource.resolveSos(eventId);
    },
    getSosHistory(context: SosResidenceContext) {
        return sosEventMockSource.getSosHistory(context);
    },
};
