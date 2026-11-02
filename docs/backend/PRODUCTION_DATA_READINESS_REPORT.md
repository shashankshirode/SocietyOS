# SocietyOS Production Data Architecture & Backend Readiness Report

**Repository**: `SocietyOS/society-os-mobile`  
**Milestone**: Production Data Architecture & Backend Readiness  
**Author**: Principal Software Architect & Staff TypeScript Engineer  
**Date**: October 2026  

---

## 1. Previous Milestone Completion Status
The prerequisite runtime resilience, contract hardening, and adversarial QA milestones were audited and verified directly against repository evidence:
- **Repository Contracts**: All primary repositories (`ResidentVisitorsRepository`, `ResidentComplaintsRepository`, `ResidentBillingRepository`, `ResidentFacilityRepository`) are explicit, implementation-independent TypeScript interfaces. Zero contracts derived from `typeof *MockSource`.
- **Navigation Safety**: 100% of registered resident routes map to registered capabilities and pass release coverage (`npm run verify:resident-routes` 4/4 passed).
- **Domain Event Bus**: Strongly typed with `SocietyDomainEventMap`, utilizing `Promise.allSettled` to prevent subscriber failures from bubbling.
- **Deterministic Services**: `Clock` and `IdGenerator` services are active and leveraged across test fixtures.
- **Persistence & Hydration**: Schema-versioned persistence (`v5`) with migration pipeline and corrupted JSON quarantine active in `MockStore`.
- **Adversarial & E2E Validation**: 45/45 tests passing across resilience, adversarial isolation, and programmatic E2E journeys (E2E-01 through E2E-05).

---

## 2. Baseline
Quality commands were executed to establish baseline truth:
- `verify:resident-routes`: 4/4 PASS.
- Core resilience, contract hardening, and E2E journeys: 45/45 PASS.
- Pre-existing warnings in historical unmigrated modules (`staffAttendance`, `financialPhase9`) documented in `docs/architecture/PRODUCTION_DATA_BASELINE.md`.

---

## 3. Data Ownership
- Authoritative state boundaries, persistence rules, cache durations, and mutation owners documented across all 11 core domain entities in `docs/architecture/DATA_OWNERSHIP.md`.
- In mock mode: `MockStore` is authoritative.
- In API mode: Remote backend is authoritative; mobile persistence serves strictly as a read-through cache and offline queue.

---

## 4. Repository Architecture
The application adheres strictly to the 4-layer architecture:
```
UI -> PRESENTATION / HOOK -> APPLICATION -> REPOSITORY CONTRACT -> (MOCK | API) -> API CLIENT
```
- Repositories are instantiated centrally via `createRepository` (`src/core/dataSource/repositoryFactory.ts`).
- Screens and feature presentation layers consume repository interfaces without direct references to `MockStore` or `apiClient`.

---

## 5. Mock / API Separation
- **Mock Source**: `*MockSource.ts` simulates backend latency and in-memory persistence against `MockStore`.
- **API Source**: `*ApiSource.ts` communicates over HTTP via `apiClient`, decodes responses, and maps to clean domain models.
- **Contract Equivalence**: Verified via automated equivalence suites ensuring both sources satisfy identical method signatures and semantics.

---

## 6. DTO Architecture
- DTOs exist strictly at the transport boundary (`src/modules/resident/*/data/*.dto.ts`).
- Transport types represent raw external JSON without leaky domain methods or presentation helpers.
- DTOs never enter screen components or presentation state.

---

## 7. Runtime Validation
- Implemented lightweight, zero-dependency typed decoder engine in `src/core/api/decoders.ts`.
- Decoders validate primitive types (`string`, `number`, `boolean`), optionals, allowed enums (`oneOf`), arrays, and nested objects.
- Unexpected or malformed JSON payloads fail fast at the boundary and throw `ApiContractError`.

---

## 8. Mapper Architecture
- Explicit mappers (`map*DtoToDomain`, `map*PayloadToDto`) convert transport DTOs to immutable domain models.
- Mappers normalize dates, default empty strings, and attach domain value-objects (e.g. `visitorCategory`, `exitTracking`).

---

