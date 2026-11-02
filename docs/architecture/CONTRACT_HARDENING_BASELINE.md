# SocietyOS Contract Hardening Baseline

**Generated:** October 2026  
**Auditor:** Principal Software Architect, Staff TypeScript/React Native Engineer  
**Milestone:** SocietyOS Contract Hardening & Deterministic Runtime  

---

## 1. Executive Summary

This milestone establishes rigorous, implementation-independent contracts across all layers of SocietyOS:
- Decoupling repository interfaces from mock source implementations.
- Constraining `DomainEventBus` to a strongly typed event-payload map.
- Modularizing `NotificationResolver` with dedicated policy strategies, recipient resolution, and localization key mapping.
- Introducing canonical `Clock` and `IdGenerator` boundaries for fully deterministic runtime and test behavior.
- Eliminating remaining `as never` casts across navigation and presentation boundaries.

---

## 2. Baseline Architecture Audit & Discovered Debt

### 2.1 Repository Contract Inversion (`typeof mockSource`)
In [residentRepositories.types.ts](file:///Users/shashankshirode/Projects/SocietyOS/society-os-mobile/src/modules/resident/data/residentRepositories.types.ts):
```ts
export type VisitorRepository = typeof visitorsMockSource;
export type BillingRepository = typeof billMockSource;
export type ComplaintRepository = typeof complaintMockSource;
export type FacilityRepository = typeof facilityMockSource;
export type NotificationRepository = typeof residentNotificationsMockSource;
```
**Problem:** The mock implementation defines the application contract rather than the domain defining the contract and the mock satisfying it.
**Solution:** Explicit repository interfaces (`ResidentVisitorsRepository`, `ResidentComplaintsRepository`, `ResidentBillingRepository`, `ResidentFacilityRepository`, `ResidentNotificationsRepository`) declared independently from infrastructure sources.

### 2.2 Untyped Domain Event Payloads
In [DomainEventBus.ts](file:///Users/shashankshirode/Projects/SocietyOS/society-os-mobile/src/core/events/DomainEventBus.ts):
```ts
public subscribe<T extends JsonObject = JsonObject>(eventType: string, listener: DomainEventListener<T>): () => void
public async emit<T extends JsonObject = JsonObject>(event: DomainEvent<T>): Promise<void>
```
**Problem:** `eventType: string` allows emitting arbitrary strings with untyped JSON payloads. Subscribers cannot rely on compiler guarantees for event payloads.
**Solution:** Introduce `SocietyDomainEventMap` and bind `emit<K extends keyof SocietyDomainEventMap>` and `subscribe<K extends keyof SocietyDomainEventMap>`.

### 2.3 Monolithic Notification Resolver & String Heuristics
In [NotificationResolver.ts](file:///Users/shashankshirode/Projects/SocietyOS/society-os-mobile/src/core/notifications/NotificationResolver.ts):
- A monolithic `switch (eventType)` with hardcoded string cases (`'facility.booking.confirmed'`, `'visitor.pass.issued'`, etc.).
- Embedded raw English strings (`"Visitor Pass Created"`, `"Booking Confirmed"`).
- Direct iteration over `MOCK_PERSONAS` with unit-matching string heuristics (`p.includes('b804') || p.includes('1204')`).
- Uncontrolled `Date.now()` timestamps and random IDs (`notif-${Date.now()}-${persona.user.id}`).
**Solution:** Decompose into a `NotificationPolicyRegistry` with feature policies (`VisitorNotificationPolicy`, `ComplaintNotificationPolicy`, etc.), typed `NotificationRecipientResolver`, and localization keys.

### 2.4 Nondeterministic Runtime (Time & Random IDs)
- Widespread usage of `Date.now()`, `new Date().toISOString()`, and `Math.random()`.
- Existing `Clock` in `src/core/temporal/temporal.types.ts` is only partially consumed by business repositories.
**Solution:** Centralize `Clock` (`systemClock` / `createFixedClock`) and `IdGenerator` (`systemIdGenerator` / `sequentialIdGenerator`).

---

## 3. Incremental Migration Plan

1. **Phase 1: Explicit VisitorRepository Contract:**
   - Define `ResidentVisitorsRepository` interface in `src/modules/resident/visitors/data/residentVisitors.repository.types.ts`.
   - Update `visitorsMockSource` to implement `ResidentVisitorsRepository`.
   - Update `residentRepositories.types.ts`.
2. **Phase 2: Strongly Typed DomainEventMap & Bus:**
   - Define `SocietyDomainEventMap` binding all core events (`visitor.pass.issued`, `visitor.admitted`, `visitor.exited`, `visitor.cancelled`, `helpdesk.ticket.created`, `helpdesk.ticket.status.changed`, `billing.payment.settled`, `facility.booking.confirmed`, `facility.booking.cancelled`, `emergency.sos.triggered`).
   - Harden `DomainEventBus` methods to be strictly generic over event keys.
3. **Phase 3: Deterministic Clock & ID Abstractions:**
   - Wire `Clock` and `IdGenerator` into repository mock sources and event factories.
4. **Phase 4: Modular Notification Policies:**
   - Extract feature policies (`VisitorNotificationPolicy`, `ComplaintNotificationPolicy`, etc.) from `NotificationResolver`.
5. **Phase 5: Complaint, Billing, and Facility Contracts:**
   - Define explicit contracts for Complaints, Billing, and Facilities.
6. **Phase 6: Quality & Regression Gate:**
   - Run typecheck, tests, and route release coverage.
