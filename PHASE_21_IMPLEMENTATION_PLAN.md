# Phase 21 — Utility & Energy Operations: Implementation Plan

## Executive Summary

Create a dedicated `src/modules/utilities/` bounded context that owns all utility business logic (meters, readings, consumption, water, electricity, solar, EV operations, billing handoff), while Phase 20's `hardwareIntegration` remains the device/connector/health owner. Phase 7 Finance owns authoritative ledger operations.

---

## 1. Repository Audit & Classification

### Current State Classification

| Component | Status | Action |
|-----------|--------|--------|
| `hardwareIntegration/services/smartMeterConnectorService.ts` | PARTIAL | Migrate business logic to utilities; keep connector ingestion in hardwareIntegration |
| `hardwareIntegration/services/evChargingConnectorService.ts` | PARTIAL | Migrate business logic to utilities; keep connector session events in hardwareIntegration |
| `shared/types/smartMeter.types.ts` | PARTIAL | Extend with utility types; move to utilities/types |
| `shared/types/evCharging.types.ts` | PARTIAL | Extend with utility types; move to utilities/types |
| `hardwareIntegration/screens/SmartMeterDashboardScreen.tsx` | HARDCODED (`dev-028`) | Replace with utilities dashboard |
| `hardwareIntegration/screens/SmartMeterReadingDetailScreen.tsx` | WORKING | Migrate to utilities |
| `hardwareIntegration/screens/MeterReadingImportPlaceholderScreen.tsx` | PLACEHOLDER | Replace with real import pipeline |
| `hardwareIntegration/screens/EvChargingDashboardScreen.tsx` | HARDCODED (`evs-001`) | Replace with utilities EV dashboard |
| `hardwareIntegration/screens/EvChargerDetailScreen.tsx` | HARDCODED (`evs-001`) | Migrate to utilities |
| `hardwareIntegration/screens/EvChargingSessionPlaceholderScreen.tsx` | PLACEHOLDER | Replace with real session detail |
| `hardwareIntegration/hooks/useSmartMeterDashboard.ts` | WORKING | Migrate to utilities |
| `hardwareIntegration/hooks/useSmartMeterReadingDetail.ts` | WORKING | Migrate to utilities |
| `hardwareIntegration/hooks/useMeterReadingImport.ts` | PLACEHOLDER | Replace with real import hook |
| `hardwareIntegration/hooks/useEvChargingDashboard.ts` | WORKING | Migrate to utilities |
| `hardwareIntegration/hooks/useEvChargerDetail.ts` | WORKING | Migrate to utilities |
| `hardwareIntegration/hooks/useEvChargingSession.ts` | PLACEHOLDER | Replace with real session hook |
| Feature Flags: `smartMetersReadiness`, `evChargingReadiness` | WORKING | Add utility-specific flags |

---

## 2. Domain Architecture

### New Module Structure
```
src/modules/utilities/
├── core/
│   ├── types/
│   │   ├── utility.types.ts
│   │   ├── reading.types.ts
│   │   ├── consumption.types.ts
│   │   ├── anomaly.types.ts
│   │   ├── correction.types.ts
│   │   ├── billing.types.ts
│   │   ├── water.types.ts
│   │   ├── electricity.types.ts
│   │   ├── solar.types.ts
│   │   ├── ev.types.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── meterService.ts
│   │   ├── readingService.ts
│   │   ├── consumptionService.ts
│   │   ├── anomalyService.ts
│   │   ├── correctionService.ts
│   │   ├── billingService.ts
│   │   ├── importService.ts
│   │   ├── waterService.ts
│   │   ├── electricityService.ts
│   │   ├── solarService.ts
│   │   ├── evService.ts
│   │   ├── tariffService.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── utilities.repository.ts
│   │   ├── utilities.apiSource.ts
│   │   ├── utilities.mockSource.ts
│   │   └── utilities.mapper.ts
│   ├── hooks/
│   │   ├── useMeters.ts
│   │   ├── useReadings.ts
│   │   ├── useConsumption.ts
│   │   ├── useAnomalies.ts
│   │   ├── useCorrections.ts
│   │   ├── useBilling.ts
│   │   ├── useImport.ts
│   │   ├── useWater.ts
│   │   ├── useElectricity.ts
│   │   ├── useSolar.ts
│   │   ├── useEV.ts
│   │   └── index.ts
│   └── index.ts
├── water/
├── electricity/
├── solar/
├── ev/
└── analytics/
```

### Domain Ownership Matrix

