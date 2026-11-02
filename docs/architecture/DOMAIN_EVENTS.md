# SocietyOS Domain Event Architecture

## Overview
Domain events represent immutable business facts that occurred within SocietyOS (e.g. `visitor.pass.issued`, `billing.payment.settled`, `facility.booking.confirmed`).

Domain events are NOT UI interactions (`button.clicked`, `modal.closed`). They are emitted exclusively by business operations after mutations have successfully committed.

---

## Domain Event Bus
Located at `src/core/events/DomainEventBus.ts`.

### Canonical SocietyDomainEventMap
Defined in `src/core/events/societyDomainEvents.types.ts`:
```typescript
export interface SocietyDomainEventMap {
  'visitor.pass.issued': VisitorPassIssuedPayload;
  'visitor.at.gate': VisitorAtGatePayload;
  'visitor.admitted': VisitorAdmittedPayload;
  'visitor.exited': VisitorExitedPayload;
  'visitor.cancelled': VisitorCancelledPayload;
  'helpdesk.ticket.created': ComplaintCreatedPayload;
  'helpdesk.ticket.status.changed': ComplaintStatusChangedPayload;
  'billing.payment.settled': PaymentSettledPayload;
  'facility.booking.confirmed': FacilityBookingConfirmedPayload;
  'facility.booking.cancelled': FacilityBookingCancelledPayload;
  'emergency.sos.triggered': SosTriggeredPayload;
  'emergency.sos.acknowledged': SosAcknowledgedPayload;
  'household.member.invited': HouseholdMemberInvitedPayload;
  'household.permissions.changed': HouseholdPermissionsChangedPayload;
  'household.member.removed': HouseholdMemberRemovedPayload;
}
```

### Strongly Typed API
Subscribers and emitters are constrained at compile time by the event map:
```typescript
domainEventBus.subscribe('billing.payment.settled', (event) => {
  // event.payload is strictly PaymentSettledPayload: { amount: number, billTitle: string, receiptNumber: string }
});

await domainEventBus.emit({
  eventId: 'evt-001',
  eventType: 'visitor.pass.issued',
  societyId: 'soc-palm-grove-01',
  actor: { ... },
  subject: { entityType: 'VisitorPass', entityId: 'vis-1' },
  severity: 'INFO',
  createdAtIso: new Date().toISOString(),
  correlationId: 'corr-001',
  payload: {
    visitorName: 'Rajesh',
  },
});
```

---

## Delivery Semantics & Failure Isolation
1. **Asynchronous Notification:** Emitters await `Promise.allSettled(promises)` across all active listeners.
2. **Error Isolation:** A synchronous or asynchronous failure in one subscriber (e.g. notification dispatch) will never abort other subscribers (e.g. audit or telemetry).
3. **Post-Commit Publication:** Primary state mutation commits to store/persistence first; domain events are published post-commit.