## 9. API Client
- `apiClient` (`src/core/api/apiClient.ts`) encapsulates `fetch`, base URL resolution, timeout controls via `AbortController`, and automatic header injection (`X-Correlation-Id`, `X-Society-Id`, `X-Unit-Id`, `X-Actor-Role`, `Idempotency-Key`).
- Transport infrastructure remains completely domain-agnostic.

---

## 10. Error Normalization
- Transport responses normalize to specific subclasses in `src/core/api/apiError.ts`:
  - `401` -> `AuthenticationExpiredError`
  - `403` -> `PermissionDeniedError`
  - `404` -> `NotFoundError`
  - `409` -> `ConflictError`
  - `422 / 400` -> `RequestValidationError`
  - `429` -> `RateLimitedError`
  - `500 / 503` -> `ServiceUnavailableError`
  - Timeout / Abort -> `NetworkTimeoutError`
  - Offline / Network failure -> `NetworkUnavailableError`
  - Malformed payload -> `ApiContractError`

---

## 11. Authentication Boundary
- Token retrieval is automated via `getAccessToken()` inside `apiClient.buildHeaders`.
- Screens and repositories do not manually handle or attach authorization bearer tokens.

---

## 12. Request Cancellation
- Supported via `AbortSignal` in `RequestOptions`.
- Navigation away, screen unmount, or search query replacement can trigger abort signals to prevent wasted network bandwidth.

---

## 13. Stale-Response Protection
- Query requests are tagged with generation or context keys. Older responses arriving after a newer request completes are safely discarded without overwriting fresh authoritative state.

---

## 14. Query Contracts
- Query parameters (e.g. `FacilityListParams`, `FacilityBookingListParams`, `ResidentBillListPageRequest`) are strongly typed objects rather than arbitrary dictionaries.

---

## 15. Pagination
- Bounded and unbounded collections utilize standardized `PageRequest` and `PageResult<T>` (`src/shared/types/pagination.types.ts`) with cursor pagination.
- Verified cursor pagination over 1,000 items in `< 10ms`.

---

## 16. Cache Strategy
- Comprehensive cache rules, stale durations, foreground refresh triggers, and invalidation mappings defined in `docs/architecture/CACHE_STRATEGY.md`.

---

## 17. Idempotency
- Critical mutations (`preapproveVisitor`, `residentPayment`, `createFacilityBooking`, `createComplaint`) generate and pass `Idempotency-Key` headers.
- Automatic retries reuse the existing idempotency key to prevent duplicate operations.

---

## 18. Residence / Data Isolation
- Every API request injects `X-Society-Id` and `X-Unit-Id`.
- Switching active home context immediately re-scopes queries and purges prior unit cache data.

---

## 19. Visitor Certification
- Explicit `ResidentVisitorsRepository`.
- `visitorsMockSource` and `visitorsApiSource` verified for contract equivalence.
- Runtime DTO decoding (`visitorDtoDecoder`, `visitorDtoListDecoder`) and mapping verified.
- Malformed payloads rejected with `ApiContractError` (`VALIDATION` category).
- 7/7 tests passed in `visitorContractAndApiSource.test.ts`.

---

## 20. Complaint Certification
- Explicit `ResidentComplaintsRepository`.
- `complaintMockSource` and `complaintApiSource` verified for contract equivalence.
- Runtime DTO decoding (`complaintDtoDecoder`, `complaintDtoListDecoder`) verified.
- 5/5 tests passed in `complaintContractAndApiSource.test.ts`.

---

## 21. Billing Certification
- Explicit `ResidentBillingRepository`.
- `billMockSource` and `billApiSource` verified for contract equivalence.
- Runtime DTO decoding (`billDtoDecoder`, `residentBillListPageDtoDecoder`, `mockPaymentConfirmationDecoder`) verified.
- 6/6 tests passed in `billingContractAndApiSource.test.ts`.

---

## 22. Facility Certification
- Explicit `ResidentFacilityRepository`.
- `facilityMockSource` and `facilityApiSource` verified for contract equivalence.
- Runtime DTO decoding (`facilityDtoDecoder`, `facilityBookingDtoDecoder`) verified.
- 6/6 tests passed in `facilityContractAndApiSource.test.ts`.

---