| Concern | Owner | Details |
|---------|-------|---------|
| Physical Device (RFID, ANPR, Meter, Charger) | Phase 20 hardwareIntegration | Registration, health, auth, protocol |
| Connector Ingestion (source events) | Phase 20 hardwareIntegration | MQTT/REST/webhook → normalized source event |
| Meter Business Identity | Phase 21 utilities | Meter master, assignment, replacement |
| Reading Validation/Consumption | Phase 21 utilities | Pipeline from source to billing-ready |
| Anomaly/Correction | Phase 21 utilities | Review, findings, versioning |
| Water/Tanker/Shortage | Phase 21 utilities | Full operations |
| Electricity/Solar | Phase 21 utilities | Full operations |
| EV Reservation/Session Business | Phase 21 utilities | Booking, entitlement, tariff, billing |
| EV Hardware Session Events | Phase 20 hardwareIntegration | START/UPDATE/STOP callbacks |
| Finance Invoice/Ledger | Phase 7 accounting | Authoritative charges, payments |
| Asset Maintenance | Phase 16 vendorAssets | Physical meter/pump/charger repair |
| Notifications | Phase 12 | Shortage alerts, EV expiry, billing |
| Reports | Phase 19 | Source-backed utility metrics |

---

## 3. Implementation Steps

### Step 1: Create Utility Type System (Week 1)
**Files to create:**
- `src/modules/utilities/core/types/utility.types.ts`
- `src/modules/utilities/core/types/reading.types.ts`
- `src/modules/utilities/core/types/consumption.types.ts`
- `src/modules/utilities/core/types/anomaly.types.ts`
- `src/modules/utilities/core/types/correction.types.ts`
- `src/modules/utilities/core/types/billing.types.ts`
- `src/modules/utilities/core/types/water.types.ts`
- `src/modules/utilities/core/types/electricity.types.ts`
- `src/modules/utilities/core/types/solar.types.ts`
- `src/modules/utilities/core/types/ev.types.ts`
- `src/modules/utilities/core/types/index.ts`

**Key types to define:**
- `UtilityType`: WATER | ELECTRICITY | GAS | SOLAR_GENERATION | DIESEL | EV_ENERGY
- `Meter`: meterId, meterCode, utilityType, meterKind, measurementUnit, multiplier, precision, locationId, hardwareDeviceId?, assetId?, commissionedAt, decommissionedAt
- `MeterAssignment`: assignmentId, meterId, targetType (UNIT|TOWER|COMMON_AREA|TANK|FACILITY|SOLAR_INVERTER|EV_CHARGER|WHOLE_SOCIETY), targetId, validFrom, validTo
- `MeterReading`: readingId, meterId, readingAt, receivedAt, sourceEventTime, value, unit, source (SMART_METER|MANUAL|FILE_IMPORT|UTILITY_PROVIDER|ESTIMATED), sourceEventId, deduplicationKey, status (RECEIVED|VALIDATING|VALIDATED|CONSUMPTION_READY|DUPLICATE|ANOMALY|REVIEW_REQUIRED|REJECTED|CORRECTED|SUPERSEDED), quality (COMPLETE|PARTIAL|ESTIMATED|STALE|MISSING|CONFLICTED|SOURCE_UNAVAILABLE)
- `ConsumptionRecord`: consumptionId, meterId, periodStart, periodEnd, previousReadingId, currentReadingId, rawConsumption, normalizedConsumption, unit, multiplier, status (CALCULATED|ESTIMATED|REVIEW_REQUIRED|BILLING_READY|EXPORTED|ADJUSTMENT_REQUIRED)
- `UtilityAnomaly`: anomalyId, meterId, readingId, type (SPIKE|DROP|FLAT_ZERO|UNEXPECTED_FLOW|MISSING_READING), baseline, threshold, status (OPEN|IN_REVIEW|GENUINE_USAGE|LEAK_CONFIRMED|METER_FAULT|DATA_ERROR|RESOLVED), review findings
- `ReadingCorrection`: correctionId, originalReadingId, correctedValue, reason, evidenceRef, status (REQUESTED|APPROVED|REJECTED|APPLIED), appliedAt, downstreamRecalcRequired
- `UtilityChargeInput`: chargeId, societyId, targetId, utilityType, period, sourceConsumptionId, billableQuantity, unit, tariffVersion, calculatedAmount, idempotencyKey, reviewState

### Step 2: Meter Master Service (Week 1-2)
**Files:**
- `src/modules/utilities/core/services/meterService.ts`

**Features:**
- CRUD for Meter with society-scoped meterCode uniqueness
- Effective-dated MeterAssignment (Unit/Tower/Common Area/etc.)
- Meter replacement: decommission old, create new, continuity link
- Meter decommission: block future readings, preserve history
- Cross-society isolation enforced
- Optimistic concurrency control (version/timestamp)

### Step 3: Reading Ingestion Pipeline (Week 2)
**Files:**
- `src/modules/utilities/core/services/readingService.ts`

**Flow:**
1. Receive normalized source event from Phase 20 connector
2. Resolve Meter via hardwareDeviceId or meterCode
3. Validate effective assignment at reading timestamp
4. Unit conversion (store original + normalized)
5. Multiplier application (effective-dated)
6. Deterministic dedupe: meterId + readingAt + source + sourceEventId
7. Out-of-order handling: store all, process in timestamp order
8. Status transitions: RECEIVED → VALIDATING → VALIDATED/CONSUMPTION_READY or ANOMALY/REVIEW_REQUIRED
9. Persist as immutable source reading

