# SocietyOS — Codex Engineering & Security Remediation Report

**Date:** 21 November 2026  
**Audience:** Codex / Engineering Team / Security Reviewers  
**Branch:** `fix/security-architecture-hardening`  
**Base Commit / Review SHA:** `8dcdc42efc21e7f4edd17aba0f09770209a9c310`  
**Milestone Completed:** Phase 0 (Baseline & Reproducible Build), Phase 1A (Lock Down Demo Authentication) & Phase 1B (Fix Payments & Financial Truthfulness)

---

## 1. Scope & Repository Baseline

- **Repository:** `shashankshirode/SocietyOS` (society-os-mobile)
- **Observed Stack:** Expo SDK 58.0.23, React Native 0.88.1, React 19.3.0, TypeScript 6.0.3, Jest 30.5.2, React Navigation 7.x
- **Target OS / Environment:** macOS Darwin, Node `v24.12.0`, npm `11.6.2` (CI Node 22 on `ubuntu-24.04`)
- **Review Snapshot:** Evaluated against `SOCIETYOS_CODEX_REMEDIATION_PLAN.md` instructions starting at Phase 0 and Phase 1A.

---

## 2. Confirmed Issues & Findings

| ID | Finding | Severity | File & Location | Root Cause | Impact | Status |
|---|---|---|---|---|---|---|
| **ENG-01** | Undeclared `absentValue` in `usePermission.ts` | P0 / Blocker | `src/core/permissions/usePermission.ts:18` | Prior refactor removed fabricated resident mock return but failed to import `absentValue` | Crashed any caller invoking `useCurrentSecurityUser` while unauthenticated | **FIXED + VERIFIED** |
| **ENG-02** | Type mismatch in `securityReviewFixes.test.ts` | P0 | `src/core/security/__tests__/securityReviewFixes.test.ts:35,76` | `ActiveContext` lacked `person`; `PaymentMethod` used `'CASH'` instead of `'CASH_CHEQUE'` | Typecheck failures across security test suite | **FIXED + VERIFIED** |
| **ENG-03** | Incompatible `RequestContext` property types with `exactOptionalPropertyTypes` | P0 | `src/core/api/apiClient.ts:39` | Assigning `{ societyId: session.societyId }` when `session.societyId` is undefined violates `exactOptionalPropertyTypes` | TypeScript compiler error in core API transport | **FIXED + VERIFIED** |
| **ENG-04** | GitHub Actions runner drift vulnerability | P1 | `.github/workflows/mobile-quality.yml:11` | Used floating `ubuntu-latest` runner; missing pinned Node/Ubuntu baseline | Susceptible to unexpected upstream toolchain drift | **FIXED + VERIFIED** |
| **SEC-01** | Production API mode falls back to mock mode | P0 / Security | `src/core/dataSource/dataSource.config.ts:12` | Unset or invalid `EXPO_PUBLIC_DATA_SOURCE_MODE` resolved to `DEFAULT_DATA_SOURCE_MODE` (`'mock'`) even in production | Release builds could silently operate against mock storage | **FIXED + VERIFIED** |
| **SEC-02** | Hardcoded OTP (`123456`) reachable in all builds | P0 / Security | `src/core/auth/AuthProvider.tsx:83,94` | `requestOtp` hardcoded `demoOtp: '123456'`; `loginWithPhone` unconditionally accepted `'123456'` without environment gate | Anyone could authenticate as demo personas or bypass server verification | **FIXED + VERIFIED** |
| **SEC-03** | Unguarded mock session starters | P0 / Security | `src/core/auth/useAuthSession.ts:20-38` | `startMockSessionForPersona`, `startMockSessionForRoute`, `startMockSessionForRole` callable directly | UI bypassing could grant local role impersonation | **FIXED + VERIFIED** |
| **SEC-04** | Unguarded developer personas on login screen | P1 / Security | `src/core/auth/screens/UnifiedLoginScreen.tsx:343` | Developer personas and demo OTP helpers rendered without release guard | End users in release builds would see demo persona switches | **FIXED + VERIFIED** |
| **SEC-05** | Unverified production session restoration | P0 / Security | `src/core/auth/sessionStore.ts:119-147` | Unsigned local metadata in AsyncStorage was trusted to restore user and role | Local device storage tampering could manufacture arbitrary roles | **FIXED + VERIFIED** |
| **SEC-06** | Insecure browser storage risk for refresh tokens | P0 / Security | `src/core/auth/sessionStore.ts:69-98` | Expo SecureStore fails on Web; no platform-abstracted credential protection policy | Inadvertent persistence of credentials in browser-readable storage | **FIXED + VERIFIED** |
| **SEC-07** | Absence of unified `AuthGateway` contract | P1 / Arch | `src/core/auth/` | Direct coupling between React hooks and mock identity resolver; no REST adapter | Cannot swap in real backend authentication without presentation rewrites | **FIXED + VERIFIED** |
| **FIN-01** | Provider payment callbacks processed client-side | P0 / Financial | `src/modules/accounting/services/paymentGatewayService.ts:105` | Real payment gateway callbacks executed and settled on frontend without server authority | Malicious clients could report fake settlements | **FIXED + VERIFIED** |
| **FIN-02** | Weak signature check allows long arbitrary forged signatures | P0 / Security | `src/modules/accounting/services/paymentGatewayService.ts:117` | Checked only `signature.length < 16` and `!== 'INVALID_SIGNATURE'`; no protocol verification | Forged 64-char hex signatures accepted as valid mock settlements | **FIXED + VERIFIED** |
| **FIN-03** | Fabricated synthetic receipts in `getReceiptById` | P0 / Integrity | `src/modules/resident/billing/data/billing.repository.ts:83` | Automatically manufactured `{ id, receiptNumber: 'REC-' + id }` for any string starting with `REC-` | Fabricated evidence of payment without actual ledger receipt | **FIXED + VERIFIED** |
| **FIN-04** | Client ledger mutations callable in production | P0 / Financial | `src/modules/accounting/services/paymentService.ts:36,190,394` | `settleOnlinePayment`, `recordManualPayment`, and `processRefund` lacked environment runtime safety guard | Direct invocation could corrupt local ledger in production | **FIXED + VERIFIED** |
| **FIN-05** | Production API mode exposes `mockPayment` endpoint | P1 / Integrity | `src/modules/resident/billing/data/billing.apiSource.ts:85` | Calling `mockPayment` in API mode lacked production release gate | Simulated payment execution callable in production builds | **FIXED + VERIFIED** |

