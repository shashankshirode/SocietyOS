# SocietyOS Repository Contracts Architecture

## Overview
Prior to contract hardening, domain repositories suffered from an inverted dependency direction where application contracts were defined by the mock sources (`export type VisitorRepository = typeof visitorsMockSource;`).

Under the hardened architecture:
```
APPLICATION / DOMAIN
        ↓
REPOSITORY CONTRACT
        ↓
IMPLEMENTATION
   ┌────┴────┐
   ↓         ↓
 Mock       API
```

The repository contract exists independently from any implementation. Screens and presentation layers depend strictly on the contract interfaces.

---

## Canonical Resident Repository Contracts

### 1. Central Repository Registry
Located at `src/modules/resident/data/residentRepositories.types.ts`:
```typescript
export type VisitorRepository = ResidentVisitorsRepository;
export type BillingRepository = ResidentBillingRepository;
export type ComplaintRepository = ResidentComplaintsRepository;
export type FacilityRepository = ResidentFacilityRepository;
export type NotificationRepository = ResidentNotificationsRepository;

export interface ResidentRepositories {
  readonly auth: AuthenticationRepository;
  readonly membership: MembershipRepository;
  readonly residence: ResidenceRepository;
  readonly dashboard: DashboardRepository;
  readonly household: HouseholdRepository;
  readonly family: FamilyRepository;
  readonly tenant: TenantRepository;
  readonly rental: RentalRepository;
  readonly visitor: VisitorRepository;
  readonly billing: BillingRepository;
  readonly complaints: ComplaintRepository;
  readonly notice: NoticeRepository;
  readonly governance: GovernanceRepository;
  readonly document: DocumentRepository;
  readonly certificate: CertificateRepository;
  readonly parking: ParkingRepository;
  readonly facility: FacilityRepository;
  readonly chat: ChatRepository;
  readonly staff: StaffRepository;
  readonly emergency: EmergencyRepository;
  readonly notification: NotificationRepository;
  readonly community: CommunityRepository;
}
```

### 2. Visitors Contract (`ResidentVisitorsRepository`)
Located at `src/modules/resident/visitors/data/residentVisitors.repository.types.ts`:
- `list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Visitor[]>>`
- `detail(context: ResidentRepositoryRequestContext | string, visitorId?: string): Promise<RepositoryResult<Visitor | Absent>>`
- `create(context: ResidentRepositoryRequestContext | CreateVisitorPayload, payload?: CreateVisitorPayload): Promise<RepositoryResult<Visitor>>`
- `updateStatus(context: ResidentRepositoryRequestContext | string, idOrStatus?: string, status?: VisitorStatus): Promise<RepositoryResult<Visitor>>`
- `cancelVisitorPass(context: ResidentRepositoryRequestContext | CancelVisitorPassRequest, request?: CancelVisitorPassRequest): Promise<RepositoryResult<CancelVisitorPassResult>>`
- Exit assurance operations: `getVisitorExitAlerts`, `confirmVisitorLeft`, `confirmVisitorStillInside`, `extendVisitorExpectedExit`, `contactSecurityForVisitorExit`, `validateCredential`.

### 3. Complaints Contract (`ResidentComplaintsRepository`)
Located at `src/modules/resident/complaints/data/residentComplaints.repository.types.ts`:
- `list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Complaint[]>>`
- `detail(context: ResidentRepositoryRequestContext | string, complaintId?: string): Promise<RepositoryResult<Complaint | Absent>>`
- `create(context: ResidentRepositoryRequestContext | CreateComplaintPayload, payload?: CreateComplaintPayload): Promise<RepositoryResult<Complaint>>`
- `updateStatus(id: string, status: ComplaintStatus, note?: string): Promise<RepositoryResult<Complaint>>`

### 4. Billing Contract (`ResidentBillingRepository`)
Located at `src/modules/resident/billing/data/residentBilling.repository.types.ts`:
- `getBillSummary(context: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentBillingSummary>>`
- `getBillsPage(context: ResidentRepositoryRequestContext, request: ResidentBillListPageRequest): Promise<RepositoryResult<ResidentBillListPage>>`
- `getBillDetail(context: ResidentRepositoryRequestContext, billId: string): Promise<RepositoryResult<ResidentBillDetail | Absent>>`
- `getLedgerEntriesPage(context: ResidentRepositoryRequestContext, request: ResidentLedgerPageRequest): Promise<RepositoryResult<ResidentLedgerPage>>`
- `mockPayment(context: ResidentRepositoryRequestContext, input: ResidentMockPaymentInput): Promise<RepositoryResult<MockPaymentConfirmation>>`

### 5. Facility Contract (`ResidentFacilityRepository`)
Located at `src/modules/resident/facilityBooking/data/residentFacility.repository.types.ts`:
- `getFacilities(params?: FacilityListParams): Promise<RepositoryResult<Facility[]>>`
- `getFacilityDetail(facilityId: string): Promise<RepositoryResult<Facility | Absent>>`
- `getAvailableSlots(facilityId: string, date: string): Promise<RepositoryResult<FacilitySlot[]>>`
- `createFacilityBooking(input: CreateFacilityBookingInput): Promise<RepositoryResult<FacilityBooking>>`
- `getMyBookings(params?: FacilityBookingListParams): Promise<RepositoryResult<FacilityBooking[]>>`
- `getBookingDetail(bookingId: string): Promise<RepositoryResult<FacilityBooking | Absent>>`
- `cancelBooking(bookingId: string, input: CancelFacilityBookingInput): Promise<RepositoryResult<FacilityBooking | Absent>>`
- `checkIn(bookingId: string): Promise<RepositoryResult<FacilityCheckInPass>>`
- `getDepositRefunds(unitId: string): Promise<RepositoryResult<FacilityDepositRefund[]>>`

---

## Result and Error Contracts
All repository operations return strongly typed `RepositoryResult<T>`:
```typescript
type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: RepositoryError };
```
Expected failures (e.g. `SLOT_UNAVAILABLE`, `RESIDENT_BILL_ALREADY_PAID`, `VISITOR_NOT_FOUND`, `INVALID_TRANSITION`) return typed failures instead of throwing generic JavaScript `Error` objects.