### Step 4: Manual Reading & File Import (Week 2-3)
**Files:**
- `src/modules/utilities/core/services/importService.ts`
- `src/modules/utilities/core/hooks/useImport.ts`
- New screens: `MeterReadingImportScreen.tsx`, `ImportPreviewScreen.tsx`

**Import Pipeline:**
1. File upload (CSV/Excel) → schema detection → column mapping
2. Row validation: meter match, timestamp, numeric, unit, duplicate
3. Preview with classification: VALID | DUPLICATE | UNKNOWN_METER | INVALID_TIMESTAMP | INVALID_VALUE | INVALID_UNIT
4. Explicit confirmation → controlled commit (transactional)
5. Import summary with counts per class
6. Idempotency: file checksum + row source key
7. Retry/recovery on crash

**Manual Reading:**
- Authorized staff only (Facility/Utility Admin)
- Meter selection, value, timestamp, source=MANUAL, optional evidence (Phase 9 Document Vault link)
- Same validation pipeline as smart meter

### Step 5: Consumption Engine (Week 3)
**Files:**
- `src/modules/utilities/core/services/consumptionService.ts`

**Deterministic Calculation:**
- Previous reading selection: latest VALIDATED/CONSUMPTION_READY reading for same meter/continuity before current readingAt
- Handle meter replacement: continuity boundary (old meter final → new meter initial)
- Rollover: configured max value, auto-detect if (current + rollover) - previous ≈ expected
- Reset: explicit reset event required, not inferred
- Decreasing reading → REVIEW_REQUIRED, consumption=0, flag isDecreasingReset
- Estimated readings: clearly marked, replaced by actual → recalc + Finance adjustment
- Zero vs missing: explicit distinction
- Versioned calculation (store formula version with each ConsumptionRecord)

### Step 6: Anomaly Detection & Review (Week 3-4)
**Files:**
- `src/modules/utilities/core/services/anomalyService.ts`
- Screens: `AnomalyListScreen.tsx`, `AnomalyDetailScreen.tsx`

**Detection:**
- Configurable baselines: historical avg, seasonal, threshold, rolling window
- Types: SPIKE (2x baseline), DROP (50% baseline), FLAT_ZERO (N consecutive zeros), UNEXPECTED_FLOW (continuous non-zero), MISSING_READING (scheduled but absent)
- Insufficient history → INSUFFICIENT_BASELINE (no false positive)

**Review Workflow:**
- Operator inspects readings, baseline, meter/device health
- Links to Phase 6 Complaint / Phase 16 WorkOrder for leak investigation
- Findings: GENUINE_USAGE | LEAK_CONFIRMED | METER_FAULT | DATA_ERROR | UNKNOWN
- Billing hold: ANOMALY status blocks BILLING_READY until resolved
- Closure with audit trail

### Step 7: Reading Correction (Week 4)
**Files:**
- `src/modules/utilities/core/services/correctionService.ts`

**Correction Flow:**
1. Request with originalReadingId, correctedValue, reason, evidence
2. Approval (Utility Admin / Finance Admin per policy)
3. On approval: create new reading SUPERSEDES original, link correction
4. Recalculate downstream ConsumptionRecords
5. If already billed → generate Finance adjustment request (Phase 7)
6. Closed period: financial impact follows Phase 7 closed-period semantics
7. Full audit trail

### Step 8: Water Operations (Week 4-5)
**Files:**
- `src/modules/utilities/core/services/waterService.ts`
- Types: `water.types.ts`

**Features:**
- WaterSource master: MUNICIPAL, BOREWELL, TANKER, RECYCLED, OTHER
- WaterStorage/Tank linkage (Phase 16 Asset link)
- Manual supply log: date, source, duration/volume, operator, evidence
- TankerDelivery: vendor (Phase 16), gate event (Phase 5), ordered vs verified quantity, quality test ref, procurement/invoice link
- Duplicate delivery prevention (vendor invoice ref)
- WaterShortage: scope, severity, start, reason, expected resolution, actions, communications, closure
- LeakInvestigation: anomaly → complaint/workorder → repair → post-repair analysis

### Step 9: Electricity Operations (Week 5)
**Files:**
- `src/modules/utilities/core/services/electricityService.ts`
- Types: `electricity.types.ts`

**Features:**
- Common-area meters, building/tower meters, facility meters, Unit submeters
- ElectricityProviderBill metadata: meter(s), period, units, amount, provider, document ref (Phase 9)
- Anomaly detection for common-area
- Tariff versioning for cost calculation

### Step 10: Solar Operations (Week 5)
**Files:**
- `src/modules/utilities/core/services/solarService.ts`
- Types: `solar.types.ts`

**Features:**
- SolarGenerationRecord: source readings, generation by period
- Self-consumption / grid export/import where data available
- Downtime: anomaly → Phase 16 WorkOrder → cause → recovery
- Savings: explicit tariff, calculation rule, period; distinguish ESTIMATED vs ACTUAL
- No invented CO2 claims without configured emission factor

