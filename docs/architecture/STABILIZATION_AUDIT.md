# SocietyOS Stabilization Audit

**Generated:** October 2026  
**Auditor:** Principal Software Architect & Product Reliability Engineer  
**Reference Specification:** Implementation-Aligned Product Specification & Blueprint v4.0

---

## 1. Inventory & Code Classification

| Directory / Area | Purpose | Classification | Status & Migration Plan |
|---|---|---|---|
| `src/app/navigation` | App root, role stacks, navigation param lists | **CANONICAL** | Migrate `as never` casts to strongly typed `NativeStackScreenProps` and composite navigation props. |
| `src/core/mockStore` | Authoritative in-memory data store with async persistence | **CANONICAL** | Single source of truth for mock backend operations, queries, subscriptions, and listeners. |
| `src/core/events` | `DomainEventBus` for cross-module side effects | **CANONICAL** | Consolidate visitor, complaint, billing, booking, and emergency domain events. |
| `src/features/residentCapabilities` | Capability registry, release coverage, and role guards | **CANONICAL** | Active source of truth for permission and capability resolution. |
| `src/shared/theme` | Color palette, typography, spacing tokens | **CANONICAL** | Unified theme system with calm, premium, modern palette (`#064F43` primary, `#F8F6F0` background). |
| `src/shared/components/Society*` | `SocietyScreen`, `SocietyCard`, `SocietyDetailHeader`, `SocietyInput`, `SocietyFilterPills`, `SocietyButton` | **CANONICAL** | Target design primitives for all resident screens. |
| `src/ui/*` | Legacy design system primitives (`PageShell`, `AdaptiveFlowComposer`, `FeedbackState`) | **ACTIVE / LEGACY** | Keep for unmigrated modules; progressively map to canonical `Society*` components. |
| `src/modules/resident/visitors` | Visitor pass generation, QR/OTP, check-in tracking, exit assurance | **CANONICAL (P0)** | Golden reference implementation. Standardize data layer to `useMockStore` + `visitorsRepository`. |
| `src/modules/resident/complaints` | Ticket creation, escalation, SLA tracking, feedback | **CANONICAL (P0)** | Authoritative complaint lifecycle state machine. |
| `src/modules/resident/billing` | Bill generation, mock payment processing, receipt, ledger | **CANONICAL (P0)** | Atomic payment transaction lifecycle. |
| `src/modules/resident/facilityBooking` | Amenity discovery, slot reservation, waitlist, cancellation | **CANONICAL (P0)** | Atomic slot reservation and conflict resolution. |
| `src/modules/resident/dashboard` | Resident home view, hero spotlight, today-at-a-glance | **CANONICAL (P0)** | Derive from domain state via selectors; eliminate standalone mock arrays. |

---

## 2. Structural Defect Analysis

### 2.1 Navigation & Screen Contracts
- **Root Cause:** Screen components were defined with relaxed or incompatible prop signatures (e.g. `LegacyScreenProps`), forcing `ResidentNavigator` to wrap screens in `(props) => <Screen navigation={props.navigation as never} />`.
- **Solution:** Standardize screen component props to use `NativeStackScreenProps<StackParamList, 'RouteName'>` or explicit typed handlers.

### 2.2 Domain State Duplication
- **Root Cause:** Screens like `VisitorListScreen` were using both `useVisitors` (which read from `useMockStore`) and local filtering states, creating synchronization gaps when guard or background tasks updated passes.
- **Solution:** Single-directional flow: Screen → Hook / Presenter → Repository → `mockStore` → Listeners → Screen rerender.

### 2.3 Visual Inconsistency & Hex Literals
- **Root Cause:** Multiple historical design passes introduced varying color values (`#0D5C3A`, `#059669`, `#1A211C`) across feature styles.
- **Solution:** Migrate feature styles to reference `useAppTheme().colors` semantic tokens.

### 2.4 Optional Property Type Strictness
- **Root Cause:** `tsconfig.json` enables `exactOptionalPropertyTypes: true`. Assigning `{ field: undefined }` to an interface where `{ field?: string }` is declared violates this rule.
- **Solution:** Sanitize mutation payloads and navigation parameters to omit undefined properties using `includeWhenPresent` or safe object construction.
