# Navigation Contract & Architecture

**Status:** Canonical Reference  
**Scope:** Root, Role Navigators, Resident Tabs, and Feature Stacks

---

## 1. Top-Level Hierarchy

SocietyOS employs a role-scoped, multi-stack React Navigation architecture:

```
                      RootNavigator
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
  ResidentApp           GuardApp          SuperAdminApp / Others
       │
  ResidentNavigator (Tab Navigator)
       │
  ┌────┴────────────┬─────────────────┬───────────────────┐
  ▼                 ▼                 ▼                   ▼
HomeTab         ServicesTab       ActivityTab        CommunityTab
(HomeStack)    (Quick Services)  (Recent Events)    (Social/Forum)
```

Each primary resident domain also provides an encapsulated feature stack:
- `VisitorStack`: `VisitorList`, `VisitorDetail`, `CreateVisitorPass`, `VisitorPassQrOtp`
- `ComplaintStack`: `ComplaintList`, `ComplaintDetail`, `CreateComplaint`, `ComplaintReopen`, `ComplaintFeedback`
- `BillStack`: `BillList`, `BillDetail`, `MockPaymentConfirmation`, `AdvancePayment`, `PaymentSuccess`, `ReceiptDetail`, `FlatLedger`, `AutoPaySetup`
- `FacilityStack`: `FacilityDiscovery`, `FacilityDetail`, `FacilityBookingConfirmation`, `MyFacilityBookings`
- `ProfileNavigator`: `ProfileHome`, `Settings`, `Appearance`, `Notifications`, `Language`

---

## 2. Strong Navigation Typing Standards

### No Unsafe Navigation Casts
All routes and screen parameters must be strongly typed at compile time.
The following anti-patterns are forbidden:
- `navigation as never`
- `route as never`
- `navigation.navigate('NonExistentRoute' as any)`

### Standard Param Contract Definitions
Screen props must use:
- `NativeStackScreenProps<StackParamList, 'RouteName'>` for single stack screens.
- `CompositeScreenProps<NativeStackScreenProps<StackParamList, 'RouteName'>, BottomTabScreenProps<RootTabParamList>>` for screens mounted inside a tab or cross-stack navigable.
- Discriminated union of stack screen props when a screen is mounted in both a home quick-action stack and its dedicated feature stack (e.g. `CreateVisitorPassScreenProps = NativeStackScreenProps<VisitorStackParamList, 'CreateVisitorPass'> | NativeStackScreenProps<HomeStackParamList, 'CreateVisitorFromHome'>`).

---

## 3. Parameter Passing Invariants

1. **Object Passing vs ID Passing:**
   - Navigating to detail screens supports either passing the full domain entity or passing an entity ID (e.g. `{ complaint?: Complaint; complaintId?: string }`).
   - If an ID is passed, the screen fetches the latest entity from the canonical hook (`useComplaintDetail(id)`), ensuring offline-ready and deep-link readiness.
2. **Back Navigation Resilience:**
   - `performBackNavigation`: Screens check `navigation.canGoBack()` before calling `navigation.goBack()`.
   - Modals and checkout steps safely return to their originating screen or tab root.