---

## 3. Fixes Implemented

### Phase 0: Baseline & Reproducible Build
1. **`src/core/permissions/usePermission.ts`:**
   - Imported `absentValue` from `../../shared/types/absence.types`.
   - Removed dead/unused `mockCurrentUser` and unreferenced `activeHome` / `residentHomeContextStore` / `mapContextRoleToAppRole` imports.
2. **`src/core/security/__tests__/securityReviewFixes.test.ts`:**
   - Updated `superAdminContext` fixture to use `MOCK_PERSONAS.superadmin` satisfying strict `ActiveContext` contract.
   - Updated payment method to `'CASH_CHEQUE'`.
3. **`src/core/api/apiClient.ts`:**
   - Sanitized optional property assignment via spread (`...(session.societyId ? { societyId: session.societyId } : {})`) to satisfy `exactOptionalPropertyTypes: true`.
4. **`.github/workflows/mobile-quality.yml`:**
   - Pinned runner to `ubuntu-24.04` and ensured strict `npm ci` with `--forceExit` test execution.
5. **`jest.setup.ts`:**
   - Added in-memory mock for `expo-secure-store` (`setItemAsync`, `getItemAsync`, `deleteItemAsync`, `isAvailableAsync`).

### Phase 1A: Lock Down Demo Authentication
1. **`src/core/config/runtimePolicy.ts` (NEW):**
   - Implemented single authoritative `RuntimePolicy` with `isProduction()`, `isDemoAllowed()`, `isApiMode()`, `assertDemoAllowed(action)`, and `assertProductionSafe()`.
   - Strictly forbids demo features, mock OTPs, and mock sessions in production mode.
2. **`src/core/dataSource/dataSource.config.ts`:**
   - Enforced fail-closed behavior in production: non-API data source modes (`mock` or `hybrid`) throw an explicit configuration error rather than falling back silently.