### Step 11: Tariff & Configuration (Week 5-6)
**Files:**
- `src/modules/utilities/core/services/tariffService.ts`

**Features:**
- Effective-dated tariff versions per utility type
- Water: per KL slab rates
- Electricity: per kWh, time-of-day if configured
- EV: per kWh, per session, time-based, free allowance, idle fee
- Versioned: historical calculations use applicable version

### Step 12: Finance Integration (Week 6)
**Files:**
- `src/modules/utilities/core/services/billingService.ts`
- Types: `billing.types.ts`

**UtilityChargeInput Contract:**
```typescript
interface UtilityChargeInput {
  chargeId: string;
  societyId: string;
  targetId: string;
  targetType: 'UNIT' | 'TOWER' | 'COMMON_AREA' | 'EV_SESSION';
  utilityType: UtilityType;
  period: { start: string; end: string; billingPeriodId: string };
  sourceConsumptionId: string;
  billableQuantity: number;
  unit: string;
  tariffVersion: string;
  calculatedAmount: number;
  taxConfigRef?: string;
  idempotencyKey: string;
  reviewState: 'PENDING' | 'READY' | 'EXPORTED' | 'REJECTED' | 'ADJUSTMENT_REQUIRED';
}
```

**Handoff:**
- ConsumptionRecord.BILLING_READY → generate UtilityChargeInput
- Idempotent: same chargeId/consumptionId/period → no duplicate
- Finance rejects: period closed, invalid charge head, target inactive, duplicate, config missing
- Rejection → recoverable exception, consumption unchanged
- Correction after billing → Finance adjustment request (not direct ledger edit)

### Step 13: Move-Out Final Reading (Week 6)
**Files:**
- Integration with Phase 8 Move-Out

**Features:**
- Final reading capture: meter, occupancy/unit, reading time, source, value, validation, actor/evidence
- Occupancy boundary: Phase 4 effective dates
- Missing final reading → blocks NOC/final settlement (configurable)
- Proration: boundary reading if exists, else estimation policy
- New occupant not charged for previous occupancy

### Step 14: EV Business Domain (Week 6-7)
**Files:**
- `src/modules/utilities/core/services/evService.ts`
- Types: `ev.types.ts`
- Screens: `EvReservationScreen.tsx`, `EvSessionDetailScreen.tsx`, `EvTariffScreen.tsx`

**Charging Point (Business) vs Charger (Device):**
- EvChargingPoint: pointId, chargerDeviceId (Phase 20), parkingSlotId (Phase 11), connectorType, status, tariffId
- Relationship: 1 charger ↔ 1+ slots (configurable)

**Reservation Lifecycle:**
REQUESTED → RESERVED → CHECKED_IN/READY → CHARGING → COMPLETED
Exceptions: CANCELLED | NO_SHOW | EXPIRED | FAILED

**Entitlement Check:**
- Active resident/authorized user (server-derived)
- Eligible EV vehicle (Phase 11 Vehicle with EV capability)
- Charger enabled, society policy, parking rule, time window, charger status

**Session:**
- START: reservation/walk-in → charger available → connector command → device ack → session starts
- Energy: derived from Phase 20 meterStart/meterEnd + incremental readings
- STOP: resident/admin/charger/provider/fault/load-mgmt/emergency → reason recorded
- Duplicate/out-of-order: Phase 20 externalSessionId reconciliation
- Failed session: preserves consumed energy, billing policy decides charge

**Tariff & Billing:**
- Effective-dated EV tariff versions
- Cost estimate (display) vs Final billing input (Finance handoff)
- Free allowance rule explicit
- Idle fee: only from verified charging-complete event

**Load Management Readiness:**
- Site capacity config, charger capacity metadata, current load inputs
- Typed control-policy boundary (no autonomous load shedding)
- Overload alert/readiness

### Step 15: UI Migration (Week 7)
**New Screens in utilities module:**
- `UtilitiesDashboardScreen.tsx` (replaces SmartMeterDashboard)
- `MeterListScreen.tsx`, `MeterDetailScreen.tsx`
- `ReadingListScreen.tsx`, `ReadingDetailScreen.tsx`
- `MeterReadingImportScreen.tsx`, `ImportPreviewScreen.tsx`
- `ConsumptionScreen.tsx`
- `AnomalyListScreen.tsx`, `AnomalyDetailScreen.tsx`
- `CorrectionScreen.tsx`
- `WaterDashboardScreen.tsx`, `TankerDeliveryScreen.tsx`, `WaterShortageScreen.tsx`
- `ElectricityDashboardScreen.tsx`
- `SolarDashboardScreen.tsx`
- `EvDashboardScreen.tsx`, `EvReservationScreen.tsx`, `EvSessionDetailScreen.tsx`
- `TariffConfigScreen.tsx`

