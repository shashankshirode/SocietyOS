/**
 * Central IdGenerator for deterministic runtime and testing.
 * 
 * Provides consistent ID generation for business entities, domain events,
 * activities, and notifications.
 */

export interface IdGenerator {
  nextId(prefix?: string): string;
  nextVisitorId(): string;
  nextComplaintId(): string;
  nextBookingId(): string;
  nextPaymentId(): string;
  nextEventId(typePrefix?: string): string;
  nextNotificationId(): string;
  nextActivityId(): string;
}

/** Default system ID generator for runtime execution */
export const systemIdGenerator: IdGenerator = {
  nextId(prefix = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
  nextVisitorId(): string {
    return `vis-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  },
  nextComplaintId(): string {
    return `comp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  },
  nextBookingId(): string {
    return `fb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  },
  nextPaymentId(): string {
    return `pay-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  },
  nextEventId(typePrefix = 'evt'): string {
    return `${typePrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  },
  nextNotificationId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
  nextActivityId(): string {
    return `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  },
};

export interface SequentialIdGenerator extends IdGenerator {
  reset(): void;
  getCounter(): number;
}

/** Sequential deterministic ID generator for tests */
export function createSequentialIdGenerator(seed = 1): SequentialIdGenerator {
  let counter = seed;
  const pad = (num: number) => num.toString().padStart(4, '0');

  return {
    nextId(prefix = 'id'): string {
      return `${prefix}-${pad(counter++)}`;
    },
    nextVisitorId(): string {
      return `vis-${pad(counter++)}`;
    },
    nextComplaintId(): string {
      return `comp-${pad(counter++)}`;
    },
    nextBookingId(): string {
      return `fb-${pad(counter++)}`;
    },
    nextPaymentId(): string {
      return `pay-${pad(counter++)}`;
    },
    nextEventId(typePrefix = 'evt'): string {
      return `${typePrefix}-${pad(counter++)}`;
    },
    nextNotificationId(): string {
      return `notif-${pad(counter++)}`;
    },
    nextActivityId(): string {
      return `act-${pad(counter++)}`;
    },
    reset(): void {
      counter = seed;
    },
    getCounter(): number {
      return counter;
    },
  };
}

let activeGenerator: IdGenerator = systemIdGenerator;

export function getIdGenerator(): IdGenerator {
  return activeGenerator;
}

export function setIdGenerator(generator: IdGenerator): void {
  activeGenerator = generator;
}

export function resetIdGenerator(): void {
  activeGenerator = systemIdGenerator;
}
