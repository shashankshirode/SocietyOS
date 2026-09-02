export interface DomainEventActor {
  readonly userId: string;
  readonly personId: string;
  readonly displayName: string;
  readonly role: string;
  readonly unitRelationshipId?: string | undefined;
}

export interface DomainEventSubject {
  readonly entityType: string;
  readonly entityId: string;
}

export interface DomainEvent<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly eventId: string;
  readonly eventType: string;
  readonly societyId: string;
  readonly unitId?: string | undefined;
  readonly actor: DomainEventActor;
  readonly subject: DomainEventSubject;
  readonly severity: 'INFO' | 'ACTION_REQUIRED' | 'WARNING' | 'CRITICAL';
  readonly createdAtIso: string;
  readonly correlationId: string;
  readonly payload: T;
}

export type DomainEventListener<T extends Record<string, unknown> = Record<string, unknown>> = (
  event: DomainEvent<T>
) => void | Promise<void>;

class DomainEventBus {
  private listeners: Map<string, Set<DomainEventListener<any>>> = new Map();
  private globalListeners: Set<DomainEventListener<any>> = new Set();
  private eventHistory: DomainEvent<any>[] = [];

  public subscribe<T extends Record<string, unknown> = Record<string, unknown>>(
    eventType: string,
    listener: DomainEventListener<T>
  ): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    const set = this.listeners.get(eventType)!;
    set.add(listener);

    return () => {
      set.delete(listener);
    };
  }

  public subscribeAll(listener: DomainEventListener<any>): () => void {
    this.globalListeners.add(listener);
    return () => {
      this.globalListeners.delete(listener);
    };
  }

  public async emit<T extends Record<string, unknown> = Record<string, unknown>>(
    event: DomainEvent<T>
  ): Promise<void> {
    this.eventHistory.push(event);

    const typeListeners = this.listeners.get(event.eventType);
    const promises: Promise<void>[] = [];

    if (typeListeners) {
      for (const listener of typeListeners) {
        const res = listener(event);
        if (res instanceof Promise) {
          promises.push(res);
        }
      }
    }

    for (const listener of this.globalListeners) {
      const res = listener(event);
      if (res instanceof Promise) {
        promises.push(res);
      }
    }

    if (promises.length > 0) {
      await Promise.allSettled(promises);
    }
  }

  public getHistory(): readonly DomainEvent<any>[] {
    return this.eventHistory;
  }

  public clearHistory(): void {
    this.eventHistory = [];
  }
}

export const domainEventBus = new DomainEventBus();