**Remove from hardwareIntegration:**
- SmartMeterDashboardScreen, SmartMeterReadingDetailScreen, MeterReadingImportPlaceholderScreen
- EvChargingDashboardScreen, EvChargerDetailScreen, EvChargingSessionPlaceholderScreen
- Associated hooks

### Step 16: Navigation & Feature Flags (Week 7)
**Navigation:**
- New `UtilitiesStackParamList` in navigation.types.ts
- `UtilitiesStack.tsx` with all utility screens
- Feature-gated: waterManagement, energyManagement, solarManagement, evCharging

**Feature Flags to add:**
```typescript
waterManagement: true,
energyManagement: true,
smartMeterIntegration: true,
solarManagement: true,
evCharging: true,
gasUtility: false,
```

### Step 17: Background Jobs (Week 7-8)
**Jobs (using existing scheduler/queue):**
- MissingReadingDetectionJob: scheduled dates → no reading → MISSING/REVIEW/ESTIMATION
- AnomalyEvaluationJob: periodic baseline evaluation
- StaleReadingDetectionJob: connector lag alerts
- BillingReadinessCutoffJob: period end → validate all readings ready
- TankerReminderJob: scheduled deliveries
- ShortageAlertJob: storage threshold monitoring
- EvReservationExpiryJob: server-side, atomic with session start
- EvIncompleteSessionReconciliationJob: missing STOP events
- ReportAggregationJob: daily/weekly/monthly summaries
- RetentionJob: per-category retention policies

### Step 18: Reports & Observability (Week 8)
**Phase 19 Integration:**
- Water consumption, source mix, tanker dependency/cost
- Leak/anomaly count, resolution time
- Meter health/readiness
- Common electricity trend, provider bill vs meter
- Solar generation, utilization, savings (with source quality)
- EV sessions, energy, utilization, revenue
- Utility billing exceptions
- Sustainability trend

**Metrics (no sensitive data in labels):**
- Reading ingestion rate, validation failures, duplicate rate
- Missing reading backlog, anomaly backlog, correction backlog
- Smart meter connector lag, tanker volume exceptions
- Billing handoff failures, EV reservation conflicts
- Charger availability, session reconciliation backlog

### Step 19: Privacy, Security, Audit (Week 8)
**Privacy:**
- Unit consumption: resident-only, Facility/Utility Admin, Finance Admin
- EV history: resident-only, Facility Admin for operations
- No Unit consumption in global search/exports without permission
- Platform support: controlled workflow

**Audit Events:**
- METER_CREATED/UPDATED/ASSIGNED/REASSIGNED/DECOMMISSIONED
- MANUAL_READING_SUBMITTED/READING_IMPORT_COMMITTED/READING_REJECTED
- READING_CORRECTION_REQUESTED/APPROVED/REJECTED
- UTILITY_ANOMALY_REVIEWED/UTILITY_BILLING_RELEASED
- TANKER_ORDER_RECORDED/DELIVERY_VERIFIED/DELIVERY_CORRECTED
- WATER_SHORTAGE_DECLARED/CLOSED, LEAK_INVESTIGATION_RESOLVED
- TARIFF_CHANGED
- EV_RESERVATION_CREATED/CANCELLED, EV_SESSION_STARTED/COMPLETED/RECONCILED, EV_BILLING_RELEASED

### Step 20: Testing & Quality Gates (Week 8-9)

**Test Suites (per spec §169-179):**
- Meter Master: create, duplicate, assign, reassign, effective dates, replacement, decommission, cross-society, concurrency
- Readings: smart, manual, import, estimated, timestamp, units, multiplier, zero, missing, duplicate, out-of-order, decrease, reset, rollover, replacement
- Import: valid file, invalid schema, unknown meter, duplicate, invalid timestamp, unit mismatch, preview, partial errors, commit, retry, crash/recovery, checksum/idempotency
- Anomaly: spike, drop, flat, missing, insufficient baseline, review, genuine usage, leak, meter fault, data error, billing hold, closure
- Correction: request, approval, rejection, source immutability, consumption recalc, already-billed adjustment, closed period, audit
- Water: source, manual supply, tank, tanker, partial quantity, duplicate, shortage, leak, vendor link, gate link, workorder link
- Electricity: common-area, provider bill link, anomaly, cost period, tariff version, billing handoff
- Solar: generation, missing data, night zero, daytime anomaly, maintenance, tariff version, estimated savings, historical report
- EV: reservation, conflict, expiry, start, stop, duplicate callbacks, out-of-order, offline charger, failed session, incomplete session, tariff, cost estimate, billing handoff, parking integration, workorder integration, move-out pending charge
- Privacy/Security: IDOR tests for all entities, role boundaries
- Failure/Recovery: hardware outage, finance outage, queue delay, worker crash, duplicate event, old schema, import interruption, notification failure, provider timeout, database conflict, offline replay

**Coverage Targets:**
- 100% statements, branches, functions, lines for all new/modified production code

