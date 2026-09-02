# Society OS Mobile — Implementation-Aligned Product Specification

Version: 3.0 working baseline  
Audit date: 19 August 2026  
Code baseline: `main` at `b79d206`  
Platform baseline: Expo SDK 54, React Native 0.81.5, React 19.1, TypeScript 5.9  
Related documents: `docs/blueprint_text.txt` (product vision and intended scope), `walkthrough.md` (Milestone 13 visual-system work)

## 1. Purpose and authority

This document reconciles the original Society OS v2.0 blueprint with the mobile code that exists today. It is the current source of truth for:

- what is present in the mobile repository;
- what can be demonstrated with mock or local data;
- what has an API contract but still needs a working backend;
- what is only a placeholder or integration-readiness experience;
- what the original blueprint still requires; and
- what must be completed before any feature is called production-ready.

The v2.0 blueprint remains authoritative for the product vision and business requirements. This document takes precedence for implementation status. Code remains authoritative if this document becomes stale.

## 2. Executive conclusion

The previous documentation is directionally correct but no longer sufficient as a delivery-status document.

The codebase is broader than the v2.0 catalogue. It now contains dedicated mobile experiences for eight application modes, multi-home resident identity, household and residence lifecycle management, domestic-help controls, community marketplace and peer exchange, detailed compliance operations, platform administration, hardware operations, localization, accessibility, notification infrastructure and contextual resident insights.

At the same time, the implementation is less production-complete than the number of screens suggests. The default data-source mode is `mock`; fallback to mock is enabled; numerous API sources explicitly report that integration is not implemented; real payments, real notifications, real file upload, real biometric integration, smart automation and hardware control are disabled. Therefore, “screen exists” or the internal registry status `IMPLEMENTED` currently means frontend/demo workflow coverage, not end-to-end production readiness.

The release should currently be described as a broad, testable mobile prototype and frontend integration foundation—not as a production-complete society-management platform.

## 3. Evidence reviewed

This audit used the following implementation evidence:

- root and role-specific navigation registrations;
- module screens, hooks, repositories, DTOs, mappers and mock stores;
- data-source configuration and API clients;
- feature-flag defaults;
- role and permission types/matrices;
- the internal 142-item blueprint feature registry;
- Expo native capability usage;
- automated tests and TypeScript verification; and
- the v2.0 blueprint and Milestone 13 walkthrough.

Repository indicators at the audit baseline:

| Indicator | Observed value | Interpretation |
|---|---:|---|
| TypeScript/TSX source files | 3,969 | Large frontend surface |
| Screen components | 607 | Includes real workflows, demos, alternate flows and placeholders |
| Navigation screen declarations | 576 | Broad route coverage; not proof of backend completion |
| Test files | 197 | Meaningful automated coverage, but not a release certification |
| Mock-related files | 316 | Mock-first behavior is a major part of the current app |
| Repository files | 61 | Domain/repository separation exists in many modules |
| API-source files | 54 | API contracts are partly implemented and partly stubbed |
| Configured feature flags | 209 | 133 enabled and 76 disabled after merging grouped and explicit defaults |

## 4. Status vocabulary

All future documentation, tickets and release reports must use these statuses.

| Status | Definition |
|---|---|
| Implemented — production-integrated | UI, validation, repository, live backend/integration, authorization, persistence, failure handling and required tests are working in the target environment. |
| Frontend complete — mock-backed | The user journey can be exercised using mock/local data. Backend persistence or external delivery is not proven. This is the most common current status. |
| API contract ready | Endpoints, DTOs/mappers or API calls exist, but a reachable compatible backend and end-to-end verification are not proven. |
| Partial | Some important steps work, but one or more required branches, roles, states or operational controls are missing. |
| Placeholder/readiness only | The UI explains or previews a future capability; it does not perform the real operation. |
| Planned | Required by the product specification but no usable code path was verified. |
| Disabled | Code may exist but the default feature flag prevents normal release access. |

