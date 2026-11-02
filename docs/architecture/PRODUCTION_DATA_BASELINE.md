# Production Data Architecture Baseline

**Repository**: `SocietyOS/society-os-mobile`  
**Milestone**: Production Data Architecture & Backend Readiness  
**Date**: October 2026  

---

## 1. Executive Summary & Completion Gate Verification
Prior to beginning the Production Data Architecture milestone, the prerequisite contract hardening and runtime resilience foundation was verified against live repository evidence:
- **Repository Contracts**: All major domain repositories declare explicit, implementation-independent TypeScript interfaces (`ResidentVisitorsRepository`, `ResidentComplaintsRepository`, `ResidentFacilityRepository`, `ResidentBillingRepository`). Zero contracts are derived using `typeof *MockSource`.
- **Navigation Type Safety**: Resident routes are strongly typed with explicit param lists in `src/app/navigation/navigation.types.ts`. All resident routes audit to 100% test coverage (`npm run verify:resident-routes` passes 4/4).
- **Domain Event Bus**: Strongly typed domain event map (`SocietyDomainEventMap`) with `Promise.allSettled` subscriber isolation.
- **Deterministic Clocks & IDs**: `Clock` and `IdGenerator` services are active and leveraged across test fixtures.
- **Persistence & Hydration**: Schema-versioned persistence (`v5`) with migration pipeline and corrupted JSON quarantine active in `MockStore`.
- **Adversarial & E2E Validation**: 45/45 tests passing across resilience, adversarial isolation, and programmatic E2E journeys (E2E-01 through E2E-05).

---

## 2. Baseline Quality Commands Output

| Command | Status | Notes |
|:---|:---:|:---|
| `npm run verify:resident-routes` | **PASS** | 4/4 tests pass (100% resident capability coverage) |
| `npx jest src/core/__tests__/adversarialResilienceSuite.test.ts` | **PASS** | 9/9 tests pass (Adversarial visitor, complaint, billing, facility, SOS) |
| `npx jest src/core/__tests__/criticalE2EJourneys.test.ts` | **PASS** | 5/5 tests pass (E2E-01 to E2E-05 complete user journeys) |
| `npx jest src/core/__tests__/adversarialIsolationAndLargeData.test.ts` | **PASS** | 4/4 tests pass (Cross-household isolation, 1,000 bill cursor pagination) |
| `npx jest src/core/mockStore/__tests__/mockStoreMigrations.test.ts` | **PASS** | 4/4 tests pass (Schema migration v1->v5, corruption quarantine) |
| `npm run verify:types` | **BASELINE** | Historical `any`/`undefined` in unmigrated `staffAttendance` and `financialPhase9` |
| `npm run verify:clean-source` | **BASELINE** | Informative comments in temporal, settings, and digital twin services |
| `npm run verify:import-cycles` | **BASELINE** | 5 circular import chains in jobs, automation, and workforce types |

---

## 3. Data Architecture Audit Findings

### 3.1 Screen to Transport Data Path
Currently, resident screens obtain data through custom hooks or repositories:
- `VisitorListScreen` -> `useVisitors` -> `visitorsRepository` -> `repositoryFactory` -> (`visitorsMockSource` | `visitorsApiSource`)
- `CreateVisitorPassScreen` -> `visitorsRepository.create`
- `BillListScreen` -> `billRepository` -> (`billMockSource` | `billApiSource`)
- `ComplaintListScreen` -> `complaintRepository` -> (`complaintMockSource` | `complaintApiSource`)
- `FacilityDiscoveryView` -> `facilityRepository` -> (`facilityMockSource` | `facilityApiSource`)

### 3.2 Universal API Client & API Boundary
- `apiClient` (`src/core/api/apiClient.ts`) wraps `fetch` with base URL, timeout, headers, and request context injection (`X-Society-Id`, `X-Unit-Id`, `X-Request-Id`).
- **Debt to Resolve**:
  1. `apiClient.get<T>` and `apiClient.post<T>` currently return generic `T` directly without runtime payload validation/decoding.
  2. DTO types exist for visitors (`VisitorDto`), but require explicit runtime decoders to ensure malformed HTTP JSON never enters the domain layer as corrupted entities.
  3. API error normalization must produce structured application errors (`ApiContractError`, `NetworkTimeoutError`, `ConflictError`, `AuthenticationExpiredError`) instead of raw HTTP statuses.
  4. Repository selection must be unified and centralized without screens knowing whether mock or API mode is running.
