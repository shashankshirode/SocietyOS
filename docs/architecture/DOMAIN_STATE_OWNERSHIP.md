# Domain State Ownership

**Status:** Canonical Reference  
**Scope:** SocietyOS Resident & Operational Domains

This document provides explicit ownership mapping across all core domains. To ensure a single source of truth and eliminate state desynchronization, each domain is bound to an authoritative store, repository contract, query hook, mutation service, and event pipeline.

---

## 1. Domain Ownership Registry

| Domain | Authoritative Model | Authoritative Store | Repository Contract | Query Hook | Mutation API / Service | Cross-Module Events | Subscribers / Consumers |
|---|---|---|---|---|---|---|---|
| **Visitors** | `Visitor` | `mockStore.state.visitors` | `visitorsRepository` | `useVisitors`, `useVisitorDetail` | `useCreateVisitorPass`, `visitorsRepository.cancel`, `visitorExitPolicy` | `VISITOR_CREATED`, `VISITOR_CANCELLED`, `VISITOR_ADMITTED`, `VISITOR_EXITED` | VisitorListScreen, VisitorDetailScreen, Dashboard, GuardGate, Notifications, Audit |
| **Complaints** | `Complaint` | `mockStore.state.complaints` | `complaintsRepository` | `useComplaints`, `useComplaintDetail` | `complaintLifecycleService`, `useUpdateComplaintStatus` | `COMPLAINT_CREATED`, `COMPLAINT_STATUS_CHANGED`, `COMPLAINT_FEEDBACK` | ComplaintListScreen, ComplaintDetailScreen, Dashboard, SocietyAdmin, Notifications |
| **Billing** | `Bill` | `mockStore.state.bills` | `billingRepository` | `useResidentBills` | `billingPaymentService`, `mockPaymentProcessor` | `PAYMENT_COMPLETED`, `RECEIPT_GENERATED`, `BILL_UPDATED` | BillListScreen, BillDetailScreen, ReceiptDetailScreen, FlatLedgerScreen, Dashboard, Audit |
| **Facilities** | `FacilityBooking` | `mockStore.state.facilityBookings` | `facilityBookingRepository` | `useFacilityBookings`, `useFacilityDetail` | `atomicSlotReservation`, `facilityBookingValidator` | `FACILITY_BOOKED`, `FACILITY_CANCELLED`, `SLOT_HELD` | FacilityDiscoveryView, FacilityBookingsView, MyFacilityBookingsScreen, Dashboard |
| **Dashboard** | Derived Aggregation | Real-time derivation from domain stores | N/A (Aggregated Selectors) | `useResidentHomeContext`, domain hooks | N/A (Read-only aggregation) | Listens to all domain events | ResidentHomeScreen, ResidentActivityScreen, HeroSpotlight |
| **Notifications** | `ResidentNotification` | `mockStore.state.notifications` | `residentNotificationsRepository` | `useResidentNotifications` | `notificationPolicyEngine` | Reacts to all domain events | ResidentAppHeader, NotificationListScreen, Badges |
| **Household** | `ResidentMember` | `mockStore.state.residentsNew` | `residentHouseholdRepository` | `useHouseholdOverview` | `householdMemberService` | `FAMILY_MEMBER_ADDED`, `TENANT_ONBOARDED` | HouseholdOverviewScreen, FamilyMemberListScreen, TenantManagementScreen |
| **Documents** | `ResidentDocument` | `mockStore.state.documents` | `documentVaultRepository` | `useVaultDocuments` | `documentStorageService` | `DOCUMENT_UPLOADED`, `DOCUMENT_VERIFIED` | DocumentVaultHomeScreen, MyDocumentsScreen, SocietyDocumentsScreen |
| **Emergency SOS** | `EmergencyEvent` | `mockStore.state.sosEvents` | `emergencySosRepository` | `useEmergencySos` | `emergencyDispatcherService` | `SOS_TRIGGERED`, `SOS_ACKNOWLEDGED`, `SOS_RESOLVED` | EmergencySosScreen, GuardGate, BroadcastChannel, Audit |
| **Parking** | `ParkingSlotAllocation` | `mockStore.state.parkingAllocations` | `parkingVaultRepository` | `useParkingVault` | `allocationService`, `vehicleService` | `PARKING_ALLOCATED`, `VIOLATION_REPORTED` | ParkingVaultScreen, GuardVehicleLookup, Dashboard |

---

## 2. Invariant Rules for State Access

1. **Direct Array Mutation Prohibited:**
   - Under no circumstances should screens or services mutate arrays inside `mockStore.getState()` directly (e.g. `mockStore.getState().visitors.push(...)` is forbidden).
   - All mutations must flow through dedicated repository or store methods (`mockStore.addVisitor`, `mockStore.updateVisitor`) which guarantee listener notification (`notify()`) and storage synchronization (`persist()`).
2. **Deterministic Reactivity:**
   - Presentation layers must subscribe to state via React hooks (`useMockStore`, `useVisitors`, etc.).
   - Whenever an operation finishes, state changes are broadcast to all mounted components synchronously.
3. **No Screen-Local Convenience Mocking:**
   - Screens must render from the canonical query hooks. Mock arrays local to screen files are strictly forbidden.