The internal `blueprintFeatureRegistry.ts` uses `IMPLEMENTED` for 135 of its 142 entries. In this document those entries are interpreted as frontend/mock implementation unless live integration evidence exists.

## 5. Current application architecture

### 5.1 Application modes

The root navigator exposes eight application surfaces:

| Application mode | Primary users | Current scope |
|---|---|---|
| App Mode Selector | Developers/demo users | Selects the role-specific application experience. This is not production authentication-based routing. |
| Resident App | Owner, tenant, family member, authorized occupant | Authentication/onboarding, dashboard, household, visitors, bills, complaints, notices, documents, NOCs, parking, facilities, community, governance, emergency and profile. |
| Guard App | Guard and security supervisor | Expected visitor lookup, validation, gate entry, staff check-in, activity log, offline queue UI, emergencies, handover and resident messaging. |
| Facility Manager App | Facility operations team | Vendors, AMC, assets, preventive maintenance, work orders, inventory, purchase requests, compliance and staff attendance. |
| Society Admin App | Committee/society office | Society setup, units, resident approvals, notices, complaints, audit views, attendance and department chat. |
| Treasurer App | Treasurer/accounting team | Billing cycles, charge heads, draft and published bills, manual payments, receipts, ledgers and defaulters. |
| Super Admin App | Platform operator | Society onboarding, flags, support, analytics, commercial-control and platform-operation screens; default flags disable this surface’s features. |
| Hardware App | Authorized technical operator | Device registry, RFID/ANPR/boom-barrier/CCTV/smart-meter/EV readiness, logs, permissions and audit views; real control is disabled. |

### 5.2 Data architecture

The app has a useful repository boundary with mock and API sources. It supports `mock`, `api` and `hybrid` data-source modes through `EXPO_PUBLIC_DATA_SOURCE_MODE`. The default is `mock`, module fallback to mock is allowed, mock latency is enabled and mock error injection is disabled.

The shared API client already supports:

- bearer tokens;
- society, unit, role and resident-profile request context headers;
- correlation IDs;
- idempotency keys;
- request timeout and cancellation;
- normalized API envelopes and errors; and
- API version/base URL configuration.

This is integration-ready architecture, not proof of a deployed backend. Every module must be verified individually in `api` mode before release.

### 5.3 Security and permission architecture

The frontend defines 17 roles, including owner, tenant, family, guard, supervisor, facility manager, committee roles, treasurer, society admin, super admin, auditor, vendor and staff. It also defines granular permissions for financial, resident, document, messaging, governance, compliance, platform and hardware actions.

Frontend route guards and permission checks improve the UI but do not satisfy the blueprint’s security requirement on their own. The backend must independently enforce tenant isolation, society/unit scope, active role, object ownership, sensitive-document access and auditability.

### 5.4 Device and experience foundation

Verified mobile foundations include:

- Expo SDK 54 configuration for iOS, Android and web;
- phone and tablet orientation/support;
- light, dark and system appearance;
- shared design tokens and responsive layouts;
- generated Marathi and Hindi localization resources in addition to English message sources;
- camera, image picker and document picker abstractions;
- notification permission and handler infrastructure;
- secure token storage;
- calendar integration for confirmed facility reservations;
- network awareness in facility booking;
- accessibility and language settings screens; and
- standardized loading, empty, error, modal and form patterns.

These capabilities still require device-level acceptance testing across supported OS versions.

## 6. Corrected feature catalogue and implementation status

Unless explicitly stated otherwise, “frontend complete” below means mock/local behavior is available and production backend readiness is unverified.

