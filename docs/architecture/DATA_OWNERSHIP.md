# SocietyOS Data Ownership & Authority Architecture

This document establishes the single source of truth for domain data ownership, authoritative stores, persistence lifecycle, caching policies, and security scopes across SocietyOS.

---

## 1. Domain Data Ownership Map

| Domain Record | Authoritative Owner | Repository Contract | Mock Implementation | Future API Implementation | Cacheable? | Persistable? | Security Scope | Pagination Requirement | Mutation Owner |
|:---|:---|:---|:---|:---|:---:|:---:|:---|:---:|:---|
| **Visitor Pass** | Backend Gate/Visitor Service | `ResidentVisitorsRepository` | `visitorsMockSource` | `visitorsApiSource` | Yes (5 min) | Yes (local cache) | Unit + Society (`societyId:unitId`) | Cursor (`expectedDate`, `status`) | Resident (Create/Cancel) / Security Guard (Admit/Exit) |
| **Complaint / Ticket** | Backend Helpdesk Service | `ResidentComplaintsRepository` | `complaintMockSource` | `complaintApiSource` | Yes (2 min) | Yes (offline draft) | Unit + Society (`societyId:unitId`) | Cursor (`createdAt`, `status`) | Resident (File/Reopen/Feedback) / Admin/Staff (Status Update/Assign) |
| **Maintenance Bill** | Backend Billing & ERP Service | `ResidentBillingRepository` | `billMockSource` | `billApiSource` | Yes (15 min) | Yes (statement view) | Unit + Society (`societyId:unitId`) | Cursor (`dueDate`, `cycleId`) | Society Admin/Finance Engine |
| **Payment & Receipt** | Payment Gateway + Ledger Service | `ResidentBillingRepository` | `billMockSource` | `billApiSource` | No (Real-time authoritative) | Yes (receipt records) | Unit + Society (`societyId:unitId`) | Cursor (`paymentDate`) | Resident (Initiate) / Payment Gateway Webhook (Settle) |
| **Facility Amenity** | Society Facility Service | `ResidentFacilityRepository` | `facilityMockSource` | `facilityApiSource` | Yes (30 min) | Yes (catalog) | Society (`societyId`) | Page (Catalog of amenities) | Society Admin |
| **Facility Booking** | Backend Reservation Engine | `ResidentFacilityRepository` | `facilityMockSource` | `facilityApiSource` | Yes (1 min) | Yes (my bookings) | Unit + Society (`societyId:unitId`) | Cursor (`date`, `slot`) | Resident (Reserve/Cancel) / Admin (Approval) |
| **Notification Item** | Backend Notification Hub | `ResidentNotificationsRepository` | `notificationResolver` | `notificationApiSource` | Yes (1 min) | Yes (inbox) | User + Unit (`userId`) | Cursor (`createdAt`) | System Event Bus / Recipient (Mark Read) |
| **Document (Vault)** | Document Storage + Verification Service | `ResidentDocumentsRepository` | `documentMockSource` | `documentApiSource` | Yes (10 min metadata) | No (secure signed URL only) | Unit + Role (`societyId:unitId:role`) | Cursor (`category`, `uploadedDate`) | Resident (Upload) / Admin (Verify) |
| **Parking Allocation** | Parking Management Service | `ResidentParkingRepository` | `parkingMockSource` | `parkingApiSource` | Yes (1 hour) | Yes (vehicle pass) | Unit + Society (`societyId:unitId`) | Cursor (Slots/Logs) | Society Admin |
| **Household Member** | Society Identity / Household Service | `ResidentHouseholdRepository` | `householdMockSource` | `householdApiSource` | Yes (10 min) | Yes (household list) | Unit (`unitId`) | Full unit collection (< 20 members) | Primary Owner / Co-owner |
| **SOS Incident** | Emergency Dispatch Engine | `ResidentEmergencyRepository` | `emergencyRoutingService` | `emergencyApiSource` | No (Immediate real-time) | Yes (incident audit) | Society + Unit (`societyId:unitId`) | Cursor (History) | Resident Trigger / Security Guard Acknowledge |

---

## 2. Invariant Rules of Data Authority

1. **No Multiple Accidental Sources of Truth**:
   - `MockStore` is the authoritative state engine in mock mode.
   - In production API mode, the remote backend is authoritative. Local storage is strictly a read cache or pending offline mutation queue.
   - Derived representations (counters, summaries, badges) are never saved as separate persistent authorities; they are recomputed from authoritative collections.

2. **Security & Data Scope Invariant**:
   - Data scope is composite: `societyId:unitId` (or `societyId:unitId:userId` where personal).
   - Queries and cache keys MUST prefix the active residence context.
   - Resident A cannot query, mutate, cancel, or acknowledge records belonging to Unit B.

3. **Domain Model vs. Transport DTO**:
   - UI components and domain services interact exclusively with clean domain models.
   - Network payloads (`*Dto`) and transport errors (`ApiClientError`) are contained inside repository and mapper boundaries.
