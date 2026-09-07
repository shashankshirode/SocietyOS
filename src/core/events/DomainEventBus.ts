import type { JsonObject } from '../api/api.types';
import type { Absent } from "../../shared/types/absence.types";
export interface DomainEventActor {
    readonly userId: string;
    readonly personId: string;
    readonly displayName: string;
    readonly role: string;
    readonly unitRelationshipId?: string | Absent;
}
export interface DomainEventSubject {
    readonly entityType: string;
    readonly entityId: string;
}
export interface DomainEvent<T extends JsonObject = JsonObject> {
    readonly eventId: string;
    readonly eventType: string;
    readonly societyId: string;
    readonly unitId?: string | Absent;
    readonly actor: DomainEventActor;
    readonly subject: DomainEventSubject;
    readonly severity: 'INFO' | 'ACTION_REQUIRED' | 'WARNING' | 'CRITICAL';
    readonly createdAtIso: string;
    readonly correlationId: string;
    readonly payload: T;
}
export type DomainEventListener<T extends JsonObject = JsonObject> = (event: DomainEvent<T>) => void | Promise<void>;
type GenericListener = DomainEventListener<JsonObject>;
class DomainEventBus {
    private listeners: Map<string, Set<GenericListener>> = new Map();
    private globalListeners: Set<GenericListener> = new Set();
    private eventHistory: DomainEvent<JsonObject>[] = [];
    public subscribe<T extends JsonObject = JsonObject>(eventType: string, listener: DomainEventListener<T>): () => void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        const set = this.listeners.get(eventType)!;
        set.add(listener as GenericListener);
        return () => {
            const typeListeners = this.listeners.get(eventType);
            if (typeListeners) {
                typeListeners.delete(listener as GenericListener);
            }
        };
    }
    public subscribeAll(listener: GenericListener): () => void {
        this.globalListeners.add(listener);
        return () => {
            this.globalListeners.delete(listener);
        };
    }
    public async emit<T extends JsonObject = JsonObject>(event: DomainEvent<T>): Promise<void> {
        this.eventHistory.push(event as DomainEvent<JsonObject>);
        const typeListeners = this.listeners.get(event.eventType);
        const promises: Promise<void>[] = [];
        if (typeListeners) {
            for (const listener of typeListeners) {
                const res = listener(event as DomainEvent<T>);
                if (res instanceof Promise) {
                    promises.push(res);
                }
            }
        }
        for (const listener of this.globalListeners) {
            const res = listener(event as DomainEvent<T>);
            if (res instanceof Promise) {
                promises.push(res);
            }
        }
        if (promises.length > 0) {
            await Promise.allSettled(promises);
        }
    }
    public getHistory(): readonly DomainEvent<JsonObject>[] {
        return this.eventHistory;
    }
    public clearHistory(): void {
        this.eventHistory = [];
    }
}
export const domainEventBus = new DomainEventBus();