### 6.1 Identity, residence and household foundation

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Resident authentication and onboarding | Frontend complete / API contract partly ready | Login, registration, OTP verification, residence onboarding, authentication and access screens; session/token infrastructure | Real identity provider/OTP, abuse controls, recovery, device sessions and end-to-end backend verification |
| Multi-home resident context | Frontend complete — mock-backed | Active society/unit/role context, memberships and home switching | Server-owned memberships, conflict handling, revocation and migration tests |
| Residence access lifecycle | Frontend complete — mock-backed | Link overview, requirements, owner consent, submission review, approval progress, decision, renewal and suspension resolution | Live approval workflow, signed QR semantics, expiry and revocation enforcement |
| Household management | Frontend complete — mock-backed | Family, tenant, authorized occupant, rental, short-stay/guest and access-related screens | Backend persistence, consent, invitation delivery and policy enforcement |
| Society hierarchy and unit master | Frontend complete — mock-backed | Hierarchy, tower/wing/floor setup, unit master/detail, import preview, occupancy and configuration | Real import file processing, duplicate transactions, rollback, authorization and audit |
| Owner/tenant profiles and KYC | Frontend complete — mock-backed | Directory, owner/tenant detail, family, vehicles, KYC, approval queue and access status | Real document verification, approval policy, data retention and backend authorization |
| Owner/tenant/occupancy history | Frontend complete — mock-backed | Occupancy timeline, previous owners/tenants, document archive, move-in/out and access activation/revocation flows | Immutable history model, migration, legal retention, backend audit and actual access revocation |

Important addition beyond v2.0: the code models a resident as a portable identity with memberships, multiple homes and role-specific context, rather than only as a profile attached to one flat.

### 6.2 Visitor, gate, parcel and security operations

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Resident visitor creation | Frontend complete — mock-backed | Visitor creation and QR/OTP display flows | Secure token generation, delivery, expiry, replay prevention and backend persistence |
| Guard visitor operations | Frontend complete — mock-backed | Expected list, search, verification, record/manual/quick entry and activity logs | Real validation service, gate/device identity, immutable events and performance testing |
| Specialized gate entry | Partial | Delivery, cab, vendor and material entry screens | Complete approvals, photo/evidence persistence, exit handling and policy rules |
| Watchlist/blacklist | Frontend complete — mock-backed | Review and alert UI | Restricted backend store, exact-match policy, overrides, audit and privacy review |
| Offline queue | Placeholder/partial | Queue UI and low-connectivity concepts exist | Durable local queue, encryption, conflict strategy, retries, idempotent sync and loss testing |
| Guard shift handover and emergency | Frontend complete — mock-backed | Handover form and alert flow | Live supervisor acknowledgement, escalation and notification delivery |
| Parcel handover | Frontend complete with placeholder step | Request, parcel list/detail, OTP/QR placeholder and pickup confirmation | Secure OTP/QR issuance, scan verification and custodial audit trail |
| Guard-resident chat | Frontend complete — mock-backed | Inbox and conversation screens | Live messaging, delivery/read states, retention, moderation and notification integration |

### 6.3 Billing, payments and accounting

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Resident billing | Frontend complete / API contract ready | Bill list/detail, charge breakdown, payment simulation, receipt and ledger | Real payment gateway/UPI, webhook verification, failure/refund handling and reconciliation |
| Treasurer dashboard | Frontend complete / API contract ready | Billing cycles, charge heads, draft review, publishing, manual payments, receipts, flat ledgers and defaulters | Live accounting backend, maker-checker rules, financial close and audit export |
| Bill generation | Frontend complete — mock-backed | Generation and publish review flows | Deterministic server calculation, rounding/tax rules, locked cycles and scale testing |
| Corrections and reversals | Placeholder/partial | Adjustment-related UI and reversal placeholder | Non-destructive ledger entries, approvals, immutable audit and resident communication |
| Bank reconciliation | Planned/disabled | Feature flag exists and is false | Statement import, matching, exception review and controls |
| Financial reports/export | Partial/disabled | Report screens and API structures exist; feature flags for financial reports/export are false | Live aggregates, downloadable artifacts, accounting formats and permission testing |

The UI must continue to label payment as simulated until a real gateway, verified webhook and server ledger are operational.

