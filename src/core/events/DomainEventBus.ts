import type { JsonObject } from '../api/api.types';
import type { Absent } from '../../shared/types/absence.types';
import type { SocietyDomainEventMap } from './societyDomainEvents.types';

export type { SocietyDomainEventMap, SocietyDomainEventType } from './societyDomainEvents.types';

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

export interface DomainEvent<
    TPayload extends JsonObject = JsonObject,
    TType extends string = string
> {
    readonly eventId: string;
    readonly eventType: TType;
    readonly societyId: string;
    readonly unitId?: string | Absent;
    readonly actor: DomainEventActor;
    readonly subject: DomainEventSubject;
    readonly severity: 'INFO' | 'ACTION_REQUIRED' | 'WARNING' | 'CRITICAL';
    readonly createdAtIso: string;
    readonly correlationId: string;
    readonly payload: TPayload;
}

export type SocietyDomainEvent<K extends keyof SocietyDomainEventMap = keyof SocietyDomainEventMap> =
    DomainEvent<SocietyDomainEventMap[K], K>;

export type DomainEventListener<TPayload extends JsonObject = JsonObject, TType extends string = string> = (
    event: DomainEvent<TPayload, TType>
) => void | Promise<void>;

type GenericListener = DomainEventListener<JsonObject, string>;

class DomainEventBus {
    private listeners: Map<string, Set<GenericListener>> = new Map();
    private globalListeners: Set<GenericListener> = new Set();
    private eventHistory: DomainEvent<JsonObject>[] = [];

    public subscribe<K extends keyof SocietyDomainEventMap>(
        eventType: K,
        listener: (event: SocietyDomainEvent<K>) => void | Promise<void>
    ): () => void;
    public subscribe<TPayload extends JsonObject = JsonObject>(
        eventType: string,
        listener: DomainEventListener<TPayload, string>
    ): () => void;
    public subscribe(
        eventType: string,
        listener: GenericListener
    ): () => void {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        const set = this.listeners.get(eventType)!;
        set.add(listener);
        return () => {
            const typeListeners = this.listeners.get(eventType);
            if (typeListeners) {
                typeListeners.delete(listener);
            }
        };
    }

    public subscribeAll(listener: GenericListener): () => void {
        this.globalListeners.add(listener);
        return () => {
            this.globalListeners.delete(listener);
        };
    }

    public async emit<K extends keyof SocietyDomainEventMap>(
        event: SocietyDomainEvent<K>
    ): Promise<void>;
    public async emit<TPayload extends JsonObject = JsonObject>(
        event: DomainEvent<TPayload, string>
    ): Promise<void>;
    public async emit(event: DomainEvent<JsonObject, string>): Promise<void> {
        this.eventHistory.push(event);
        const typeListeners = this.listeners.get(event.eventType);
        const promises: Promise<void>[] = [];

        const executeListener = (listener: GenericListener): Promise<void> => {
            try {
                const res = listener(event);
                if (res instanceof Promise) {
                    return res;
                }
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err);
            }
        };

        if (typeListeners) {
            typeListeners.forEach((listener) => {
                promises.push(executeListener(listener));
            });
        }
        this.globalListeners.forEach((listener) => {
            promises.push(executeListener(listener));
        });
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

