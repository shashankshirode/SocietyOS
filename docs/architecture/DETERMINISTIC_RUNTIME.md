# SocietyOS Deterministic Runtime & Testing Architecture

## Overview
Business rules, domain events, and testing suites require reproducible timestamps and sequential IDs. Random values (`Math.random()`, `Date.now()`) lead to flaky tests and untraceable events.

---

## 1. Temporal Clock Abstraction
Located in `src/core/temporal/`:
- `Clock` interface:
  ```typescript
  export interface Clock {
    readonly now: () => UtcInstant;
    readonly nowUtc: () => Date;
    readonly nowIso: () => string;
  }
  ```
- **Production Runtime (`systemClock`):** Returns the current system instant.
- **Testing Runtime (`createFixedClock`):** Returns a fixed, frozen instant for deterministic assertions:
  ```typescript
  const fixedClock = createFixedClock('2026-10-02T10:00:00.000Z');
  ```

---

## 2. Deterministic ID Generation
Located in `src/core/id/idGenerator.ts`:
- `IdGenerator` interface:
  - `nextId(prefix?: string): string`
  - `nextVisitorId(): string`
  - `nextComplaintId(): string`
  - `nextBookingId(): string`
  - `nextPaymentId(): string`
  - `nextEventId(typePrefix?: string): string`
  - `nextNotificationId(): string`
  - `nextActivityId(): string`
- **Production Runtime (`systemIdGenerator`):** Generates unique prefixed IDs.
- **Testing Runtime (`createSequentialIdGenerator`):** Generates reproducible sequential IDs (`vis-0001`, `vis-0002`, `notif-0003`, etc.) with `reset()`.
- Global hooks: `getIdGenerator()`, `setIdGenerator(gen)`, `resetIdGenerator()`.
