# SocietyOS Backend Contract Requirements Specification

This document defines the functional and non-functional requirements that any real production backend service must satisfy to integrate with SocietyOS mobile clients.

---

## 1. Global Transport & Infrastructure Requirements

### 1.1 Context Headers
Every HTTP request issued by the mobile client sends authoritative context headers that the backend API gateway must inspect and validate:
- `X-Society-Id`: UUID of the currently active society (e.g. `soc-palm-grove-01`).
- `X-Unit-Id`: UUID of the active resident household unit (e.g. `unit-b804`).
- `X-Actor-Role`: Authenticated role in active residence context (`RESIDENT_OWNER`, `RESIDENT_TENANT`, `RESIDENT_FAMILY`).
- `X-Correlation-Id`: End-to-end request tracing identifier.
- `Idempotency-Key`: UUID passed on state-mutating requests (`POST`, `PUT`, `PATCH`).

### 1.2 Response Envelope
All endpoints must return standard JSON response envelopes:
```json
{
  "success": true,
  "data": { ... },
  "traceId": "trace-uuid-1234"
}
```
Or in case of failure:
```json
{
  "success": false,
  "error": {
    "code": "SPECIFIC_ERROR_CODE",
    "message": "Human-readable English description",
    "fieldErrors": [
      { "field": "phone", "message": "Invalid mobile number format" }
    ]
  },
  "traceId": "trace-uuid-1234"
}
```

### 1.3 HTTP Error Normalization
- `400 / 422`: Domain validation errors. Must return `fieldErrors` array for form field binding.
- `401`: Token expired or invalid signature. Client will trigger session re-authentication.
- `403`: Insufficient permission for active residence role.
- `404`: Entity not found or not in caller's active residence scope.
- `409`: State conflict (e.g. slot already booked, bill already paid, pass already cancelled).
- `429`: Rate limited. Must include `Retry-After` header in seconds.
- `500 / 503`: Ephemeral server error. Client considers these retryable.

---

## 2. Feature Domain Contract Requirements

### 2.1 Visitors & Gate Access
- **Endpoint Capabilities**:
  - `GET /api/v1/visitors`: List visitor passes for the active unit. Cursor-paginated by `expectedDate`.
  - `GET /api/v1/visitors/:id`: Retrieve single visitor pass detail with entry/exit tracking status.
  - `POST /api/v1/visitors/preapprove`: Pre-approve visitor pass. Requires `Idempotency-Key`.
  - `POST /api/v1/visitors/:id/cancel`: Cancel visitor pass before entry.
  - `POST /api/v1/visitors/:id/confirm-left`: Resident confirms visitor has departed.
- **Invariants**:
  - Cancelled passes cannot be validated at gate (`PASS_CANCELLED`).
  - Completed passes cannot be exited again (`ALREADY_COMPLETED`).
  - Gate validation records gate event and emits `visitor.at.gate` domain event.

### 2.2 Complaints & Helpdesk
- **Endpoint Capabilities**:
  - `GET /api/v1/complaints`: Scoped by `societyId` and `unitId`. Filterable by status (`OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`).
  - `GET /api/v1/complaints/:id`: Detail view with full chronological transition history (`updates`).
  - `POST /api/v1/complaints`: Create new ticket.
  - `POST /api/v1/complaints/:id/status`: Transition status. Transition preserves history without overwriting prior records.

### 2.3 Billing & Payments
- **Endpoint Capabilities**:
  - `GET /api/v1/billing/resident/summary`: Total outstanding balance, advance balance, overdue count.
  - `GET /api/v1/billing/resident/bills`: Paginated list of bills. Supports filtering by `unpaid`, `paid`, `overdue`.
  - `GET /api/v1/billing/resident/bills/:id`: Detailed itemized breakdown of charges.
  - `POST /api/v1/billing/resident/payments`: Process payment with gateway transaction token. Requires `Idempotency-Key`.
- **Invariants**:
  - Double payment on an already-settled bill must be rejected with `RESIDENT_BILL_ALREADY_PAID`.
  - Paid bills must retain immutable `receiptNumber` and ledger transaction ID.

### 2.4 Facilities & Amenity Reservations
- **Endpoint Capabilities**:
  - `GET /api/v1/facilities`: List available amenities in society.
  - `GET /api/v1/facilities/:id/availability`: Real-time slot availability for specified date.
  - `POST /api/v1/facilities/bookings`: Reserve exclusive slot. Atomic transaction.
  - `POST /api/v1/facilities/bookings/:id/cancel`: Release reservation and restore slot availability.
- **Invariants**:
  - Conflicting exclusive bookings for the same amenity and time slot must return `409 Conflict`.
  - Cancelled booking immediately unlocks the slot for subsequent reservations.

### 2.5 Emergency SOS
- **Endpoint Capabilities**:
  - `POST /api/v1/emergency/sos`: Dispatch emergency alert.
  - `POST /api/v1/emergency/sos/:id/acknowledge`: Guard acknowledges response.
- **Invariants**:
  - SOS dispatch must reliably resolve mandatory society groups (`Main Gate Security`, `Society Emergency Primary`) even when household contacts list is empty.
  - Unconfirmed dispatch must never return `success: true`.
