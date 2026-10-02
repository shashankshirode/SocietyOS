import type { DisputeActorType } from '../../domain/types/primitives';
import type { AppRole } from '../../../../../core/permissions/permission.types';
import type { ActorContextInput } from '../../application/caseService';
import { disputeCommand, type DisputeCommand } from '../../application/caseService';
import type { DisputeRuntime } from '../../infrastructure/disputeRuntime';
import { createDisputeRuntime } from '../../infrastructure/disputeRuntime';
import type { OpenCaseInput } from '../../application/caseService';

export const SOCIETY_ID = 'soc-test-1';
export const OTHER_SOCIETY_ID = 'soc-test-2';

export const START = new Date('2026-03-02T09:00:00.000Z');

export function actor(
  userId: string,
  actorType: DisputeActorType,
  role: AppRole,
  overrides: Partial<ActorContextInput> = {},
): ActorContextInput {
  return {
    userId,
    role,
    actorType,
    societyId: SOCIETY_ID,
    sessionId: `sess-${userId}`,
    authenticatedAt: START.toISOString(),
    displayName: `Resident ${userId}`,
    ...overrides,
  };
}

export const reporter = (userId = 'user-reporter'): ActorContextInput =>
  actor(userId, 'RESIDENT_REPORTER', 'RESIDENT_OWNER');

export const respondent = (userId = 'user-respondent'): ActorContextInput =>
  actor(userId, 'RESIDENT_RESPONDENT', 'RESIDENT_OWNER');

export const affected = (userId = 'user-affected'): ActorContextInput =>
  actor(userId, 'RESIDENT_AFFECTED', 'RESIDENT_TENANT');

export const admin = (userId = 'user-admin'): ActorContextInput =>
  actor(userId, 'SOCIETY_ADMIN', 'SOCIETY_ADMIN', { displayName: 'Committee Admin' });

export const committee = (userId = 'user-committee'): ActorContextInput =>
  actor(userId, 'COMMITTEE_MEMBER', 'COMMITTEE_MEMBER', { displayName: 'Committee Member' });

export const mediator = (userId = 'user-mediator'): ActorContextInput =>
  actor(userId, 'MEDIATOR', 'COMMITTEE_MEMBER', { displayName: 'Neutral Mediator' });

export const inspector = (userId = 'user-inspector'): ActorContextInput =>
  actor(userId, 'INSPECTOR', 'FACILITY_MANAGER', { displayName: 'Facility Inspector' });

export const auditor = (userId = 'user-auditor'): ActorContextInput =>
  actor(userId, 'AUDITOR', 'AUDITOR', { displayName: 'Society Auditor' });

export const outsider = (userId = 'user-outsider'): ActorContextInput =>
  actor(userId, 'RESIDENT_REPORTER', 'RESIDENT_OWNER', { societyId: OTHER_SOCIETY_ID });

export function command(
  caseId: string,
  kind: string,
  key: string,
  expectedRevision: number,
): DisputeCommand {
  return disputeCommand(caseId, kind, key, expectedRevision);
}

export function openCaseInput(overrides: Partial<OpenCaseInput> = {}): OpenCaseInput {
  return {
    title: 'Repeated late-night noise from the unit above',
    category: 'NOISE_DISTURBANCE',
    severity: 'MEDIUM',
    description:
      'Loud music and drilling continue past 23:00 on at least four nights, and are audible in the bedroom.',
    locationLabel: 'Tower A, Unit 1204 and the unit directly above',
    reporterUnitId: 'unit-1204',
    reporterTowerId: 'tower-a',
    respondentUnitId: 'unit-1402',
    respondentUnitLabel: 'Unit 1402',
    respondentTowerId: 'tower-a',
    respondentUserId: 'user-respondent',
    propertyTags: [],
    trace: { correlationId: 'corr-1', causationId: undefined },
    ...overrides,
  };
}

export function openStandardCase(
  runtime: DisputeRuntime,
  overrides: Partial<OpenCaseInput> = {},
  key = 'open-case-1',
): string {
  const result = runtime.cases.openCase(
    reporter(),
    command('', 'OPEN_CASE', key, 0),
    openCaseInput(overrides),
  );
  if (!result.ok) {
    throw new Error(`openCase failed: ${result.code} ${result.message}`);
  }
  return result.value.id;
}

export function newRuntime(options: Parameters<typeof createDisputeRuntime>[0] = {}): DisputeRuntime {
  return createDisputeRuntime({ now: START, caseNumberPrefix: 'TEST', ...options });
}

export function revisionOf(runtime: DisputeRuntime, caseId: string): number {
  const stored = runtime.ports.cases.read(caseId);
  if (stored === undefined) {
    throw new Error(`case ${caseId} not found`);
  }
  return stored.revision.revision;
}
