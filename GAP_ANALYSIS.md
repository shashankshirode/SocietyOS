# Society OS - Gap Analysis: PDF Spec vs Current Codebase

**Document Version:** 1.0  
**Date:** 2026-09-06  
**PDF Spec Version:** 4.0 (133 pages)  
**Codebase:** society-os-mobile (2,776 TypeScript files, 25+ modules)

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **PDF Operational Domains (O1-O26)** | 26 domains |
| **PDF Financial Domains (F1-F20)** | 20 domains |
| **Codebase Modules** | 25+ modules |
| **Resident Sub-modules** | 30+ |
| **Critical Gaps (P0)** | 7 domains completely missing |
| **Major Gaps (P1)** | 9 domains partially implemented |
| **Minor Gaps (P2)** | 10+ domains needing hardening |

---

## Domain Mapping Matrix

### Operational Domains (O1-O26)

| PDF Domain | Title | Current Module(s) | Status | Gap Severity |
|------------|-------|-------------------|--------|--------------|
| **O01** | Society Onboarding | `societySetup` | ✅ Implemented | P2 - Hardening needed |
| **O02** | Resident Registration & Verification | `resident/auth`, `resident/profile` | ✅ Implemented | P2 - Edge cases |
| **O03** | Owner/Tenant/Household Lifecycle | `resident/lifecycle`, `resident/household`, `resident/moveInMoveOut` | ✅ Implemented | P2 - Hardening |
| **O04** | Visitor Pre-Approval & Gate Check-In | `resident/visitors`, `guard` | ✅ Implemented | P2 - Offline sync |
| **O05** | Unknown Visitor / Resident Unreachable | `guard` | ⚠️ Partial | P1 - Policy engine missing |
| **O06** | Complaint Lifecycle & SLA | `resident/complaints`, `helpdesk` | ✅ Implemented | P1 - Parent incident (O07) |
| **O07** | Parent Incident / Duplicate Complaints | `helpdesk` | ❌ Missing | **P0 - Not implemented** |
| **O08** | Preventive Maintenance | `facilityOps`, `vendorAssets` | ⚠️ Partial | P1 - Scheduler missing |
| **O09** | Inventory Reorder & Stock Issue | `vendorAssets` | ⚠️ Partial | P1 - Reorder automation |
| **O10** | Vendor Onboarding & AMC Renewal | `vendorAssets`, `facilityOps/vendors` | ⚠️ Partial | P1 - Renewal workflow |
| **O11** | Facility Booking Conflict | `resident/facilityBooking` | ✅ Implemented | P2 - Atomic conflict |
| **O12** | Notice & Emergency Broadcast | `resident/notices`, `resident/notifications` | ✅ Implemented | P2 - Emergency override |
| **O13** | Resident Communication Approval | `resident/residentConnect` | ✅ Implemented | P2 - Moderation |
| **O14** | Move-In Workflow | `resident/moveInMoveOut` | ✅ Implemented | P2 - Conflict detection |
| **O15** | Move-Out with NOC | `resident/moveInMoveOut`, `resident/noc` | ✅ Implemented | P1 - Digital signing |
| **O16** | Parking Allocation / Transfer | `resident/parking` | ✅ Implemented | P2 - RFID/ANPR sync |
| **O17** | Asset Lifecycle | `vendorAssets`, `facilityOps/assets` | ⚠️ Partial | P1 - Impairment/retirement |
| **O18** | Document Vault Upload/Version/Secure Access | `resident/documents` | ✅ Implemented | P1 - Admin verification + digital signing |
| **O19** | Biometric Attendance Sync/Correction | `biometricAttendance`, `staffAttendance` | ✅ Implemented | P2 - Offline buffer |
| **O20** | Import/Export/Migration | — | ❌ Missing | **P0 - Not implemented** |
| **O21** | Offline Gate Sync/Conflict | `guard` (offline queue) | ⚠️ Partial | **P0 - Conflict resolution missing** |
| **O22** | Notification Retry/Fallback | `resident/notifications` | ⚠️ Partial | **P0 - Multi-channel retry missing** |
| **O23** | Global Search & Privacy Filtering | — | ❌ Missing | **P0 - Not implemented** |
| **O24** | Backup Restore/Disaster Recovery | — | ❌ Missing | **P0 - Not implemented** |
| **O25** | AI-Assisted Complaint Classification | `helpdesk` | ❌ Missing | **P0 - Not implemented** |
| **O26** | Document Verification/Admin Approval/Digital Signing | `resident/documents` | ⚠️ Partial | **P0 - Digital signing missing** |

