import type { SosEvent, SosEventStatus, SosRecipientDelivery, SosResidenceContext, } from './sosResponsePlan.types';
import type { TriggerSosInput } from './sosEvent.repository.contract';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
import AsyncStorage from '@react-native-async-storage/async-storage';
const eventStore: SosEvent[] = [];
let eventIdCounter = 1000;
let hydration: Promise<void> | null = null;
const storageKey = 'society-os.mock.sos-events.v4';
const obsoleteStorageKey = 'society-os.mock.sos-events.v1';
const activeStatuses: SosEventStatus[] = ['initiated', 'recipientsNotified', 'acknowledged', 'responderDispatched', 'escalated'];
function ensureHydrated(): Promise<void> {
    if (!hydration) {
        hydration = AsyncStorage.getItem(storageKey).then((raw) => {
            void AsyncStorage.removeItem(obsoleteStorageKey);
            if (!raw)
                return;
            const parsed = JSON.parse(raw) as SosEvent[];
            eventStore.splice(0, eventStore.length, ...parsed);
        }).catch(() => undefined);
    }
    return hydration;
}
async function persist(): Promise<void> {
    await AsyncStorage.setItem(storageKey, JSON.stringify(eventStore));
}
function delay(ms: number = 400): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function scheduleSimulation(callback: () => void, milliseconds: number): void {
    setTimeout(callback, milliseconds);
}
export const sosEventMockSource = {
    async triggerSos(input: TriggerSosInput): Promise<SosEvent> {
        await ensureHydrated();
        await delay(600);
        const current = eventStore.find((candidate) => candidate.residenceId === input.context.residenceId && !candidate.isTestMode && activeStatuses.includes(candidate.status));
        if (current)
            return current;
        eventIdCounter += 1;
        const now = new Date().toISOString();
        const recipientDeliveries: SosRecipientDelivery[] = input.resolvedRecipients.map((r) => ({
            recipientId: r.recipientId,
            displayName: r.displayName,
            recipientType: r.recipientType,
            deliveryStatus: 'pending',
            channel: r.channels[0] ?? 'push'
        }));
        const event: SosEvent = {
            id: `sos-event-${eventIdCounter}`,
            sosType: input.sosType,
            residenceId: input.context.residenceId,
            societyId: input.context.societyId,
            unitId: input.context.unitId,
            flatNumber: input.context.flatNumber,
            tower: input.context.tower,
            triggeredByUserId: input.triggeredByUserId,
            triggeredByUserName: input.triggeredByUserName,
            status: input.isTestMode ? 'testCompleted' : 'initiated',
            isTestMode: input.isTestMode,
            recipientDeliveries,
            planId: undefined,
            planMode: 'default',
            ...includeWhenPresent("note", input.note),
            triggeredAt: now
        };
        eventStore.push(event);
        await persist();
        if (!input.isTestMode && process.env.NODE_ENV !== 'test') {
            simulateDelivery(event.id);
        }
        return event;
    },
    async getActiveSosEvent(context: SosResidenceContext): Promise<SosEvent | Absent> {
        await ensureHydrated();
        await delay(200);
        return eventStore.find((e) => e.residenceId === context.residenceId &&
            e.societyId === context.societyId &&
            !e.isTestMode &&
            activeStatuses.includes(e.status));
    },
    async getSosEvent(eventId: string): Promise<SosEvent | Absent> {
        await ensureHydrated();
        await delay(200);
        return eventStore.find((e) => e.id === eventId);
    },
    async acknowledgeSos(eventId: string, recipientId: string): Promise<SosEvent> {
        await ensureHydrated();
        await delay(300);
        const event = eventStore.find((e) => e.id === eventId);
        if (!event)
            throw new Error(`SOS event ${eventId} not found`);
        const now = new Date().toISOString();
        const updatedDeliveries = event.recipientDeliveries.map((d) => {
            if (d.recipientId === recipientId) {
                return { ...d, deliveryStatus: 'acknowledged' as const, acknowledgedAt: now };
            }
            return d;
        });
        const updated: SosEvent = {
            ...event,
            recipientDeliveries: updatedDeliveries,
            status: 'acknowledged',
            acknowledgedAt: now
        };
        const idx = eventStore.indexOf(event);
        eventStore[idx] = updated;
        await persist();
        return updated;
    },
    async cancelSos(eventId: string, _reason: string): Promise<SosEvent> {
        await ensureHydrated();
        await delay(300);
        const event = eventStore.find((e) => e.id === eventId);
        if (!event)
            throw new Error(`SOS event ${eventId} not found`);
        const updated: SosEvent = {
            ...event,
            status: 'cancelled',
            cancelledAt: new Date().toISOString()
        };
        const idx = eventStore.indexOf(event);
        eventStore[idx] = updated;
        await persist();
        return updated;
    },
    async resolveSos(eventId: string): Promise<SosEvent> {
        await ensureHydrated();
        await delay(300);
        const event = eventStore.find((e) => e.id === eventId);
        if (!event)
            throw new Error(`SOS event ${eventId} not found`);
        const updated: SosEvent = {
            ...event,
            status: 'resolved',
            resolvedAt: new Date().toISOString()
        };
        const idx = eventStore.indexOf(event);
        eventStore[idx] = updated;
        await persist();
        return updated;
    },
    async getSosHistory(context: SosResidenceContext): Promise<SosEvent[]> {
        await ensureHydrated();
        await delay();
        return eventStore
            .filter((e) => e.residenceId === context.residenceId && e.societyId === context.societyId)
            .sort((a, b) => new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime());
    },
    _seedEvents(events: SosEvent[]): void {
        eventStore.length = 0;
        eventStore.push(...events);
    },
    _resetAll(): void {
        eventStore.length = 0;
        eventIdCounter = 1000;
        hydration = Promise.resolve();
        void AsyncStorage.multiRemove([storageKey, obsoleteStorageKey]);
    }
};
function simulateDelivery(eventId: string): void {
    scheduleSimulation(() => {
        const event = eventStore.find((e) => e.id === eventId);
        if (!event || event.status === 'cancelled' || event.status === 'resolved')
            return;
        const updatedDeliveries = event.recipientDeliveries.map((d) => ({
            ...d,
            deliveryStatus: 'delivered' as const,
            deliveredAt: new Date().toISOString()
        }));
        const idx = eventStore.indexOf(event);
        eventStore[idx] = {
            ...event,
            recipientDeliveries: updatedDeliveries,
            status: 'recipientsNotified'
        };
        void persist();
    }, 1500);
    scheduleSimulation(() => {
        const event = eventStore.find((e) => e.id === eventId);
        if (!event || event.status === 'cancelled' || event.status === 'resolved')
            return;
        if (event.recipientDeliveries.length > 0) {
            const updatedDeliveries = event.recipientDeliveries.map((d, i) => {
                if (i === 0) {
                    return { ...d, deliveryStatus: 'acknowledged' as const, acknowledgedAt: new Date().toISOString() };
                }
                return d;
            });
            const idx = eventStore.indexOf(event);
            eventStore[idx] = {
                ...event,
                recipientDeliveries: updatedDeliveries,
                status: 'acknowledged',
                acknowledgedAt: new Date().toISOString()
            };
            void persist();
        }
    }, 4000);
}