3. **`src/core/security/secureStorage.ts` (NEW):**
   - Platform-abstracted secure credential service.
   - Native uses `expo-secure-store`.
   - Web development uses ephemeral in-memory storage; web production strictly refuses to store refresh tokens in browser-readable storage (`PERSISTENCE_NOT_SUPPORTED_ON_WEB_PRODUCTION`).
4. **`src/core/auth/authGateway.types.ts` & adapters (NEW):**
   - Defined typed backend-independent `AuthGateway` interface (`requestOtp`, `verifyOtp`, `refreshSession`, `getCurrentIdentity`, `logout`).
   - Implemented `MockAuthGateway`: retains demo workflows in development/demo builds with explicit demo markers.
   - Implemented `RestAuthGateway`: prepares REST contract against `/api/v1/auth/*` and returns structured `BACKEND_UNAVAILABLE` errors when backend is missing (no fake success).
   - `getAuthGateway()` dynamically resolves `RestAuthGateway` in production or `MockAuthGateway` in demo.
5. **`src/core/auth/sessionStore.ts`:**
   - Switched to `secureStorage` for refresh tokens.
   - Hardened `setCurrentSession`: throws immediately if a mock session is set in production.
   - Hardened `restoreCurrentSession`: in production, stored mock sessions are purged immediately; sessions lacking secure refresh tokens fail closed; session restoration requires authoritative identity verification.
6. **`src/core/auth/useAuthSession.ts`:**
   - Added `runtimePolicy.assertDemoAllowed(...)` guards across `startMockSessionForPersona`, `startMockSessionForRoute`, and `startMockSessionForRole`.
7. **`src/core/auth/AuthProvider.tsx`:**
   - Switched to `getAuthGateway()`.
   - Guarded mock role `login` and `setMockSession` against execution in production.
   - In production, self-registration fails closed with an honest backend requirement message.
8. **`src/core/auth/screens/UnifiedLoginScreen.tsx`:**
   - Developer personas card is completely excluded from render when `!runtimePolicy.isDemoAllowed()`.
   - Added visible `[DEMO BUILD • MOCK IDENTITY ACTIVE]` banner when running in demo mode.
   - Hidden demo verification code badge in production.

### Phase 1B: Payments & Financial Truthfulness
1. **`src/modules/accounting/services/paymentGatewayService.ts`:**
   - Enforced fail-closed behavior on `handleCallback`: in production or whenever `this.config.provider !== 'MOCK'`, client-side callback handling returns `BACKEND_REQUIRED: Client-side payment callback verification is disabled in production. Provider webhooks and callbacks must be cryptographically verified server-side.`
   - In production, guarded `createPayment`, `verifyPayment`, and `refundPayment` with explicit `BACKEND_REQUIRED` error returns.
   - Replaced weak signature length check with structured mock protocol validation via `generateMockPaymentSignature` and `isValidMockSignature`. Arbitrary long forged signatures (e.g. 64-char SHA-256 hex strings) are rejected with `PAYMENT_SIGNATURE_INVALID`.
   - Added adversarial simulation checks in demo mode: missing signature (`PAYMENT_SIGNATURE_MISSING`), missing reference (`Missing payment reference`), nonexistent attempt (`PAYMENT_REFERENCE_MISMATCH`), amount mismatch (`PAYMENT_AMOUNT_MISMATCH`), invoice mismatch (`PAYMENT_INVOICE_MISMATCH`), society mismatch (`PAYMENT_SOCIETY_MISMATCH`), currency mismatch (`PAYMENT_CURRENCY_MISMATCH`), attempt cancelled (`PAYMENT_ALREADY_CANCELLED`), post-refund callback (`PAYMENT_ALREADY_REFUNDED`), duplicate replay with conflicting transaction ID (`PAYMENT_REPLAY_DETECTED`), and legitimate settlement (`SETTLED`).
2. **`src/modules/accounting/services/paymentService.ts`:**
   - Added `runtimePolicy.assertDemoAllowed(...)` guards inside `settleOnlinePayment`, `recordManualPayment`, and `processRefund`. Direct calls in production throw a `[SecurityPolicy]` error, preventing accidental or unauthorized client-side ledger mutation.