### Financial Domains (F1-F20)

| PDF Domain | Title | Current Module(s) | Status | Gap Severity |
|------------|-------|-------------------|--------|--------------|
| **F01** | Chart of Accounts | `accounting` | ✅ Implemented | P2 |
| **F02** | Billing Cycle & Bill Generation | `accounting`, `resident/billing` | ✅ Implemented | P2 |
| **F03** | Payment Collection & Reconciliation | `accounting`, `resident/billing` | ✅ Implemented | P1 - Idempotency |
| **F04** | Refund & Reversal | `accounting` | ⚠️ Partial | P1 - Linked reversal |
| **F05** | Manual Journal Entry | `accounting` | ✅ Implemented | P2 |
| **F06** | Bank Reconciliation | `accounting` | ❌ Missing | **P0** |
| **F07** | Expense Management | `accounting`, `facilityOps` | ⚠️ Partial | P1 - Approval workflow |
| **F08** | Vendor Payment | `accounting`, `facilityOps/vendors` | ⚠️ Partial | P1 - Workflow |
| **F09** | Budget & Variance | `accounting`, `reports` | ⚠️ Partial | P1 - Reports only |
| **F10** | Defaulter Management | `accounting`, `reports` | ✅ Implemented | P2 |
| **F11** | GST/TDS Compliance | `accounting` | ❌ Missing | **P0** |
| **F12** | Financial Reporting | `reports`, `accounting` | ✅ Implemented | P2 |
| **F13** | Audit Trail | `accounting` | ⚠️ Partial | P1 - Immutable ledger |
| **F14** | Multi-Currency | — | ❌ Missing | P2 - Not in scope |
| **F15** | Inter-Society Settlement | — | ❌ Missing | P2 - Not in scope |
| **F16** | Expense Reimbursement | `staffAttendance`, `accounting` | ⚠️ Partial | P1 - Workflow |
| **F17** | Outstanding/Ageing/Collections | `accounting`, `reports` | ✅ Implemented | P2 |
| **F18** | Credit Note/Debit Adjustment | `accounting` | ⚠️ Partial | P1 - Source linkage |
| **F19** | Month-End Close | `accounting` | ❌ Missing | **P0** |
| **F20** | Financial Data Import/Opening Balances | — | ❌ Missing | **P0** |

---

## Critical Missing Domains (P0 - Must Implement)

### 1. O07 - Parent Incident / Duplicate Complaints
**Module:** `helpdesk` / `resident/complaints`  
**Missing:** Correlation engine, parent incident creation, child linking, common update broadcast  
**Files to create:** `helpdesk/correlationEngine.ts`, `helpdesk/parentIncident.ts`, screens for parent incident management

### 2. O20 - Import/Export/Migration
**Module:** New module `dataMigration` or extend `societySetup`  
**Missing:** CSV/Excel import engine, schema detection, validation rules, preview, async commit, rollback, batch lineage  
**Files to create:** `dataMigration/importEngine.ts`, `dataMigration/validators.ts`, `dataMigration/preview.ts`, screens

### 3. O21 - Offline Gate Sync / Conflict Resolution
**Module:** `guard` (has offline queue)  
**Missing:** Idempotency keys, conflict strategies per domain, clock skew handling, visitor revocation conflict, authoritative state reconciliation  
**Files to enhance:** `guard/offlineQueue.ts`, add `guard/conflictResolution.ts`

### 4. O22 - Notification Retry / Fallback
**Module:** `resident/notifications`  
**Missing:** Retry policies, exponential backoff, fallback channels (push→SMS→email), DLQ, dead-letter inspection  
**Files to create:** `notifications/retryEngine.ts`, `notifications/fallback.ts`, `notifications/dlq.ts`

### 5. O23 - Global Search & Privacy Filtering
**Module:** New module `globalSearch`  
**Missing:** Cross-domain search index, authorization-aware filtering, field-level privacy, audit logging  
**Files to create:** `globalSearch/searchService.ts`, `globalSearch/privacyFilter.ts`, `globalSearch/indexer.ts`