### 6.4 Complaints, helpdesk and inter-flat disputes

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Resident complaints | Frontend complete / API contract ready | Create, list/detail, timeline, SLA, assignment, status, reopen and feedback | Live persistence, uploads, notifications, SLA jobs, escalation and audit |
| Private complaint | Placeholder | Dedicated placeholder screen | Restricted visibility model, misuse policy and audited access |
| Helpdesk/FAQ | Frontend complete — mock-backed | FAQ and helpdesk screen/data layer | Live support content, ticket routing and service ownership |
| Inter-flat issues | Frontend substantial but disabled | Water, noise, renovation, pet, damage and parking issue flows plus mediation/resolution screens | Enablement decision, backend workflow, evidence upload, neighbour notification and privacy controls |
| Rules, violations and penalties | Frontend/placeholder mix; disabled | Rule libraries, acknowledgements, violation and penalty-readiness surfaces | Legal/policy approval, backend enforcement and billing integration |

### 6.5 Notices, communication and notifications

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Notices | Frontend complete / mixed API readiness | Create, audience select, publish, list/detail, read status and acknowledgement reports | Live publishing, scheduled jobs, delivery and immutable audience snapshots |
| Resident-to-resident contact | Frontend complete — mock-backed | Privacy directory, search, first-contact request, accept/reject/block/report and private thread | Realtime transport, moderation evidence, rate limits and server-enforced phone privacy |
| Department and controlled groups | Frontend complete — mock-backed | Department chats and controlled-group surfaces | Membership policy, admin lifecycle, realtime delivery and retention |
| Push notifications | Infrastructure only / real backend disabled | Permissions, service and handler abstractions | Device-token lifecycle, server delivery, deep links, retries, preferences and observability |
| Localization | Implemented foundation | English sources plus generated Hindi and Marathi resources and language settings | Linguistic QA, full parity monitoring, plural/date/currency review and RTL decision if expanded |

### 6.6 Documents, NOCs and certificates

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Document vault | Frontend complete / mixed API readiness | Society, owner, tenant, move-in/out, staff/vendor and compliance categories | Real encrypted object storage, malware scan, upload, download authorization and retention |
| Version and access history | Frontend complete — mock-backed | Version history, access log and restricted-access screens | Immutable server audit, signed URLs, expiry and export controls |
| NOC workflows | Frontend complete — mock-backed | No-dues, move-out, tenant, parking and renovation NOCs plus residence certificate | Server clearance orchestration, approvals, PDF generation, signatures and revocation |
| QR-verifiable certificate | Placeholder | Certificate preview/verification-code UI | Cryptographically verifiable public endpoint, expiry/revocation and abuse protection |
| File capture/picking | Frontend foundation | Camera/gallery/document-picker abstractions | Real upload, compression, retry, metadata removal and privacy testing |

### 6.7 Facilities, parking, vendors and assets

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Facility booking | Frontend substantial — mock-backed | Facilities, slots, create, approval, cancellation, deposits, guest rooms, admin and calendar add | Transactional anti-double-booking backend, payment/refund and live QR check-in |
| Facility QR check-in | Placeholder | Check-in UI | Signed code, scanner validation and attendance event |
| Parking and vehicles | Frontend substantial — mock-backed | Vehicle management, allocations, slots, visitor/temporary passes, rules and incident flows | Live allocation constraints, enforcement, notifications and audit |
| RFID/ANPR for parking | Readiness only | Readiness and mapping screens | Device connector, event ingestion, confidence review and operations runbook |
| Vendor/AMC/assets | Frontend complete — mock-backed | Vendor directory/contracts/scorecards, AMC reminders, asset register/service schedule and inventory issue/return | Live backend, document expiry jobs, procurement and financial linkage |
| Facility operations | Frontend complete — mock-backed/API contract partly ready | Work orders, preventive maintenance, service history, inventory, purchase requests and breakdown reports | Backend state machine, assignment, notifications, attachments and SLA jobs |