3. **`src/modules/resident/billing/data/billing.repository.ts`:**
   - Hardened `getReceiptById`: eliminated synthetic receipt fabrication (`{ id, receiptNumber: 'REC-' + id }`).
   - Now checks authoritative stored receipts in `mockStore.getState().receipts` and verified paid bill payment records; returns `NOT_FOUND` if no authoritative record exists in ledger.
4. **`src/modules/resident/billing/data/billing.apiSource.ts`:**
   - Enforced fail-closed boundary on `mockPayment`: in production builds (`runtimePolicy.isProduction()`), immediately returns `repositoryFailure({ code: 'UNSUPPORTED_OPERATION', message: 'Mock payment is strictly prohibited in production mode. Real payments require server-mediated gateway order creation.' })`.
5. **`src/modules/accounting/__tests__/paymentAndAllocation.test.ts`:**
   - Resolved pre-existing baseline test failure by using `generateMockPaymentSignature` for mock callbacks, verifying both signature security and amount validation.

---

## 4. Tests Added & Updated

### New Suite: `src/core/auth/__tests__/authHardening.test.ts` (22 tests)
- **Runtime Policy & Gateway Resolution:**
  - `resolves MockAuthGateway in development/demo mode`
  - `resolves RestAuthGateway in production mode`
  - `assertDemoAllowed throws an error in production`
- **Demo Mode OTP & Authentication:**
  - `returns demo OTP (123456) in development/demo mode`
  - `verifies demo OTP with correct code 123456`
  - `rejects incorrect OTP in demo mode`
  - `rejects suspended phone number in demo mode`
- **Production Mode Fail-Closed Boundaries:**
  - `MockAuthGateway throws in production for OTP requests`
  - `MockAuthGateway throws in production for OTP verification`
  - `RestAuthGateway fails closed with BACKEND_UNAVAILABLE when backend is unreachable`
  - `setCurrentSession throws if attempting to set a mock session in production`
  - `restoreCurrentSession fails closed in production when stored session is a mock session`
  - `restoreCurrentSession fails closed in production when secure refresh token is missing`
- **Storage & Token Lifecycle Hardening:**
  - `persists sensitive refresh token in secureStorage, not plain AsyncStorage`
  - `logout completely purges session, secure tokens, and memory state`
  - `web production strictly refuses to store refresh tokens in browser storage`
  - `expired session fails closed during restoreCurrentSession`
- **Unauthenticated `usePermission` Fail-Closed:**
  - `returns absentValue and denies permissions when no session is active`
  - `returns valid permissions only when authenticated session exists`
- **`useAuthSession` Mock Methods Production Guard:**
  - `rejects startMockSessionForPersona in production mode`
  - `rejects startMockSessionForRoute in production mode`
  - `rejects startMockSessionForRole in production mode`

### Updated Suite: `src/core/security/__tests__/securityReviewFixes.test.ts` (13 tests)
- Validated all security review assertions including capability engine fail-closed, superadmin scoping, payment signature rejection, long forged signature rejection (FIN-001c), receipt truthfulness (FIN-002: no fake `REC-*`), unsupported billing operations, credential storage separation, cache scoping, idempotency UUIDs.

### New Suite: `src/core/security/__tests__/paymentHardening.test.ts` (22 tests)
- **Production Mode Fail-Closed Boundaries:**
  - `rejects client-side payment callback handling in production`
  - `rejects payment order creation in production`
  - `rejects payment verification against mock store in production`
  - `rejects refund processing against mock store in production`
  - `returns FAILED status for getPaymentStatus in production`
  - `throws security error if settleOnlinePayment is invoked directly in production`
  - `throws security error if recordManualPayment is invoked directly in production`
  - `rejects mockPayment on billApiSource in production`
- **Real Provider (Non-MOCK) Fail-Closed Boundaries:**
  - `refuses client-side handleCallback for real gateway providers (e.g. RAZORPAY)`
  - `refuses client-side createPayment for real gateway providers`
