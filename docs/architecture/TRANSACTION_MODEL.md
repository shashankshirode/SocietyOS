# SocietyOS Transaction & Mutation Model

## Overview
SocietyOS operations follow a strict transactional boundary:
```
VALIDATE
   ↓
COMMIT STATE ATOMICALLY
   ↓
PUBLISH DOMAIN EVENTS (POST-COMMIT)
```

No database transaction framework is needed for mobile/in-memory runtime. Instead, lightweight atomic boundaries guarantee consistency and rollback on failure.

---

## Atomic Store Transactions (`mockStore.runTransaction`)
Located in `src/core/mockStore/mockStore.ts`:
```typescript
runTransaction<R>(mutator: (store: MockStore) => R): R
```
- Takes a snapshot of the current state before executing `mutator`.
- Batches updates and suppresses intermediate listener notifications and disk writes.
- If the mutator completes cleanly: persists to storage once, un-batches, and notifies listeners once.
- If the mutator throws any exception: rolls back store state to the pre-transaction snapshot, re-throws, and avoids notifying listeners of incomplete state.

---

## Idempotency and Duplicate Protection
Critical operations protect against duplicate submission at the repository layer:
- **Billing (`mockPayment`):** Validates bill status before allocating amounts. Attempting to pay an already-paid bill fails with `RESIDENT_BILL_ALREADY_PAID` without touching ledger or advance balances.
- **Facility Booking (`createFacilityBooking`):** Checks for concurrent slot reservation and rejects with `SLOT_UNAVAILABLE`.
- **Visitor Cancellation (`cancelVisitorPass`):** Rejects invalid state transitions (`INVALID_TRANSITION`) if the pass is already cancelled or outside expected lifecycle states.