### 6.8 Staff, domestic help and biometric attendance

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Staff directory and verification | Frontend complete — mock-backed | Staff/domestic-help directories, detail, registration and verification | Identity/document backend, deduplication and lifecycle controls |
| Shift and attendance operations | Frontend complete — mock-backed | Shifts, roster, daily/monthly views, punches, manual entry and corrections | Live clock source, approval workflow, payroll boundaries and audit |
| Domestic-help resident controls | Frontend complete — mock-backed | Resident home/detail, attendance, access and service controls | Guard synchronization, suspension/revocation and consent/privacy rules |
| Biometric devices and sync | Frontend/readiness — mock-backed | Device registry/detail, staff mapping, sync jobs/errors, duplicates, unknown codes and monthly/vendor reports | Vendor connector, secure credentials, scheduler, replay protection and monitoring |

No raw fingerprint/biometric template handling was verified. The intended design should continue to ingest attendance punches and external employee codes only.

### 6.9 Governance, safety and compliance

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| AGM/SGM and meeting records | Frontend complete — mock-backed | Notice, agenda, RSVP, proxy, questions, minutes and resolutions | Live eligibility, quorum, immutable publication and exports |
| Polls | Frontend complete — mock-backed | Create/detail/vote/result experiences | Server eligibility, one-vote enforcement and audited totals |
| Elections/e-voting | Frontend/readiness; backend required | Setup, nomination, candidate, eligibility, vote/result and readiness screens | Legal validation, secrecy, tamper evidence, backend election engine and independent security review |
| Resident emergency | Frontend complete — mock-backed | SOS, medical, fire, lift, family connect, volunteers, acknowledgement and incident timeline | Real notification/escalation, location policy, delivery confirmation and drills |
| Senior care | Frontend complete — mock-backed | Daily check-in and senior-focused support screens | Consent, caregiver links, missed check-in escalation and operational staffing |
| Renovation/rule compliance | Frontend complete — mock-backed | Renovation, contractor pass, debris checklist, damage inspection and acknowledgement | Live approvals, evidence, reminders and enforcement |
| Operational compliance | Frontend substantial but disabled | Waste, housekeeping, lift and fire workflows, calendars, reports and audit surfaces | Backend, certificate uploads, scheduled reminders, exports and operating ownership |

### 6.10 Community and marketplace additions

The following capabilities significantly extend the original marketplace description and should be added to the formal product scope:

| Capability | Current status | What exists | Remaining work |
|---|---|---|---|
| Resident marketplace listings | Frontend complete — mock-backed | Feed, categories, filters, create/manage/detail/report and moderation | Live listing backend, safe image upload, fraud policy and retention |
| Resident skill directory | Frontend complete — mock-backed | Search, profiles and skill creation | Verification, availability, privacy and contact integration |
| Resident service requests | Frontend complete — mock-backed | Listing/request/detail/contact flows | Matching, moderation and lifecycle notifications |
| Borrow/lend | Frontend complete — mock-backed | Items, requests, approvals, returns and history | Deposits/liability policy, notifications and disputes |
| Lost and found | Frontend complete — mock-backed | List/create/detail/claim | Claim verification, moderation and retention |
| Verified external vendors | Placeholder/partial | Vendor placeholder and ratings/service-directory concepts | Onboarding, verification, commercial model and payments |

### 6.11 Reports and society health

Financial, collection, complaint SLA, vendor performance, security, staff attendance, owner/tenant lifecycle, compliance, community and society-health screens exist. They are frontend/mock reports unless backed by a verified API environment. Before production, each metric needs a written formula, source-of-truth fields, timezone/cutoff behavior, permissions, empty/partial-data behavior and reconciliation tests.

### 6.12 Smart automation

Smart complaint routing, automated notice drafting, smart document search, bill explanation, meeting summary and maintenance-risk previews exist, along with an audit-log screen. Six of the seven automation screens are explicitly placeholders, the automation API source returns `NOT_IMPLEMENTED`, and the real automation-engine flag is false.

Status: placeholder/demo only. No user should be told that an AI/automation service is operating in production.

### 6.13 Hardware integration