- **Adversarial Callback Verification in Demo/Mock Mode:**
  - `rejects callback with missing signature` (`PAYMENT_SIGNATURE_MISSING`)
  - `rejects callback with short signature (< 16 chars)` (`PAYMENT_SIGNATURE_INVALID`)
  - `rejects callback with explicit INVALID_SIGNATURE` (`PAYMENT_SIGNATURE_INVALID`)
  - `rejects long arbitrary forged signature (64-character SHA-256 hex string)` (`PAYMENT_SIGNATURE_INVALID`)
  - `rejects forged signature prefixed with fake indicators` (`PAYMENT_SIGNATURE_INVALID`)
  - `rejects missing payment reference` (`Missing payment reference`)
  - `rejects callback for non-existent payment reference` (`PAYMENT_REFERENCE_MISMATCH`)
  - `rejects callback with amount mismatch` (`PAYMENT_AMOUNT_MISMATCH`)
  - `rejects callback with mismatched invoice ID` (`PAYMENT_INVOICE_MISMATCH`)
  - `rejects callback with mismatched society ID` (`PAYMENT_SOCIETY_MISMATCH`)
  - `rejects callback with mismatched currency` (`PAYMENT_CURRENCY_MISMATCH`)
  - `rejects callback on cancelled payment attempt` (`PAYMENT_ALREADY_CANCELLED`)
  - `settles legitimate mock callback with valid signature` (`SETTLED`)
  - `handles idempotent duplicate callback gracefully` (`duplicate: true`)
  - `detects replay attack when duplicate attempt has conflicting gateway transaction ID` (`PAYMENT_REPLAY_DETECTED`)
  - `rejects callback after refund has already occurred` (`PAYMENT_ALREADY_REFUNDED`)
- **Financial Truthfulness & Receipt Integrity:**
  - `returns NOT_FOUND for non-existent receipt IDs starting with REC-`
  - `returns NOT_FOUND for empty or non-existent ID`
  - `returns true receipt record when authoritative receipt exists in store`
- **Billing Repository Unsupported Operations Fail Closed:**
  - `returns UNSUPPORTED_OPERATION for publishBillingCycle`
  - `returns UNSUPPORTED_OPERATION for generateMonthlyBills`
  - `returns UNSUPPORTED_OPERATION for recordManualPayment`
  - `returns UNSUPPORTED_OPERATION for createBillingCorrectionRequest`

### Updated Baseline Suite: `src/modules/accounting/__tests__/paymentAndAllocation.test.ts` (4 tests)
- Fixed pre-existing failure on amount mismatch / callback signature verification.

---

## 5. Verification Commands Executed & Verbatim Summaries

### A. Focused Security, Hardening & Payment Test Suite
```bash
npx jest src/core/security/__tests__/paymentHardening.test.ts src/core/security/__tests__/securityReviewFixes.test.ts src/modules/accounting/__tests__/paymentAndAllocation.test.ts src/modules/accounting/__tests__/financialCoverageAndEdgeCases.test.ts src/core/auth/__tests__/authHardening.test.ts --forceExit
```
**Result:**
```
PASS src/modules/accounting/__tests__/financialCoverageAndEdgeCases.test.ts
PASS src/core/security/__tests__/paymentHardening.test.ts
PASS src/core/security/__tests__/securityReviewFixes.test.ts
PASS src/modules/accounting/__tests__/paymentAndAllocation.test.ts
PASS src/core/auth/__tests__/authHardening.test.ts

Test Suites: 5 passed, 5 total
Tests:       89 passed, 89 total
Snapshots:   0 total
Time:        0.747 s, estimated 1 s
```

### B. All Financial & Billing Test Suites
```bash
npx jest src/modules/accounting/__tests__/ src/modules/resident/billing/__tests__/ --forceExit
```
**Result:**
```
PASS src/modules/accounting/__tests__/financialConsistencyAndEdgeCases.test.ts
PASS src/modules/accounting/__tests__/financialLedgerAndOutstanding.test.ts
PASS src/modules/accounting/__tests__/chequeAndAdjustments.test.ts
PASS src/modules/accounting/__tests__/billingRunLifecycle.test.ts
PASS src/modules/accounting/__tests__/accounting.mapper.test.ts
PASS src/modules/resident/billing/__tests__/billingContractAndApiSource.test.ts
PASS src/modules/resident/billing/__tests__/ResidentBilling.mockDataPagination.test.ts
PASS src/modules/resident/billing/__tests__/ResidentBilling.presentation.test.tsx
PASS src/modules/resident/billing/__tests__/BillsAndPayments.pagination.test.tsx
PASS src/modules/resident/billing/__tests__/ResidentBillListScreen.header.test.tsx
PASS src/modules/resident/billing/__tests__/BillingImageFallback.test.tsx
PASS src/modules/resident/billing/__tests__/PaymentCheckout.stickyFooterSpacing.test.ts
PASS src/modules/accounting/__tests__/financialCoverageAndEdgeCases.test.ts
PASS src/modules/accounting/__tests__/paymentAndAllocation.test.ts

Test Suites: 14 passed, 14 total
Tests:       63 passed, 63 total
Snapshots:   0 total
Time:        3.759 s
```