**Quality Gates:**
```bash
npm run typecheck
npm run lint
npm run verify:types
npm run verify:clean-source
npm run verify:localized-ui
npm run verify:import-cycles
npm run verify:ui-structure
npm test
npm run test:coverage
```

---

## 4. Migration Strategy

### Phase 20 hardwareIntegration → Phase 21 utilities Migration

| Current | New Location | Notes |
|---------|-------------|-------|
| `smartMeterConnectorService.ingestReading()` | `readingService.ingestSmartMeterReading()` | Connector calls utility service |
| `smartMeterConnectorService.importReadings()` | `importService.commitImport()` | Import pipeline in utilities |
| `evChargingConnectorService.processSessionEvent()` | `evService.processHardwareSessionEvent()` | Hardware event → business session |
| SmartMeter types | `utilities/core/types/reading.types.ts` | Extended with full domain |
| EvCharging types | `utilities/core/types/ev.types.ts` | Split: business vs hardware |
| Screens | `utilities/` screens | Remove hardcoded IDs |
| Hooks | `utilities/core/hooks/` | New implementations |

### Backward Compatibility
- Phase 20 connector services call into Phase 21 utility services via typed interface
- HardwareIntegration API source delegates utility operations to Utilities API source
- Mock sources updated to use new services

---

## 5. Critical Invariants to Enforce (Automated Tests)

1. Hardware Device != Meter
2. Meter != MeterAssignment
3. Reading != Consumption
4. Consumption != Financial Charge
5. Source reading historically traceable
6. Correction never silently rewrites original
7. Manual/estimated/smart sources distinguishable
8. Zero != missing
9. Duplicate reading cannot duplicate consumption
10. Out-of-order reading cannot corrupt previous-reading selection
11. Decreasing reading → no negative consumption without reset/rollover
12. Meter replacement preserves old history
13. Meter reassignment preserves historical Unit relationship
14. Cross-society Meter assignment impossible
15. Import retry idempotent
16. Partial import reports errors accurately
17. Anomaly != confirmed leak
18. Outlier can block billing where configured
19. Utility correction after billing uses Finance adjustment path
20. Utility never mutates posted ledger
21. Same billing handoff cannot create duplicate charge
22. Missing move-out reading can block settlement
23. New occupant cannot inherit previous occupant's usage
24. Tanker arrival != delivery quantity
25. Tanker delivery uses Phase 16 Vendor
26. Tanker invoice/payment stays Finance/Procurement
27. Shared Meter without allocation rule → no Unit charges
28. Solar zero/no-data distinct
29. Solar savings use effective tariff/source
30. Unsupported carbon metric not invented
31. EV Charger Device != EV reservation/session business
32. EV session uses stable Resident/Unit/Vehicle IDs
33. Connector-provided residentName not trusted
34. Duplicate EV callbacks → one logical session
35. EV STOP-before-START reconciles
36. FAILED session preserves consumed energy
37. EV estimate != final bill
38. EV Finance handoff idempotent
39. EV never mutates ledger directly
40. EV reservation conflicts atomic
41. Reservation expiry server-side
42. Feature-disabled hardware → manual flow works
43. Unit consumption privacy-protected
44. Reports derive from authoritative utility records
45. Health Score receives typed metrics
46. Background jobs idempotent
47. Cross-society Utility IDOR impossible
48. No production path uses utility mock data
49. Hardcoded `dev-028` removed
50. Hardcoded `June 2026` billing-month removed

---

## 6. E2E Verification Scenarios (Must Pass)

| Scenario | Description | Key Assertions |
|----------|-------------|----------------|
| **A** Smart Water Billing | Smart meter 125→138.5 → 13.5 KL consumption → billing | Phase20 auth → Meter resolved → validated → consumption correct → tariff applied → Finance idempotent charge → resident traceable |
| **B** Water Anomaly/Leak | Tower A doubles vs baseline | ANOMALY created → billing hold → investigation → leak confirmed → WorkOrder → repair → anomaly outcome recorded → baseline restored |
| **C** Estimate Then Actual | Missing reading at cutoff → estimate → actual arrives | ESTIMATED marked → bill if policy allows → actual validated → estimate preserved → consumption corrected → Finance adjustment → original not edited |
| **D** Tanker Delivery | Order 10KL → Gate entry → verify 8.5KL | Gate linked → delivery=8.5KL → vendor/PO linked → invoice mismatch exposed → Finance reviews difference |
| **E** Move-Out Final Reading | Tenant moves 31 Oct, last reading 25 Oct | UTILITY_FINAL_READING_PENDING blocks clearance → final reading submitted → boundary consumption → charge/credit → clearance resumes |
| **F** Meter Replacement | M1: 99,850 → M2: 12 | M1 decommissioned, M2 created, continuity retained, NO calc 12-99850, M1 history preserved |
| **G** Solar Anomaly | Daytime generation drops | ANOMALY → WorkOrder → inverter fault → repair → production resumes, savings use actual tariff |
| **H** EV Charging | Resident books C1 → vehicle validated → START → 12.7 kWh → STOP → tariff → billing | Atomic reservation → entitlement check → hardware ack → session → energy derived → effective tariff → Finance once |
| **I** EV Out-of-Order | STOP before START | Both events preserved → externalSessionId reconciles → one session → correct energy/time → no duplicate billing |
| **J** Hardware Outage | Smart meter connector down | History works → manual/file available → health shows unavailable → no fake zero readings → core ops continue |