The code includes a device registry plus gate hardware, RFID, ANPR, boom barrier, CCTV, smart meter, EV charging, device-location, permission, sync/event/error, audit and privacy screens. Many are readiness or placeholder experiences, and every real connector/control flag is false.

Status: integration architecture and operational UI prototype only. The mobile app must never imply that a physical barrier, camera, meter or charger was controlled unless an authenticated device command was acknowledged by the integration backend.

### 6.14 Super-admin and platform operations

The platform surface adds society onboarding, hierarchy templates, module configuration, feature flags, hidden commercial controls, free-launch plan mapping, society admins, user lookup, support/escalation, operational alerts, usage/adoption analytics, health overview, audit, settings and release rollout.

This is a material addition to the v2.0 catalogue. However, the super-admin console and its major capabilities are disabled by default, several operations are placeholders, and backend enforcement is not proven. Treat it as an internal prototype until separate platform authentication, authorization, audit, tenancy and operational safeguards are validated.

## 7. Differences from the v2.0 blueprint

### 7.1 Implemented in code but under-described or missing in v2.0

- multi-home memberships and active residence/role switching;
- residence linking, owner consent, renewal and suspension-resolution journeys;
- expanded household lifecycle: family, tenant, authorized occupant, rental and short-stay models;
- resident domestic-help attendance and access controls;
- community classifieds, resident skills, service requests, borrow/lend and lost-and-found;
- waste, housekeeping, fire and lift compliance operations;
- contextual daily resident insights and reporting;
- dedicated app-mode selector and distinct society-admin, treasurer, facility, super-admin and hardware mobile surfaces;
- platform support, rollout, analytics and hidden commercial-control prototypes;
- localization foundation for English, Hindi and Marathi;
- accessibility, appearance and privacy settings;
- centralized data-source switching, API request context, idempotency and correlation IDs; and
- detailed design-system, responsive tablet and shared feedback/form infrastructure.

### 7.2 Listed in v2.0 but not production-complete

- real OTP/QR visitor validation and offline sync;
- real UPI/payment gateway, reconciliation and accounting exports;
- real document upload/storage and QR-verifiable certificates;
- backend-enforced NOC clearance and access revocation;
- realtime private/department/group chat;
- push-notification delivery;
- biometric device connectors;
- RFID, ANPR, CCTV, smart meters, EV charging and boom-barrier control;
- smart automation services;
- secure e-voting;
- production super-admin operations; and
- backend-enforced feature flags, permissions and immutable audit logs.

### 7.3 Roadmap mismatch

The original phase plan is no longer a reliable reflection of build order. Many Phase 2–4 screens already exist, while several MVP integrations remain incomplete. Roadmap status must therefore be based on production capability, not frontend screen completion.

## 8. Revised delivery roadmap

### Release 0 — Demonstration baseline (current)

Goal: stable mock-backed stakeholder demonstration.

- Keep mock mode visibly identifiable in non-development demos.
- Fix TypeScript and test regressions.
- Verify all enabled routes on phone and tablet.
- Remove misleading production language from simulated payments, QR, notifications, automation and hardware screens.
- Keep disabled modules unavailable through normal navigation.

### Release 1 — Core production pilot

Goal: one society can use a narrow, reliable end-to-end set.

- Real authentication, memberships and role claims.
- Society/unit/resident master data and approvals.
- Visitor creation, guard validation, entry/exit and audited logs.
- Complaints with uploads, assignment, SLA and notifications.
- Notices with audience snapshots and delivery tracking.
- Billing, payment gateway, webhook, receipts and immutable ledger.
- Document storage and access authorization.
- Server-side feature flags, RBAC, tenant isolation and audit.
- Monitoring, backups, support and privacy/retention processes.

### Release 1A — Resident lifecycle and communication

- Owner/tenant history and move-in/move-out.
- NOC clearance and access revocation.
- Parcel handover.
- Resident contact requests and department chat.
- Domestic-help access synchronization.

### Release 2 — Operations maturity

