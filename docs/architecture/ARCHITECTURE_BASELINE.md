# SocietyOS Architecture Baseline

**Generated:** October 2026  
**Status:** Baseline Established  
**Application Scope:** SocietyOS Mobile (React Native 0.86 / Expo SDK 57 / TypeScript 5.9 strict)

---

## 1. System Overview & Architecture Summary

SocietyOS is an enterprise-grade gated community operations and resident management platform for multi-stakeholder residential societies.
The mobile codebase spans:
- **Roles:** Resident, Guard, Facility Manager, Society Admin, Super Admin, Treasurer.
- **Scale:** 2,700+ TypeScript files, 336 test files, 30+ resident sub-modules.
- **Runtime Foundations:**
  - `src/app`: Application bootstrap, RootNavigator, ResidentNavigator, SuperAdminStack, navigation contracts.
  - `src/core`: MockStore (in-memory persistent state engine with AsyncStorage snapshotting), DomainEventBus, Repository contracts, Auth/Session runtime, Temporal time context.
  - `src/features`: Resident capabilities engine (`ResidentCapabilityGuard`, `useResidentCapabilityAvailability`), permission matrix, feature flag runtime.
  - `src/modules/resident`: Resident experience vertical slices (Visitors, Complaints, Billing, Facility Booking, Household, Documents, Emergency SOS, Chat, Notices, Parking).
  - `src/modules/guard`: Guard gate operations (Gate check-in, pass validation, offline queue, emergency bypass).
  - `src/shared`: Theme tokens (`colors.ts`, `spacing.ts`, `typography.ts`), common design components (`SocietyScreen`, `SocietyCard`, `SocietyDetailHeader`, `SocietyInput`, `SocietyFilterPills`, `SocietyButton`), and global contracts.

---

## 2. Validation Status Baseline

Prior to applying any stabilization changes, the codebase was audited against all configured verification scripts:

| Validation Suite | Baseline Result | Details |
|---|---|---|
| **TypeScript (`tsc --noEmit`)** | ⚠️ 2,523 errors repository-wide | Predominantly concentrated in administrative/intelligence/helpdesk modules and `exactOptionalPropertyTypes` / missing mock properties. Working-tree resident files contained 13 localized type errors. |
| **Lint (`expo lint`)** | ⚠️ ESLint flat config errors | Unused vars, import order, and explicit assertion checks in legacy/admin modules. |
| **Verify Type Safety (`verify-type-safety.mjs`)** | ⚠️ 1,579 violations | AST checks for explicit `any`, explicit `unknown`, explicit `undefined` types, double assertions, `@ts-ignore`. |
| **Verify Clean Source (`verify-source-cleanliness.mjs`)** | ⚠️ 142 comment violations | Disallowed source comments in generated/utility files. |
| **Verify Import Cycles (`verify-import-cycles.mjs`)** | ⚠️ 5 cycles | Circular imports in `job.ports.ts`, `executionService.ts`, `documentVault ports.ts`, `parking ports.ts`, `staff.types.ts`. |
| **Verify UI Structure (`verify-ui-structure.mjs`)** | ⚠️ 1,421 violations | Inline styles in logic files and un-extracted StyleSheet definitions. |
| **Resident Route Release Coverage (`verify-resident-routes`)** | ✅ **PASSED** (4/4 tests) | Every registered resident route is covered and bound to a capability in the release matrix. |
| **Resident Visitors Unit & Domain Tests (`jest src/modules/resident/visitors`)** | ✅ **PASSED** (9 suites, 89/89 tests) | State machine, exit assurance, exit policy resolver, security service, screen header tests all passing. |

---

## 3. Discovered Architectural Problems

1. **Uncommitted Working-Tree Inconsistencies:**
   - 26 files in `src/modules/resident` (Billing, Complaints, Visitors, Facility, Onboarding) and `src/shared/components` were left with half-migrated component interfaces and mock enum mismatches (e.g. `VisitorExitStatus` `"onTrack"` vs `"notEntered"`).
2. **Navigation Type Degradation (`as never`):**
   - Extensive usage of `navigation as never` and `route as never` wrappers in `ResidentNavigator.tsx` to force screens into stack param lists.
3. **Design System Fragmentation:**
   - Overlap between legacy UI components (`AppCard`, `AppText`, `GlassCard`, `SurfaceCard`) in `src/shared/components` / `src/ui` and new canonical primitives (`SocietyScreen`, `SocietyCard`, `SocietyDetailHeader`, `SocietyInput`, `SocietyFilterPills`).
4. **State Ownership & Query Isolation:**
   - Some screens (`VisitorListScreen`, `ComplaintListScreen`) maintained redundant local filtered arrays or query abstractions rather than uniformly relying on `useMockStore` / `DomainEventBus`.
5. **Exact Optional Property Violations:**
   - TypeScript's `exactOptionalPropertyTypes: true` causes parameter assignment errors when passing `{ receiptNumber: undefined }` to `{ receiptNumber?: string }`.

---

## 4. High-Risk Areas Requiring Guardrails

1. **Guard Gate Operations & Visitor Exit Synchronization:**
   - Visitor passes admitted by Guard must update the resident's state seamlessly via `mockStore` and `DomainEventBus`.
2. **Payment & Billing Ledger Transactions:**
   - Multi-step payment must atomically update bill status, outstanding balance, receipts, flat ledger, and dashboard view models.
3. **Facility Booking Atomic Hold & Slot Release:**
   - Cancellation must release slot availability without leaving orphan bookings or conflicting reservations.
4. **Resident Capability & Role Isolation:**
   - Family members vs owners vs tenants must strictly abide by `useResidentCapabilityAvailability` checks.

---

## 5. Scope Boundaries

- **Files/Directories Likely Affected:**
  - `src/modules/resident/visitors/`
  - `src/modules/resident/complaints/`
  - `src/modules/resident/billing/`
  - `src/modules/resident/facilityBooking/`
  - `src/modules/resident/dashboard/`
  - `src/modules/resident/notifications/`
  - `src/app/navigation/ResidentNavigator.tsx`, `navigation.types.ts`
  - `src/shared/components/Society*.tsx`
  - `src/shared/theme/`
  - `src/core/mockStore/`
- **Files That Must NOT Be Touched Unnecessarily:**
  - SuperAdmin, Intelligence, and Backend migration scripts outside resident stabilization scope.
  - Existing passing test suites (`residentRouteReleaseCoverage.test.ts`, visitor state machine tests).
