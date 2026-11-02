# SocietyOS Runtime Resilience Baseline

## Baseline Execution Date
2026-10-03T03:47:00+05:30

## Verification Scripts Status
- `npm run verify:resident-routes`: **PASS** (4/4 test assertions passed, all registered resident routes audited and bound to release matrix).
- `src/core/events/__tests__/DomainEventBus.test.ts`: **PASS** (5/5 tests passed).
- `src/core/id/__tests__/idGenerator.test.ts`: **PASS** (2/2 tests passed).
- `src/core/notifications/__tests__/notificationPolicyRegistry.test.ts`: **PASS** (3/3 tests passed).
- `src/core/mockStore/__tests__/mockStoreTransactions.test.ts`: **PASS** (2/2 tests passed).
- `src/core/__tests__/contractHardeningCertification.test.ts`: **PASS** (6/6 tests passed).
- `src/core/__tests__/functionalOperatingModel.test.ts`: **PASS** (9/9 scenarios passed).
- `src/modules/resident/visitors`: **PASS** (9/9 suites, 89/89 tests passed).
- `src/modules/resident/complaints`: **PASS** (3/3 suites, 4/4 tests passed).
- `src/modules/resident/billing`: **PASS** (6/6 suites, 18/18 tests passed).
- `src/modules/resident/facilityBooking`: **PASS** (6/6 suites, 68/68 tests passed).
- `src/modules/resident/dashboard`: **PASS** (49/49 suites, 99/99 tests passed).

## Existing Repository Debt & Gaps
1. **Unversioned/Non-migratable Mock Persistence:**
   - In `src/core/mockStore/mockStore.ts`, if `saved.version !== MOCK_DATA_VERSION`, the store completely deletes `MOCK_STORE_STORAGE_KEY` and silently wipes all state with `cloneInitialStoreState()`, with zero forward migration.
   - If corrupted JSON is present, it is swallowed without quarantine or structured reporting.
2. **Missing Top-Level Error Boundary:**
   - `App.tsx` has no root `AppErrorBoundary` wrapping the provider and navigation hierarchy. An unhandled render failure currently crashes the entire mobile application.
3. **No Central Fault-Injection Harness:**
   - The mock backend simulates happy paths and simple latency delays (`withMockDelay()`), but lacks a deterministic fault profile engine (offline, timeout, server errors, rate limiting, and network conflicts).
4. **App Bootstrap & Hydration Readiness Gap:**
   - `MockStoreProvider` renders child components before `hydrate()` finishes reading from storage. Screens mount with empty/default state before hydration completes.
5. **Token Storage:**
   - `tokenStore.ts` stores tokens only in memory (`let accessToken: string | null = null;`) without utilizing `expo-secure-store`.
6. **Double-Tap and Race Condition Protections:**
   - Critical commands in UI and repositories need unified debounce/idempotency guards against rapid double-tapping and simultaneous concurrent submissions.
