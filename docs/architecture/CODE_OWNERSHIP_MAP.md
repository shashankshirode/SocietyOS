# SocietyOS Code Ownership & Dependency Map

**Generated:** October 2026  
**Status:** Canonical Architecture Reference  

---

## 1. Architectural Layers & Allowed Dependency Directions

```
         ┌──────────────────────────────────────┐
         │          UI / Screens                │
         │  (Render state, capture user intent) │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │     Presenters / ViewModels / Hooks   │
         │   (useVisitors, useResidentBills,    │
         │    selectors, validation helpers)    │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │         Application / Domain         │
         │   (State machines, transition rules, │
         │    capabilities, domain events)      │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │         Repository Contract          │
         │  (Interface for data access/persist) │
         └──────────────────┬───────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │     Data Layer (MockStore / API)     │
         │   (In-memory store, persistent sync) │
         └──────────────────────────────────────┘
```

### Dependency Rules:
1. **Screens** must NEVER import data models or mock datasets directly.
2. **Domain** code must NEVER import React components or UI hooks.
3. **Repositories** must encapsulate mock storage vs remote API calls.
4. **Feature Modules** must communicate across domain boundaries via `DomainEventBus` or shared domain hooks, NEVER through direct internal file mutation.

---

## 2. Domain State Ownership Matrix

| Domain | Authoritative Store Key | Repository | Primary Query Hook | Primary Mutation Hook / Service | Cross-Module Events |
|---|---|---|---|---|---|
| **Visitors** | `mockStore.state.visitors` | `visitorsRepository` | `useVisitors`, `useVisitorDetail` | `useCreateVisitorPass`, `visitorExitPolicy` | `VISITOR_CREATED`, `VISITOR_ADMITTED`, `VISITOR_EXITED`, `VISITOR_CANCELLED` |
| **Complaints** | `mockStore.state.complaints` | `complaintsRepository` | `useComplaints`, `useComplaintDetail` | `complaintService`, `complaintLifecycle` | `COMPLAINT_CREATED`, `COMPLAINT_STATUS_CHANGED`, `COMPLAINT_FEEDBACK_SUBMITTED` |
| **Billing** | `mockStore.state.bills` | `billingRepository` | `useResidentBills` | `billingPaymentService`, `mockPaymentProcessor` | `PAYMENT_COMPLETED`, `RECEIPT_GENERATED`, `BILL_UPDATED` |
| **Facilities** | `mockStore.state.facilityBookings` | `facilityBookingRepository` | `useFacilityBookings` | `atomicSlotReservation`, `facilityBookingValidator` | `FACILITY_BOOKED`, `FACILITY_CANCELLED` |
| **Dashboard** | Derived from domain stores | Selectors (`selectDashboardSummary`) | `useResidentHomeContext` | Subscribes to domain stores | Listens to all domain events |
| **Notifications**| `mockStore.state.notifications` | `notificationsRepository` | `useResidentNotifications` | `notificationPolicyEngine` | Generated from domain events |
| **Household** | `mockStore.state.residentsNew` | `residentHouseholdRepository`| `useHouseholdOverview` | `householdMemberService` | `FAMILY_MEMBER_ADDED`, `TENANT_ONBOARDED` |
| **Documents** | `mockStore.state.documents` | `documentVaultRepository` | `useVaultDocuments` | `documentStorageService` | `DOCUMENT_UPLOADED`, `DOCUMENT_VERIFIED` |
| **Emergency** | `mockStore.state.sosEvents` | `emergencySosRepository` | `useEmergencySos` | `emergencyDispatcherService` | `SOS_TRIGGERED`, `SOS_ACKNOWLEDGED`, `SOS_RESOLVED` |

---

## 3. UI Component Canonical System

All resident user interfaces must standardize on:
- **Screens:** `SocietyScreen` (handles Safe Area, Keyboard Avoidance, Header integration, and Responsive layout).
- **Cards & Surfaces:** `SocietyCard` (handles elevation, borders, surface tokens, theme reactive).
- **Headers:** `SocietyDetailHeader` (standardized back navigation, title, subtitle, accessibility).
- **Inputs:** `SocietyInput` (error states, labels, focus highlights, keyboard accessibility).
- **Pills & Filters:** `SocietyFilterPills`, `SocietySegmentedControl`.
- **Status Indicators:** `SocietyStatusPill`.
- **Buttons:** `SocietyButton` (primary, secondary, danger, disabled, loading/spinner).
- **Action Hub:** `SocietyActionHub` (quick access actions and grid navigation).