### C. Core Phase 3 Auth & Onboarding Suite
```bash
npx jest src/core/__tests__/authAndOnboardingWorkflows.test.ts --forceExit
```
**Result:**
```
PASS src/core/__tests__/authAndOnboardingWorkflows.test.ts
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        2.501 s, estimated 3 s
```

### D. Clean `npm ci` Validation
```bash
npm ci --dry-run
```
**Result:**
```
up to date in 927ms
228 packages are looking for funding
```

### E. `npx expo-doctor`
```bash
npx --yes expo-doctor
```
**Result:**
```
19/20 checks passed. 1 check failed (12 packages have minor patch updates available for SDK 58: expo 58.0.23 -> ~58.0.26, expo-calendar, etc.).
```

### F. Full Repository Baseline Checks (Documented Honesty)
1. **`npm run typecheck` (`tsc --noEmit`):**
   - **Status:** FAIL (Exit code 2)
   - **Root causes:** Strict indexed access (`noUncheckedIndexedAccess: true`) and exact optional properties across legacy module files.
2. **`npm run lint` (`expo lint`):**
   - **Status:** FAIL (Exit code 1, 387 errors, 1374 warnings)
   - **Root causes:** React 19 / eslint-config-expo rules flagging Reanimated shared value mutations in legacy screens.
3. **`npm run test -- --runInBand`:**
   - **Status:** 370/375 Test Suites PASS (Fixed `paymentAndAllocation.test.ts`; 5 failed: `slaEngine.test.ts`, `facilityBookingStateMachine.test.ts`, `ResidentActivityScreen.test.tsx`, `GateComponents.test.tsx`, `Phase9CommunicationAndCommunityIntegration.test.tsx`).

---

## 6. Backwards Compatibility

- **Demo Billing & Accounting Intact:**
  - In development and demo environments (`process.env.EXPO_PUBLIC_APP_ENV === 'demo'` or `process.env.NODE_ENV !== 'production'`), demo payments, mock receipt viewing, and simulation of gateway callbacks using `generateMockPaymentSignature` continue to work cleanly.
- **Production Safety:**
  - Production builds (`NODE_ENV === 'production'`) fail closed against all client-side callback handling, mock payment mutations, and fake receipt fabrication. Real provider gateways return `BACKEND_REQUIRED`.

---

## 7. Unresolved Risks & Limitations (Future Server Boundaries)

1. **Server-Side Cryptographic Webhook Verification:**
   - The future backend must cryptographically verify gateway signatures (e.g. Razorpay HMAC SHA-256, Stripe Webhook signatures) on incoming webhooks before updating any ledger state.
2. **Server-Side Idempotent Ledger Settlement:**
   - The future server must own atomic settlement, immutable transaction references, and strict integer minor unit balances.
3. **Authoritative Receipt Generation:**
   - All receipts must be issued authoritatively by the backend ledger, backed by immutable sequence counters.

---

## 8. Next Precise Milestone: Phase 1C (Tenant/Role Isolation, Session Caching & Request Context / P0–P1)

**Acceptance Criteria for Phase 1C:**
1. Harden `apiClient.ts` to ensure caller options cannot mutate or overwrite authenticated identity/tenant context headers (`X-Society-Id`, `X-Unit-Id`, `X-Actor-Role`).
2. Update `UniversalApiClient.ts` caching to scope keys by authenticated user ID and tenant, honor `cacheConfig.enabled`, and enforce safe GET caching.
3. Consolidate token management in `ApiService.ts` and remove or isolate unencrypted browser `localStorage` persistence of access/refresh tokens.
4. Strengthen capability engine and route guards to enforce strict tenant/role scoping with negative permission tests.
5. Fail closed in `ResidentEntryNavigator.tsx` on residence access refresh errors.