---

## 7. Files to Create/Modify Summary

### New Files (~60)
```
src/modules/utilities/core/types/utility.types.ts
src/modules/utilities/core/types/reading.types.ts
src/modules/utilities/core/types/consumption.types.ts
src/modules/utilities/core/types/anomaly.types.ts
src/modules/utilities/core/types/correction.types.ts
src/modules/utilities/core/types/billing.types.ts
src/modules/utilities/core/types/water.types.ts
src/modules/utilities/core/types/electricity.types.ts
src/modules/utilities/core/types/solar.types.ts
src/modules/utilities/core/types/ev.types.ts
src/modules/utilities/core/types/index.ts

src/modules/utilities/core/services/meterService.ts
src/modules/utilities/core/services/readingService.ts
src/modules/utilities/core/services/consumptionService.ts
src/modules/utilities/core/services/anomalyService.ts
src/modules/utilities/core/services/correctionService.ts
src/modules/utilities/core/services/billingService.ts
src/modules/utilities/core/services/importService.ts
src/modules/utilities/core/services/waterService.ts
src/modules/utilities/core/services/electricityService.ts
src/modules/utilities/core/services/solarService.ts
src/modules/utilities/core/services/evService.ts
src/modules/utilities/core/services/tariffService.ts

src/modules/utilities/core/repositories/utilities.repository.ts
src/modules/utilities/core/repositories/utilities.apiSource.ts
src/modules/utilities/core/repositories/utilities.mockSource.ts
src/modules/utilities/core/repositories/utilities.mapper.ts

src/modules/utilities/core/hooks/useMeters.ts
src/modules/utilities/core/hooks/useReadings.ts
src/modules/utilities/core/hooks/useConsumption.ts
src/modules/utilities/core/hooks/useAnomalies.ts
src/modules/utilities/core/hooks/useCorrections.ts
src/modules/utilities/core/hooks/useBilling.ts
src/modules/utilities/core/hooks/useImport.ts
src/modules/utilities/core/hooks/useWater.ts
src/modules/utilities/core/hooks/useElectricity.ts
src/modules/utilities/core/hooks/useSolar.ts
src/modules/utilities/core/hooks/useEV.ts

src/modules/utilities/screens/UtilitiesDashboardScreen.tsx
src/modules/utilities/screens/MeterListScreen.tsx
src/modules/utilities/screens/MeterDetailScreen.tsx
src/modules/utilities/screens/ReadingListScreen.tsx
src/modules/utilities/screens/ReadingDetailScreen.tsx
src/modules/utilities/screens/MeterReadingImportScreen.tsx
src/modules/utilities/screens/ImportPreviewScreen.tsx
src/modules/utilities/screens/ConsumptionScreen.tsx
src/modules/utilities/screens/AnomalyListScreen.tsx
src/modules/utilities/screens/AnomalyDetailScreen.tsx
src/modules/utilities/screens/CorrectionScreen.tsx
src/modules/utilities/screens/WaterDashboardScreen.tsx
src/modules/utilities/screens/TankerDeliveryScreen.tsx
src/modules/utilities/screens/WaterShortageScreen.tsx
src/modules/utilities/screens/ElectricityDashboardScreen.tsx
src/modules/utilities/screens/SolarDashboardScreen.tsx
src/modules/utilities/screens/EvDashboardScreen.tsx
src/modules/utilities/screens/EvReservationScreen.tsx
src/modules/utilities/screens/EvSessionDetailScreen.tsx
src/modules/utilities/screens/EvTariffScreen.tsx

src/app/navigation/UtilitiesStack.tsx
```

### Modified Files (~15)
```
src/modules/hardwareIntegration/services/smartMeterConnectorService.ts
src/modules/hardwareIntegration/services/evChargingConnectorService.ts
src/modules/hardwareIntegration/data/hardwareIntegration.apiSource.ts
src/modules/hardwareIntegration/data/hardwareIntegration.mockSource.ts
src/app/navigation/navigation.types.ts
src/core/featureFlags/featureFlags.ts
src/modules/accounting/data/accounting.apiSource.ts
```