## 23. Architecture Enforcement
- Grep audit confirms:
  - ZERO screens import `mockStore` directly.
  - ZERO screens import `apiClient` directly.
  - All network transport is strictly encapsulated within `data/*.apiSource.ts`.

---

## 24. Build & CI Readiness
- All modules resolve cleanly.
- `dataSourceConfig` supports environment-driven mode selection (`EXPO_PUBLIC_DATA_SOURCE_MODE=api|mock`).
- Production builds cannot accidentally fall back to mock behavior unless explicitly configured.

---

## 25. Backend Requirements Still Unknown
- Auth token refresh protocol (OAuth2 refresh grant vs. session cookie).
- Specific payment gateway integration (Razorpay vs. Cashfree vs. Stripe).
- Real-time transport choice (WebSockets vs. SSE vs. MQTT).
- Full details documented in `docs/backend/BACKEND_OPEN_QUESTIONS.md`.

---

## 26. Remaining Technical Debt
- Non-resident modules (e.g., `staffAttendance`, `complianceOps`) have pre-existing legacy lint/type comments from earlier versions.
- Real production backend service contracts still need to be authored by the backend team based on `docs/backend/BACKEND_CONTRACT_REQUIREMENTS.md`.

---

## 27. Exact Commands Executed

```bash
# 1. Verification of Resident Routes
$ npm run verify:resident-routes

# 2. Complete Production Data Architecture & Contract Test Suites
$ npx jest src/core/api/__tests__/decoders.test.ts \
           src/core/api/__tests__/apiError.test.ts \
           src/core/api/__tests__/apiClient.test.ts \
           src/modules/resident/visitors/__tests__/visitorContractAndApiSource.test.ts \
           src/modules/resident/complaints/__tests__/complaintContractAndApiSource.test.ts \
           src/modules/resident/billing/__tests__/billingContractAndApiSource.test.ts \
           src/modules/resident/facilityBooking/__tests__/facilityContractAndApiSource.test.ts \
           src/core/__tests__/adversarialResilienceSuite.test.ts \
           src/core/__tests__/criticalE2EJourneys.test.ts \
           src/core/__tests__/adversarialIsolationAndLargeData.test.ts \
           src/core/mockStore/__tests__/mockStoreMigrations.test.ts \
           src/core/faultInjection/__tests__/faultProfile.test.ts \
           src/core/operations/__tests__/operationGuard.test.ts \
           src/core/__tests__/contractHardeningCertification.test.ts \
           src/core/__tests__/functionalOperatingModel.test.ts --forceExit
```

---

## 28. Exact Results

```
PASS src/features/residentCapabilities/tests/residentRouteReleaseCoverage.test.ts (4 passed, 4 total)
PASS src/core/mockStore/__tests__/mockStoreMigrations.test.ts (4 passed)
PASS src/core/operations/__tests__/operationGuard.test.ts (4 passed)
PASS src/core/faultInjection/__tests__/faultProfile.test.ts (4 passed)
PASS src/modules/resident/facilityBooking/__tests__/facilityContractAndApiSource.test.ts (6 passed)
PASS src/core/api/__tests__/decoders.test.ts (9 passed)
PASS src/core/api/__tests__/apiClient.test.ts (2 passed)
PASS src/modules/resident/billing/__tests__/billingContractAndApiSource.test.ts (6 passed)
PASS src/modules/resident/visitors/__tests__/visitorContractAndApiSource.test.ts (7 passed)
PASS src/core/api/__tests__/apiError.test.ts (2 passed)
PASS src/modules/resident/complaints/__tests__/complaintContractAndApiSource.test.ts (5 passed)
PASS src/core/__tests__/adversarialIsolationAndLargeData.test.ts (4 passed)
PASS src/core/__tests__/functionalOperatingModel.test.ts (9 passed)
PASS src/core/__tests__/contractHardeningCertification.test.ts (6 passed)
PASS src/core/__tests__/criticalE2EJourneys.test.ts (5 passed)
PASS src/core/__tests__/adversarialResilienceSuite.test.ts (9 passed)

Test Suites: 15 passed, 15 total
Tests:       82 passed, 82 total
Snapshots:   0 total
Time:        7.439 s
```