### 5. O24 - Backup Restore / Disaster Recovery
**Module:** New module `platformOps` (admin-only)  
**Missing:** Recovery runbooks, PITR, tenant isolation validation, audit reconciliation, financial idempotency checks  
**Files to create:** `platformOps/recovery.ts`, `platformOps/backup.ts`, `platformOps/validation.ts`

### 7. O25 - AI-Assisted Complaint Classification
**Module:** `helpdesk` / new `aiServices`  
**Missing:** AI service integration, classification taxonomy, confidence scoring, human-in-loop review, audit of model version  
**Files to create:** `aiServices/classification.ts`, `helpdesk/aiClassification.ts`

### 8. O26 - Document Verification / Admin Approval / Digital Signing
**Module:** `resident/documents` (has vault)  
**Missing:** Verification case workflow, admin checklist, digital signature integration, separate approval/signature events  
**Files to create:** `documents/verificationCase.ts`, `documents/digitalSigning.ts`, `documents/adminReview.ts`

### 9. F06 - Bank Reconciliation
**Module:** `accounting`  
**Missing:** Bank statement import, matching rules, reconciliation worksheet, unmatched item handling  
**Files to create:** `accounting/bankReconciliation.ts`, `accounting/statementImport.ts`

### 10. F11 - GST/TDS Compliance
**Module:** `accounting`  
**Missing:** GST return preparation, TDS deduction, compliance calendar, government portal integration  
**Files to create:** `accounting/gstCompliance.ts`, `accounting/tdsCompliance.ts`

### 11. F19 - Month-End Close
**Module:** `accounting`  
**Missing:** Close checklist, validation checks, period locking, reopening policy, closing snapshot  
**Files to create:** `accounting/monthEndClose.ts`, `accounting/periodLock.ts`

### 12. F20 - Financial Data Import / Opening Balances
**Module:** `accounting` / `dataMigration`  
**Missing:** Opening balance template, trial balance validation, import preview, transactional commit  
**Files to create:** `accounting/openingBalances.ts`, `dataMigration/financialImport.ts`

---

## Major Gaps (P1 - Should Implement)

| Domain | Missing Capability | Module | Effort |
|--------|-------------------|--------|--------|
| O05 | Policy engine for unknown visitor (wait/deny/escalate) | `guard` | Medium |
| O08 | Preventive maintenance scheduler | `facilityOps` | Medium |
| O09 | Automated reorder points, purchase request generation | `vendorAssets` | Medium |
| O10 | AMC renewal workflow with reminders | `vendorAssets`/`facilityOps` | Medium |
| O15 | Digital signing for NOC | `resident/noc` | Medium |
| O17 | Asset impairment, retirement workflow | `vendorAssets` | Medium |
| O18 | Admin verification workflow with checklist | `resident/documents` | Medium |
| O19 | Offline biometric buffer, clock drift handling | `biometricAttendance` | Medium |
| F03 | Payment idempotency, duplicate callback handling | `accounting`/`resident/billing` | High |
| F04 | Linked credit/debit notes with source reference | `accounting` | Medium |
| F07 | Expense approval workflow | `accounting`/`facilityOps` | Medium |
| F08 | Vendor payment workflow | `accounting`/`facilityOps` | Medium |
| F09 | Budget vs actual with variance analysis | `accounting`/`reports` | Medium |
| F13 | Immutable audit trail with tamper evidence | `accounting` | High |
| F16 | Expense reimbursement workflow | `accounting`/`staffAttendance` | Medium |
| F18 | Adjustment source linkage, reason codes | `accounting` | Medium |

---

## Minor Gaps / Hardening (P2 - Edge Cases & Polish)

| Domain | Hardening Needed |
|--------|------------------|
| O01 | Duplicate slug, incomplete property tree validation |
| O02 | Expired invitation handling, duplicate phone prevention |
| O03 | Overlapping occupancy prevention, orphaned household members |
| O04 | Expired/revoked pass handling, offline gate operation |
| O06 | SLA hold/pause/reopen semantics, duplicate detection |
| O11 | Atomic booking conflict with cleanup buffers |
| O12 | Emergency override audit, provider throttling handling |
| O13 | Abuse report, block, revoked consent handling |
| O14 | Maintenance conflict detection, deposit validation |
| O16 | RFID/ANPR mapping sync, expired temp allocation |
| F01-F05, F10, F12, F17 | Edge case validation, error messages, retry logic |
| All | Offline support, error boundaries, loading states, accessibility |

