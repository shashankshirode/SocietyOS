# SocietyOS Runtime Invariants

## Core Principles
1. **FAILURE IS A NORMAL RUNTIME STATE:** Operations must handle offline, network interruption, timeout, and validation failures without corrupting state or crashing.
2. **NO FALSE SUCCESS:** A failed payment is never marked paid; an undelivered SOS is never confirmed; a rejected visitor pass is never admitted.
3. **PERSISTENCE MUST BE AUTHORITATIVE:** Only canonical domain entities are persisted; derived view models are computed.
4. **ONE COMMAND = ONE LOGICAL RESULT:** Double submission or rapid double-tapping must produce an idempotent result, not duplicate entries or events.

---

## Domain Invariants

### 1. Visitors
- **Cancelled Visitor:** Cannot be admitted at the security gate (`CANCELLED`).
- **Expired Pass:** Cannot be admitted at the security gate (`EXPIRED`).
- **Completed Visitor:** Cannot be checked out a second time.
- **Exit Precondition:** Exiting a visitor requires prior entry (`CHECKED_IN`).
- **Idempotency:** One pass creation cannot produce duplicate records or duplicate QR codes.
- **Cross-Unit Isolation:** Resident of Unit A cannot view, query, or cancel visitors belonging to Unit B.
- **Resident-Guard Sync:** Admitting a visitor at the gate must update the resident's active state to `CHECKED_IN`.

### 2. Complaints
- **Illegal Transitions:** Cannot reopen a complaint that was never resolved; cannot resolve a non-existent complaint.
- **History Preservation:** Updates and notes append to timeline and must never erase previous history.
- **Isolation:** A resident cannot mutate or resolve complaints belonging to another unit or society.

### 3. Billing & Payments
- **Duplicate Payment:** Paying an already-paid bill (`status === 'PAID'`) is strictly rejected with `RESIDENT_BILL_ALREADY_PAID`.
- **Atomic Balance & Ledger:** Bill update, ledger entry, and receipt creation occur atomically inside `mockStore.runTransaction`. If any step fails, all mutations roll back.
- **No False Success:** A failed payment leaves the bill in `DUE` or `OVERDUE` state and records no successful receipt.

### 4. Facilities
- **Slot Exclusivity:** Two active bookings for the same exclusive facility slot cannot coexist. Simultaneous or duplicate booking requests must fail with `SLOT_UNAVAILABLE`.
- **Cancellation Restores Slot:** Cancelling an active booking releases the reservation and allows other residents to book the slot.
- **Ownership:** A resident cannot cancel another household's booking.

### 5. Emergency SOS
- **Delivery Truthfulness:** If dispatch fails (network/timeout), the application must display a clear failure/retry state and never display confirmed dispatch.
- **Mandatory Society Dispatch:** SOS always alerts Main Gate security and designated emergency responders regardless of whether personal household contacts are configured.
