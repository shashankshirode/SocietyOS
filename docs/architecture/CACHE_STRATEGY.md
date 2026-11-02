# SocietyOS Cache Strategy & Freshness Architecture

This document defines the query caching, invalidation rules, stale-time policies, and lifecycle refresh behaviors for SocietyOS.

---

## 1. Domain Query Cache Policies

| Query Resource | Cacheable? | Stale After | Refresh on Focus? | Refresh on Foreground? | Invalidation Trigger Mutations | Scope Key Structure |
|:---|:---:|:---:|:---:|:---:|:---|:---|
| **Visitor List** | Yes | 60 sec | Yes | Yes | `createVisitorPass`, `cancelVisitorPass`, `validatePassAtGate`, `confirmVisitorLeft` | `vis:{societyId}:{unitId}` |
| **Visitor Detail** | Yes | 30 sec | Yes | Yes | `updateVisitorStatus`, `confirmVisitorLeft`, `cancelVisitorPass` | `vis_detail:{visitorId}` |
| **Complaint List** | Yes | 120 sec | Yes | Yes | `createComplaint`, `updateComplaintStatus`, `reopenComplaint` | `comp:{societyId}:{unitId}` |
| **Complaint Detail**| Yes | 60 sec | Yes | Yes | `updateComplaintStatus`, `addComplaintFeedback` | `comp_detail:{complaintId}` |
| **Resident Bills** | Yes | 300 sec | No | Yes | `payBill`, `publishBillingCycle` | `bill:{societyId}:{unitId}` |
| **Bill Detail** | Yes | 300 sec | No | Yes | `payBill` | `bill_detail:{billId}` |
| **Ledger Statement**| Yes | 300 sec | No | Yes | `payBill`, `recordManualPayment` | `ledger:{societyId}:{unitId}` |
| **Facility Catalog**| Yes | 1800 sec | No | No | Admin facility updates | `fac_catalog:{societyId}` |
| **Facility Slots** | Yes | 30 sec | Yes | Yes | `createFacilityBooking`, `cancelFacilityBooking` | `fac_slots:{facilityId}:{date}` |
| **My Bookings** | Yes | 60 sec | Yes | Yes | `createFacilityBooking`, `cancelFacilityBooking`, `checkIn` | `my_bookings:{societyId}:{unitId}` |
| **Notification Inbox**| Yes | 30 sec | Yes | Yes | `markNotificationRead`, `markAllNotificationsRead` | `notif:{userId}` |
| **Document Metadata**| Yes | 600 sec | No | Yes | `uploadPlaceholder`, `verifyDocument` | `docs:{societyId}:{unitId}` |
| **SOS Incident** | No (Real-time) | 0 sec | Yes | Yes | `triggerEmergency`, `acknowledgeEmergency`, `resolveEmergency` | `sos:{societyId}:{unitId}` |

---

## 2. Invalidation & Mutation Triggers

1. **Deterministic Cache Invalidation**:
   - Creating a visitor pass immediately invalidates `vis:{societyId}:{unitId}` and updates dashboard metrics.
   - Paying a bill invalidates `bill:{societyId}:{unitId}`, `bill_detail:{billId}`, `ledger:{societyId}:{unitId}`, and dashboard balance summary.
   - Cancelling a facility reservation invalidates `fac_slots:{facilityId}:{date}` and `my_bookings:{societyId}:{unitId}`.

2. **Residence Context Switch Invalidation**:
   - Switching active unit from Unit B-804 to Unit A-1204 purges all in-flight requests and invalidates cached data for the previous unit.
   - The UI never retains or displays data from a previously selected home context.

3. **Session Expiry & Logout Isolation**:
   - Session termination immediately flushes all user inboxes, notification buffers, and private document metadata from memory.
   - User B cannot inspect cached responses belonging to User A upon subsequent login.

4. **Stale Response Protection**:
   - Every asynchronous request carries a sequence generation or context identifier.
   - When a newer request for the same resource finishes first, older responses arriving out of order are discarded without overwriting newer state.