---

## Cross-Cutting Concerns (From Spec QA Acceptance Intent)

Every domain must satisfy:
1. **Protected Human Actor** - Authenticated admin for privileged ops
2. **Single Authoritative Outcome** - No duplicate business effects
3. **Idempotency** - Retries/callbacks don't create duplicates
4. **Visible Exception States** - Recoverable, auditable, no silent corruption
5. **Audit Trail** - Immutable, traceable to source

**Current Codebase Gaps:**
- ❌ Idempotency keys not consistently used across mutations
- ❌ No centralized retry/fallback infrastructure
- ❌ Audit trail not immutable (some direct mutations possible)
- ❌ Exception states not uniformly visible/recoverable
- ❌ No dead-letter queue for async operations

---

## Implementation Priority Order (Option B)

### Phase 1: Critical Infrastructure (Week 1-2)
1. **O22 - Notification Retry/Fallback** - Affects all domains
2. **O21 - Offline Gate Sync/Conflict** - Critical for guard operations
3. **Cross-cutting: Idempotency Keys & Audit Trail** - Foundation for all

### Phase 2: High-Value Business Features (Week 3-4)
4. **O20 - Import/Export/Migration** - High admin value
5. **O26 - Document Verification + Digital Signing** - Compliance critical
6. **O07 - Parent Incident Correlation** - Reduces helpdesk noise

### Phase 3: AI & Search (Week 5-6)
7. **O25 - AI Complaint Classification** - Differentiator
8. **O23 - Global Search** - UX improvement

### Phase 4: Financial Completeness (Week 7-8)
9. **F06 - Bank Reconciliation**
10. **F11 - GST/TDS Compliance**
11. **F19 - Month-End Close**
12. **F20 - Opening Balances Import**

### Phase 5: Platform Operations (Week 9-10)
13. **O24 - Backup/Restore/DR** - Admin tooling

---

## Hardening Checklist (Option C)

For each existing module, verify:
- [ ] All mutations use idempotency keys
- [ ] Error boundaries on every screen
- [ ] Loading/skeleton states for all async operations
- [ ] Offline queue for critical mutations
- [ ] Retry with exponential backoff for network calls
- [ ] Input validation on all forms (client + server)
- [ ] Accessibility: labels, contrast, focus order
- [ ] Unit tests for business logic (>80% coverage)
- [ ] Integration tests for critical flows
- [ ] E2E tests for happy paths + 2 exception paths each
- [ ] Audit logging for all state changes
- [ ] Feature flags for gradual rollout
- [ ] Monitoring/error tracking integration

---

## Module-to-Domain Mapping Reference

```
societySetup          → O01
resident/auth         → O02
resident/profile      → O02
resident/lifecycle    → O03
resident/household    → O03
resident/moveInMoveOut→ O14, O15
resident/visitors     → O04, O05
guard                 → O04, O05, O19, O21
resident/complaints   → O06
helpdesk              → O06, O07, O25
facilityOps           → O08, O10, O11, O17
vendorAssets          → O09, O10, O17
resident/facilityBooking → O11
resident/notices      → O12
resident/notifications → O12, O22
resident/residentConnect → O13
resident/parking      → O16
resident/documents    → O18, O26
resident/noc          → O15, O26
biometricAttendance   → O19
staffAttendance       → O19, F16
accounting            → F01-F20 (partial)
reports               → F09, F12, F17
dataMigration (new)   → O20, F20
globalSearch (new)    → O23
platformOps (new)     → O24
aiServices (new)      → O25
```

---

## Next Steps

1. **Review this analysis** with stakeholders
2. **Confirm priority order** (adjust based on business needs)
3. **Begin Phase 1 implementation** - Notification retry/fallback + idempotency infrastructure
4. **Set up CI/CD gates** for new code quality standards
5. **Establish monitoring** for production error rates