### Removed Files (~12)
```
src/modules/hardwareIntegration/screens/SmartMeterDashboardScreen.tsx
src/modules/hardwareIntegration/screens/SmartMeterReadingDetailScreen.tsx
src/modules/hardwareIntegration/screens/MeterReadingImportPlaceholderScreen.tsx
src/modules/hardwareIntegration/screens/EvChargingDashboardScreen.tsx
src/modules/hardwareIntegration/screens/EvChargerDetailScreen.tsx
src/modules/hardwareIntegration/screens/EvChargingSessionPlaceholderScreen.tsx
src/modules/hardwareIntegration/hooks/useSmartMeterDashboard.ts
src/modules/hardwareIntegration/hooks/useSmartMeterReadingDetail.ts
src/modules/hardwareIntegration/hooks/useMeterReadingImport.ts
src/modules/hardwareIntegration/hooks/useEvChargingDashboard.ts
src/modules/hardwareIntegration/hooks/useEvChargerDetail.ts
src/modules/hardwareIntegration/hooks/useEvChargingSession.ts
```

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Finance integration complexity | Define strict `UtilityChargeInput` contract early; test idempotency thoroughly |
| Meter replacement continuity | Implement continuity boundary as first-class concept with tests |
| Out-of-order reading corruption | Deterministic previous-reading selection with comprehensive test matrix |
| EV session reconciliation | Use Phase 20 externalSessionId; test STOP-before-START extensively |
| Cross-society leakage | Enforce at service layer + database constraints + test every mutation |
| Performance at scale | Design indexes for societyId+meterId+readingAt; pagination; background aggregation |
| Migration from hardwareIntegration | Incremental: create utilities, delegate, then remove old screens/hooks |

---

## 9. Definition of Done Checklist

See spec §188 for complete checklist. Key gates:
- [ ] Dedicated `utilities` domain ownership defined
- [ ] Phase 20 remains Hardware owner
- [ ] Phase 7 remains Finance owner
- [ ] Phase 16 remains Asset/WorkOrder owner
- [ ] Meter stable ID, unique code, separate from Device
- [ ] Assignments effective-dated, replacement preserves history
- [ ] All reading sources work (smart, manual, import, estimated)
- [ ] Source timestamp + received timestamp preserved
- [ ] Units explicit, multiplier handled
- [ ] Duplicate detection deterministic
- [ ] Out-of-order handled
- [ ] Zero != missing
- [ ] Decreasing → reset/rollover review
- [ ] Source reading immutable
- [ ] Corrections versioned
- [ ] Import: real upload, validation, preview, duplicate handling, commit, error report, retry, idempotency, recovery
- [ ] Consumption: deterministic previous reading, replacement boundary, rollover, reset, estimates, versioned
- [ ] Anomaly: baseline explicit, insufficient history, anomaly≠leak, review, findings, billing hold, WorkOrder
- [ ] Water: source master, supply logs, tanker workflow, Vendor Phase 16, ordered vs delivered, Gate link, invoice link, shortage lifecycle, leak investigation, conservation reports
- [ ] Electricity: common-area, provider bill link, anomaly, tariff, billing input
- [ ] Solar: generation, history, anomalies, maintenance Phase 16, savings explicit tariff, no invented carbon
- [ ] Finance: typed handoff, idempotent, anomaly blocks charge, post-billing adjustment, closed-period, resident trace
- [ ] Move-out: final reading, missing blocks settlement, occupancy boundary, no blind inheritance
- [ ] EV: business Charger config separate, Vehicle Phase 11, resident server-derived, reservation, conflict prevention, expiry server-side, connector integrated, duplicate/out-of-order safe, incomplete reconciled, failed preserves usage, tariff effective-dated, estimate≠final, Finance handoff, Parking/WorkOrder integration, load-management readiness truthful
- [ ] Privacy: Unit consumption protected, EV history protected, cross-society IDOR blocked, platform support controlled, search/export safe
- [ ] Quality: background jobs idempotent, observability, retention, rare scenarios, no `any`/unsafe casts/TS suppressions, no hardcoded IDs, localization, accessibility, low-end verified, 100% coverage, all gates pass

---

## 10. Timeline Estimate

| Phase | Duration |
|-------|----------|
| Type System & Meter Master | 1 week |
| Reading Pipeline + Manual/Import | 1.5 weeks |
| Consumption Engine + Anomaly | 1.5 weeks |
| Correction + Water + Electricity + Solar | 1.5 weeks |
| Tariff + Finance Integration + Move-Out | 1 week |
| EV Business Domain | 1.5 weeks |
| UI Migration + Navigation + Feature Flags | 1 week |
| Background Jobs + Reports + Observability | 1 week |
| Privacy/Security/Audit + Testing | 1 week |
| **Total** | **~11 weeks** |

---

## 11. Deferred / Not In Scope (Per Spec §189)

- AI leakage prediction as authority
- AI demand forecasting as authority
- Automatic AI-generated utility charges
- Advanced autonomous demand response
- Unsafe autonomous EV load shedding
- Grid trading / virtual power plant
- Complex carbon-credit accounting
- Public resident consumption rankings
- Facial/occupancy inference from energy usage
- Smart-home appliance control
- Society Digital Twin
- Cross-Society energy benchmarking
- External government utility integrations (unless connector exists)

These remain as clean future boundaries only.
