# Phase 22 — Deterministic Automation, Rules Engine, Workflow Orchestration & Permission-Safe AI Assistance

## Implementation Plan

---

## 1. Current State Assessment

### Three Overlapping Modules

| Module | Status | Key Problems |
|--------|--------|--------------|
| **automation/** | NOT_IMPLEMENTED | All API methods return `NOT_IMPLEMENTED`. 6 placeholder screens with free-text `AutomationPreview` model. Mock audit uses "Mock User". |
| **smartAutomation/** | NOT_IMPLEMENTED | `smartAutomationApiSource` throws "Not implemented". Simple `AutomationController` model (WATER_MOTOR/STREET_LIGHT/GATE_SENSORS) with unsafe `toggleController`. |
| **aiServices/** | PARTIAL (client-side) | `aiClassificationEngine` runs in React Native (localStorage), has hardcoded `PRIORITY_RULES`/`SLA_HOURS`, endpoint/apiKey in client config, mock fallback masquerades as AI. |

### Core Problems to Fix (per spec)

1. **automation.apiSource** returns `NOT_IMPLEMENTED` for all 7 capabilities
2. **smartAutomation.apiSource** throws `Not implemented`
3. **Placeholder screens** exist but no real behavior
4. **AutomationPreview** is a generic free-text model - not production-ready
5. **Mock audit** uses `actorName: "Mock User"` - production must use authenticated session
6. **simple AutomationController** conflates hardware device with automation rule
7. **generic `toggleController(id)`** exposes unsafe physical device control
8. **unknown-controller fallback** returns first mock instead of `CONTROLLER_NOT_FOUND`
8. **UI navigates back immediately** without authoritative success confirmation
9. **AI mockClassification** fallback runs on provider failure and pretends to be AI
10. **Hardcoded PRIORITY_RULES/SLA_HOURS** in AI module - Helpdesk config is authoritative
11. **AI endpoint/apiKey in client** - must be server-side only
12. **Generic `metadata: JsonObject`** - no data minimization
13. **Unsafe casts** (`as any`, `as unknown as JsonObject`)
14. **AI jobs in localStorage** - must be server-side authoritative

---

## 2. Domain Ownership Resolution

### Final Ownership

| Concern | Owner | Notes |
|---------|-------|-------|
| **Automation Rules Engine** | `automation/` (canonical) | Rule definition, versioning, triggers, conditions, actions, execution, approval, retry, dead-letter |
| **AI Platform** | `aiServices/` (refactored to server-side) | Provider abstraction, model config, prompt/template versioning, structured output validation, human review, privacy filtering, circuit breaker |
| **Hardware Automation** | `hardwareIntegration/` (Phase 20) | Device commands, safety interlocks, acknowledgement, reconciliation |
| **Smart Automation Screens** | `automation/` | Migrate from `smartAutomation/` screens; remove `smartAutomation/` module |
| **Capability-Specific AI** | `automation/` hooks into `aiServices/` | Complaint routing, notice drafting, document search, bill explanation, meeting summary, maintenance risk |

### Module Structure After Consolidation

```
src/modules/automation/
├── core/
│   ├── types/
│   │   ├── rule.types.ts           # AutomationRule, RuleVersion, Trigger, Condition, Action
│   │   ├── execution.types.ts      # AutomationExecution, ActionAttempt, Approval, Suppression
│   │   ├── trigger.types.ts        # DomainEventTrigger, ScheduleTrigger, ThresholdTrigger
│   │   └── index.ts
│   ├── services/
│   │   ├── ruleService.ts          # CRUD, validation, activation, versioning
│   │   ├── executionService.ts     # Trigger evaluation, condition eval, action dispatch
│   │   ├── triggerRegistry.ts      # Event subscriptions, schedule management
│   │   ├── conditionEngine.ts      # Typed condition evaluation
│   │   ├── actionDispatcher.ts     # Action allowlist to domain service ports
│   │   ├── approvalService.ts      # Per-execution & rule-activation approval
│   │   ├── suppressionService.ts   # Cooldown, dedupe, loop prevention
│   │   ├── retryService.ts         # Retry, dead-letter, replay
│   │   ├── dryRunService.ts        # Simulation without side effects
│   │   └── index.ts
│   ├── repositories/
│   │   ├── automation.repository.ts
│   │   ├── automation.apiSource.ts
│   │   ├── automation.mockSource.ts
│   │   └── automation.mapper.ts
│   └── hooks/
│       ├── useAutomationRules.ts
│       ├── useAutomationExecutions.ts
│       ├── useRuleBuilder.ts
│       └── index.ts
├── capabilities/
│   ├── complaintRouting/
│   │   ├── complaintRoutingService.ts
│   │   ├── complaintRouting.types.ts
│   │   └── useComplaintRouting.ts
│   ├── noticeDrafting/
│   │   ├── noticeDraftingService.ts
│   │   ├── noticeDrafting.types.ts
│   │   └── useNoticeDrafting.ts
│   ├── documentSearch/
│   │   ├── documentSearchService.ts
│   │   ├── documentSearch.types.ts
│   │   └── useDocumentSearch.ts
│   ├── billExplanation/
│   │   ├── billExplanationService.ts
│   │   ├── billExplanation.types.ts
│   │   └── useBillExplanation.ts
│   ├── meetingSummary/
│   │   ├── meetingSummaryService.ts
│   │   ├── meetingSummary.types.ts
│   │   └── useMeetingSummary.ts
│   ├── maintenanceRisk/
│   │   ├── maintenanceRiskService.ts
│   │   ├── maintenanceRisk.types.ts
│   │   └── useMaintenanceRisk.ts
│   └── index.ts
├── screens/
│   ├── AutomationDashboardScreen.tsx         (replaces smartAutomation dashboard)
│   ├── RuleBuilderScreen.tsx
│   ├── RuleDetailScreen.tsx
│   ├── ExecutionHistoryScreen.tsx
│   ├── ExecutionDetailScreen.tsx
│   ├── ApprovalQueueScreen.tsx
│   ├── DeadLetterScreen.tsx
│   ├── ComplaintRoutingScreen.tsx            (replaces placeholder)
│   ├── NoticeDraftingScreen.tsx              (replaces placeholder)
│   ├── DocumentSearchScreen.tsx              (replaces placeholder)
│   ├── BillExplanationScreen.tsx             (replaces placeholder)
│   ├── MeetingSummaryScreen.tsx              (replaces placeholder)
│   ├── MaintenanceRiskScreen.tsx             (replaces placeholder)
│   └── DryRunScreen.tsx
└── index.ts

src/modules/aiServices/ (refactored - server-side only interfaces)
├── core/
│   ├── types/
│   │   ├── aiProvider.types.ts       # AIProvider, ModelConfig, PromptTemplate
│   │   ├── aiRequest.types.ts        # AIRequest, AIResponse, AIConfidence, AIEvidence
│   │   └── index.ts
│   ├── providers/
│   │   ├── aiProviderPort.ts         # Abstract provider interface
│   │   ├── openAIProvider.ts         # Server-side implementation
│   │   ├── anthropicProvider.ts      # Server-side implementation
│   │   └── localFallbackProvider.ts  # Explicit RULE_FALLBACK (not AI)
│   ├── services/
│   │   ├── aiOrchestrationService.ts # Request routing, validation, privacy
│   │   ├── promptTemplateService.ts  # Versioned templates
│   │   ├── modelConfigService.ts     # Server-side model management
│   │   ├── humanReviewService.ts     # Review workflow
│   │   ├── evaluationService.ts      # Quality metrics, drift detection
│   │   └── index.ts
│   └── index.ts
```

---

## 3. Implementation Steps

### Step 1: Define Canonical Type System (Week 1)

**Files to create:**
- `src/modules/automation/core/types/rule.types.ts`
- `src/modules/automation/core/types/execution.types.ts`
- `src/modules/automation/core/types/trigger.types.ts`
- `src/modules/automation/core/types/index.ts`
- `src/modules/aiServices/core/types/aiProvider.types.ts`
- `src/modules/aiServices/core/types/aiRequest.types.ts`
- `src/modules/aiServices/core/types/index.ts`

**Key Types:**

```typescript
// Rule Types
type AutomationRuleStatus = 'DRAFT' | 'VALIDATING' | 'READY' | 'ACTIVE' | 'PAUSED' | 'DISABLED' | 'INVALID' | 'ARCHIVED';
type AutomationTriggerType = 'DOMAIN_EVENT' | 'SCHEDULE' | 'THRESHOLD' | 'STATE_DURATION' | 'MANUAL_TEST';
type AutomationConditionOperator = 'EQUALS' | 'NOT_EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN' | 'EXISTS' | 'CONTAINS';
type AutomationActionType = 'SEND_NOTIFICATION' | 'CREATE_NOTICE_DRAFT' | 'CREATE_HELPDESK_ESCALATION' | 'CREATE_WORK_ORDER_REQUEST' | 'CREATE_APPROVAL_REQUEST' | 'REQUEST_HARDWARE_COMMAND' | 'REQUEST_AI_ANALYSIS' | 'AI_DRAFT' | 'HUMAN_APPROVAL_REQUEST';
type AutomationActionRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'PROHIBITED_AUTO';
type AutomationExecutionStatus = 'TRIGGERED' | 'EVALUATING' | 'SUPPRESSED' | 'ACTIONABLE' | 'WAITING_APPROVAL' | 'EXECUTING' | 'COMPLETED' | 'PARTIAL' | 'FAILED' | 'CANCELLED' | 'DEAD_LETTERED';
type AutomationApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

// AI Types
type AIProviderStatus = 'HEALTHY' | 'DEGRADED' | 'DOWN' | 'CIRCUIT_OPEN';
type AIJobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REQUIRES_REVIEW' | 'CANCELLED';
type AIReviewStatus = 'PENDING' | 'ACCEPTED' | 'CORRECTED' | 'REJECTED';
type AIResultSource = 'AI_PROVIDER' | 'RULE_FALLBACK' | 'MANUAL';
type AIConfidenceBand = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
```

### Step 2: Build Rule Engine Core (Week 1-2)

**Files:**
- `src/modules/automation/core/services/ruleService.ts`
- `src/modules/automation/core/services/conditionEngine.ts`
- `src/modules/automation/core/services/actionDispatcher.ts`
- `src/modules/automation/core/services/triggerRegistry.ts`

**Features:**
- Rule CRUD with optimistic concurrency (version/timestamp)
- Schema validation for trigger/conditions/actions
- Dependency validation (feature flags, templates, domain integrations)
- Loop analysis (static + runtime causal chain)
- Dry-run simulation
- Versioning: edit creates new draft; activation freezes version
- Effective dating (society timezone)
- Activation approval workflow

### Step 3: Execution Engine (Week 2)

**Files:**
- `src/modules/automation/core/services/executionService.ts`
- `src/modules/automation/core/services/suppressionService.ts`
- `src/modules/automation/core/services/approvalService.ts`

**Features:**
- Event deduplication: ruleVersion + triggerEventId + logicalExecutionKey
- Condition evaluation with snapshot (which passed/failed)
- Action dispatch via allowlisted domain ports
- Cooldown/suppression windows (semantic dedupe)
- Per-execution approval (WAITING_APPROVAL state)
- Partial execution tracking (each action separate)
- Exactly-once business effect via idempotency keys

### Step 4: Retry, Dead Letter, Replay (Week 2-3)

**Files:**
- `src/modules/automation/core/services/retryService.ts`

**Features:**
- Retry only safe failures (notification timeout, not validation rejection)
- Dead letter after max retries: inspect/retry/replay/close with audit
- Replay preserves idempotency (retry failed actions only)
- Compensation: use domain-defined reversal, not generic rollback

### Step 5: AI Platform Refactor (Week 3-4)

**Files:**
- `src/modules/aiServices/core/providers/aiProviderPort.ts`
- `src/modules/aiServices/core/providers/openAIProvider.ts` (server-side)
- `src/modules/aiServices/core/providers/localFallbackProvider.ts`
- `src/modules/aiServices/core/services/aiOrchestrationService.ts`
- `src/modules/aiServices/core/services/promptTemplateService.ts`
- `src/modules/aiServices/core/services/modelConfigService.ts`
- `src/modules/aiServices/core/services/humanReviewService.ts`
- `src/modules/aiServices/core/services/evaluationService.ts`

**Key Changes:**
- Move all provider credentials, model config, prompt templates to server-side
- `localFallbackProvider` returns `source: 'RULE_FALLBACK'` explicitly
- Provider circuit breaker (timeout, retry, rate limit, observability)
- Structured output validation (reject unknown enums)
- Data minimization: permission check BEFORE retrieval
- Prompt injection defense: untrusted content never becomes system instruction
- Human review workflow with authenticated reviewer
- Stale result detection (source version comparison)

### Step 6: Capability Implementations (Week 4-6)

Each capability gets typed request/response, evidence references, confidence, review path.

| Capability | Key Requirements |
|------------|------------------|
| **Smart Complaint Routing (O25)** | Minimized context to structured category candidates + confidence to operator review to Helpdesk deterministic SLA |
| **Automated Notice Drafting** | Permission-filtered context to AI draft to factual validation display to human edit to Phase 12 publish |
| **Smart Document Search** | Permission check BEFORE retrieval to prompt injection isolation to source citations to "not found" if unsupported |
| **Bill Explanation** | Phase 7 authoritative charges to deterministic diff to optional AI plain-language to source charge refs |
| **Meeting Summary** | Authorized notes/transcript to draft summary + action items to human review to Governance final |
| **Maintenance Risk Alerts** | Asset/WorkOrder/AMC metrics to risk signal + confidence + evidence to advisory only to WorkOrder via explicit action |

### Step 7: Physical Automation Safety (Week 6)

**Files:**
- Integration with `hardwareIntegration` services

**Safety Requirements:**
- Only allowlisted actions (street light schedule, water pump with interlocks)
- Phase 20 command service: command ID, acknowledgement, reconciliation
- Pre-command checks: sensor fresh, device healthy, interlocks satisfied, no manual lockout
- On failure: `BLOCKED_BY_STALE_SAFETY_INPUT`, no fake state
- Gate sensors to alerts only, NEVER authorization bypass

### Step 8: UI Migration (Week 6-7)

**Replace placeholder screens with real implementations:**
- `AutomationDashboardScreen` from `smartAutomation` (real rule list)
- `RuleBuilderScreen` - visual builder: WHEN/IF/THEN/APPROVAL/COOLDOWN/ACTIVE PERIOD
- `RuleDetailScreen` - version history, executions, approvals
- `ExecutionHistoryScreen` - filterable, shows partial/failed/suppressed
- `ExecutionDetailScreen` - condition results, action attempts, correlation chain
- `ApprovalQueueScreen` - pending approvals with stale-state revalidation
- `DeadLetterScreen` - inspect/retry/discard
- `DryRunScreen` - simulate against current data

**Capability screens** (replace placeholders):
- `ComplaintRoutingScreen` - real AI integration
- `NoticeDraftingScreen` - draft to review to publish
- `DocumentSearchScreen` - permission-safe search
- `BillExplanationScreen` - deterministic + AI layer
- `MeetingSummaryScreen` - draft vs official
- `MaintenanceRiskScreen` - evidence-backed alerts

### Step 9: Navigation & Feature Flags (Week 7)

**Navigation:**
- New `AutomationStackParamList` in `navigation.types.ts`
- `AutomationStack.tsx` with all screens

**Feature Flags:**
```typescript
smartAutomation: true,           // master
aiAssistance: true,              // master
smartComplaintRouting: true,
automatedNoticeDrafting: true,
smartDocumentSearch: true,
billExplanation: true,
meetingSummary: true,
maintenanceRiskAlerts: true,
vendorIntelligence: false,
collectionIntelligence: false,
operationsInsights: false,
physicalAutomation: false,       // requires explicit config
```

### Step 10: Background Jobs & Scheduler (Week 7)

**Jobs (server-side):**
- ScheduledTriggerJob: cron evaluation (no mobile timers)
- StaleResultCleanupJob: mark expired AI results
- DeadLetterProcessingJob: retry eligible
- LoopPreventionMonitor: circuit breaker on execution storms
- ModelDriftEvaluationJob: acceptance/correction rates

### Step 11: Observability & Audit (Week 7-8)

**Metrics:**
- Active rule count, execution count, success/partial/failed/suppressed
- Dead letter depth, loop prevention triggers
- AI request rate, latency, provider errors, circuit state
- Low-confidence rate, human acceptance/correction/rejection rates
- Cost/usage by capability/model/society

**Audit Events:**
- `AUTOMATION_RULE_CREATED/VERSION_CREATED/ACTIVATED/PAUSED/DISABLED`
- `AUTOMATION_EXECUTION_APPROVED/REJECTED`
- `AUTOMATION_HIGH_RISK_ACTION_REQUESTED`
- `AI_ANALYSIS_REQUESTED/COMPLETED/FAILED`
- `AI_REVIEW_ACCEPTED/CORRECTED/REJECTED`

---

## 4. Migration Strategy

### Phase 20 Integration Points

| Current | New Integration |
|---------|-----------------|
| `smartAutomation` controllers | `automation` physical automation actions via `hardwareIntegration.boomBarrierService`/`deviceRegistryService` |
| `automation` placeholder hooks | Real capability hooks calling `aiServices` server endpoints |
| `aiClassificationEngine` (client) | Server-side `aiOrchestrationService`; mobile calls typed API |

### Backward Compatibility
- Deprecate `smartAutomation/` module; migrate screens to `automation/`
- `automation.apiSource` implements real methods (no more `NOT_IMPLEMENTED`)
- Mock sources updated for test/demo mode only

---

## 5. Critical Test Suites

| Suite | Focus |
|-------|-------|
| `automation-rules` | CRUD, versioning, validation, activation, effective dates, rollback, permissions |
| `automation-execution` | Trigger, conditions, suppression, cooldown, dedupe, actions, partial, retry, dead-letter, replay, cancellation, idempotency, loop prevention |
| `automation-eventing` | Duplicate events, out-of-order, old schema, event storm, cross-society, worker crash, queue recovery |
| `ai-platform` | Provider success/timeout/unavailable, circuit breaker, rate limit, malformed output, unknown enum, schema violation, low confidence, model/prompt version, failover, privacy |
| `complaint-ai` | High/low confidence, manual correction, provider failure, stale complaint, safety complaint, SLA authority, cross-society |
| `notice-ai` | Draft, missing fact, translation, review, edit, publication boundary, untrusted input |
| `document-search-ai` | Authorized/restricted/historical docs, prompt injection, expired, new version, citations, not-found |
| `bill-explanation` | Own/other unit, adjustment, reversal, utility charge, payment pending, AI outage fallback |
| `meeting-summary` | Summary, action proposal, decision boundary, private meeting, prompt injection |
| `maintenance-risk` | Historical data, stale data, low confidence, already repaired, duplicate alert, WorkOrder boundary |
| `hardware-automation` | Device healthy/offline, stale sensor, manual lockout, duplicate command, timeout, interlock, emergency |
| `privacy-security` | IDOR tests, tenant isolation, former occupant, document/financial/chat privacy, client secret leakage |

---

## 6. Quality Gates

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

**Coverage Target:** 100% statements/branches/functions/lines for all new/modified Phase 22 code.

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| AI provider credentials in client | Server-side only architecture; build-time check for `apiKey` in client bundle |
| Mock fallback masquerading as AI | Explicit `RULE_FALLBACK` source type; audit distinguishes |
| Automation loops | Static loop analysis + runtime causal chain tracking + depth limit |
| Cross-society data leakage | Tenant isolation at service layer + database constraints + test every mutation |
| Physical automation safety | Phase 20 command service with pre-checks; no generic toggle |
| Performance at scale | Indexed trigger subscriptions; bounded concurrency; backpressure |

---

## 7. Files Summary

### New Files (~50)
```
src/modules/automation/core/types/rule.types.ts
src/modules/automation/core/types/execution.types.ts
src/modules/automation/core/types/trigger.types.ts
src/modules/automation/core/types/index.ts

src/modules/automation/core/services/ruleService.ts
src/modules/automation/core/services/executionService.ts
src/modules/automation/core/services/triggerRegistry.ts
src/modules/automation/core/services/conditionEngine.ts
src/modules/automation/core/services/actionDispatcher.ts
src/modules/automation/core/services/approvalService.ts
src/modules/automation/core/services/suppressionService.ts
src/modules/automation/core/services/retryService.ts
src/modules/automation/core/services/dryRunService.ts

src/modules/automation/core/repositories/automation.repository.ts
src/modules/automation/core/repositories/automation.apiSource.ts
src/modules/automation/core/repositories/automation.mockSource.ts
src/modules/automation/core/repositories/automation.mapper.ts

src/modules/automation/core/hooks/useAutomationRules.ts
src/modules/automation/core/hooks/useAutomationExecutions.ts
src/modules/automation/core/hooks/useRuleBuilder.ts

src/modules/automation/capabilities/complaintRouting/complaintRoutingService.ts
src/modules/automation/capabilities/complaintRouting/complaintRouting.types.ts
src/modules/automation/capabilities/complaintRouting/useComplaintRouting.ts
src/modules/automation/capabilities/noticeDrafting/noticeDraftingService.ts
src/modules/automation/capabilities/noticeDrafting/noticeDrafting.types.ts
src/modules/automation/capabilities/noticeDrafting/useNoticeDrafting.ts
src/modules/automation/capabilities/documentSearch/documentSearchService.ts
src/modules/automation/capabilities/documentSearch/documentSearch.types.ts
src/modules/automation/capabilities/documentSearch/useDocumentSearch.ts
src/modules/automation/capabilities/billExplanation/billExplanationService.ts
src/modules/automation/capabilities/billExplanation/billExplanation.types.ts
src/modules/automation/capabilities/billExplanation/useBillExplanation.ts
src/modules/automation/capabilities/meetingSummary/meetingSummaryService.ts
src/modules/automation/capabilities/meetingSummary/meetingSummary.types.ts
src/modules/automation/capabilities/meetingSummary/useMeetingSummary.ts
src/modules/automation/capabilities/maintenanceRisk/maintenanceRiskService.ts
src/modules/automation/capabilities/maintenanceRisk/maintenanceRisk.types.ts
src/modules/automation/capabilities/maintenanceRisk/useMaintenanceRisk.ts

src/modules/automation/screens/AutomationDashboardScreen.tsx
src/modules/automation/screens/RuleBuilderScreen.tsx
src/modules/automation/screens/RuleDetailScreen.tsx
src/modules/automation/screens/ExecutionHistoryScreen.tsx
src/modules/automation/screens/ExecutionDetailScreen.tsx
src/modules/automation/screens/ApprovalQueueScreen.tsx
src/modules/automation/screens/DeadLetterScreen.tsx
src/modules/automation/screens/ComplaintRoutingScreen.tsx
src/modules/automation/screens/NoticeDraftingScreen.tsx
src/modules/automation/screens/DocumentSearchScreen.tsx
src/modules/automation/screens/BillExplanationScreen.tsx
src/modules/automation/screens/MeetingSummaryScreen.tsx
src/modules/automation/screens/MaintenanceRiskScreen.tsx
src/modules/automation/screens/DryRunScreen.tsx

src/modules/aiServices/core/types/aiProvider.types.ts
src/modules/aiServices/core/types/aiRequest.types.ts
src/modules/aiServices/core/types/index.ts
src/modules/aiServices/core/providers/aiProviderPort.ts
src/modules/aiServices/core/providers/openAIProvider.ts
src/modules/aiServices/core/providers/localFallbackProvider.ts
src/modules/aiServices/core/services/aiOrchestrationService.ts
src/modules/aiServices/core/services/promptTemplateService.ts
src/modules/aiServices/core/services/modelConfigService.ts
src/modules/aiServices/core/services/humanReviewService.ts
src/modules/aiServices/core/services/evaluationService.ts

src/app/navigation/AutomationStack.tsx
```

### Modified Files (~10)
```
src/modules/automation/data/automation.apiSource.ts       # Real implementations
src/modules/automation/data/automation.mockSource.ts      # Test/demo only
src/modules/automation/index.ts                           # Export new module
src/app/navigation/navigation.types.ts                    # AutomationStackParamList
src/core/featureFlags/featureFlags.ts                     # New capability flags
src/modules/accounting/data/accounting.apiSource.ts       # Accept AI suggestions
src/modules/helpdesk/data/helpdesk.apiSource.ts           # Accept AI category suggestions
src/modules/hardwareIntegration/data/hardwareIntegration.apiSource.ts  # Physical automation
```

### Removed Files (~15)
```
src/modules/smartAutomation/ (entire module)
src/modules/automation/screens/*PlaceholderScreen.tsx (6 files)
src/modules/automation/hooks/use*Preview.ts (6 files)
src/modules/automation/components/AutomationPreviewPanel.tsx
src/modules/aiServices/aiClassificationEngine.ts (client-side)
src/modules/aiServices/useAIClassification.ts
```

---

## 8. Timeline Estimate

| Phase | Duration |
|-------|----------|
| Type System & Rule Engine Core | 2 weeks |
| Execution Engine + Retry/Dead Letter | 1.5 weeks |
| AI Platform Refactor (server-side) | 2 weeks |
| 6 Capability Implementations | 3 weeks |
| Physical Automation Safety | 1 week |
| UI Migration (13 screens) | 2 weeks |
| Navigation, Feature Flags, Jobs | 1 week |
| Observability, Audit, Testing | 1.5 weeks |
| **Total** | **~14 weeks** |

---

## 9. Deferred / Not In Scope (Per Spec §180)

- Fully autonomous AI Society Manager
- General-purpose autonomous agent
- Arbitrary tool execution / natural-language SQL
- Automatic financial decisions / NOC issuance / resident approval
- AI facial recognition / security decisions / legal judgement
- Resident/staff/committee scoring
- Unrestricted predictive policing
- Arbitrary no-code scripting / outbound webhooks
- Society Digital Twin / Knowledge Graph
- AI investment advisor

Phase 22 builds the safe foundation only.