- Facility booking with transactional availability.
- Parking operations.
- Vendor, AMC, assets, work orders and inventory.
- Renovation, rules and core compliance.
- Metric-certified reports.

### Release 3 — Community and workforce intelligence

- Staff shifts, attendance corrections and vendor reports.
- Biometric punch connectors.
- Community marketplace/skills/borrow-lend/lost-and-found after safety policy approval.
- Senior-care and emergency escalation operations.
- Society health score with governed formulas.

### Release 4 — Regulated and physical integrations

- Elections/e-voting only after legal and security review.
- RFID/ANPR/boom barrier/CCTV/smart meters/EV charging one connector at a time.
- Smart automation only with privacy, evaluation, approval and audit controls.
- Production super-admin tooling with strong platform-operator safeguards.

## 9. Production definition of done

A feature is production-ready only when all applicable items below are satisfied:

1. Product behavior and negative cases are documented.
2. The route is reachable only for the correct role and enabled society.
3. The backend independently authorizes society, unit, role and object access.
4. API mode works without silently falling back to mock.
5. Writes are persisted and safe under retries; financial and critical writes are idempotent.
6. Loading, empty, offline, timeout, server-error and retry states are tested.
7. Sensitive fields, documents and logs follow retention and access policy.
8. Required audit events are immutable and queryable.
9. Notifications or external integrations confirm delivery/failure instead of assuming success.
10. Accessibility, localization, phone and tablet behavior are accepted.
11. Unit/integration tests and the relevant end-to-end critical path pass.
12. Monitoring, support ownership, rollback and data-recovery procedures exist.
13. Feature flags are enforced by both frontend and backend.
14. No placeholder, mock payment, fake QR/OTP or simulated device result is presented as real.

## 10. Immediate documentation and engineering actions

### Priority 0 — Correctness

- Use this document’s status vocabulary in every feature table and release report.
- Add backend environment and endpoint ownership to each module.
- Mark all simulated actions in the UI and QA scripts.
- Resolve the current TypeScript failure in `EmergencyFloatingAction.tsx` before claiming a clean build.
- Track and remove React `act(...)` warnings from the otherwise passing Jest suite so test output remains trustworthy.

### Priority 1 — Traceability

- Expand the feature registry beyond its present 142 entries to cover community, compliance operations, super-admin, hardware, reports, biometric/staff attendance and newer resident-lifecycle features.
- Replace the single registry status with separate fields: `frontendStatus`, `backendStatus`, `integrationStatus`, `testStatus`, `releaseFlag` and `owner`.
- Generate the status appendix from code/registry data to prevent drift.
- Link each route to a requirement, permission, feature flag, repository method, API endpoint and acceptance test.

### Priority 2 — Documentation set

Maintain these documents separately:

- Product blueprint: vision, personas, business capabilities and long-term rules.
- Implementation status: this document, updated at each milestone.
- API contract: endpoint schemas, errors, auth and idempotency.
- Security/privacy specification: data classes, access, retention and audit.
- QA acceptance matrix: role-by-role positive, negative and offline cases.
- Release runbook: environments, flags, migrations, monitoring, rollback and support.

## 11. Known verification state at audit time

- `npm run typecheck` does not currently pass. The observed error is an unresolved `getDeepActiveRouteName` reference in `src/modules/resident/emergency/components/EmergencyFloatingAction.tsx`.
- `npm test -- --runInBand` passed all 197 suites and all 557 tests. The run emitted React test-environment and overlapping/unawaited `act(...)` warnings, so it was successful but not warning-free.
- The Milestone 13 walkthrough’s statement of “0 errors and 0 warnings” is historical and must not be used as the current repository status.
- No deployed API environment, payment provider, notification provider, biometric device, physical access hardware or production data store was verified as part of this repository audit.

## 12. Documentation maintenance rule

Update this file whenever a feature changes status, a default feature flag changes, a role/permission is added, a module is added, or a live integration is enabled. Every update must include the audit date and code baseline. Product roadmap phase and implementation maturity must remain separate fields.
