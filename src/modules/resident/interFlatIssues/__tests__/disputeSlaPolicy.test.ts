import { openStandardCase, newRuntime, reporter, command, revisionOf } from './fixtures/disputeHarness';
import { evaluateSla, validateSlaPolicy } from '../domain/engines/slaEngine';
import { resolveRequiredPolicies } from '../domain/types/policy.types';
import { responseDueHours } from '../domain/engines/slaEngine';
describe('dispute SLA policy', () => {
    it('flags a missing SLA configuration instead of silently defaulting', () => {
        const resolution = resolveRequiredPolicies({
            sla: { responseDueHoursBySeverity: { LOW: 0, MEDIUM: 48, HIGH: 24, URGENT: 8 } },
        });
        expect(resolution.missing).toContain('sla.responseDueHoursBySeverity.LOW');
        expect(validateSlaPolicy(resolution.policies.sla).length).toBeGreaterThan(0);
    });
    it('reports a complete default policy as valid', () => {
        const resolution = resolveRequiredPolicies();
        expect(resolution.missing).toHaveLength(0);
        expect(validateSlaPolicy(resolution.policies.sla)).toHaveLength(0);
        expect(responseDueHours(resolution.policies.sla, 'HIGH')).toBeGreaterThan(0);
    });
    it('detects an overdue response on an open case with no response recorded', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const stored = runtime.ports.cases.read(caseId);
        if (stored === undefined) {
            throw new Error('case missing');
        }
        const policies = runtime.ports.policies;
        const before = evaluateSla(stored, policies.sla, new Date('2026-03-02T09:30:00.000Z'));
        expect(before.breaches).toHaveLength(0);
        const longAfter = evaluateSla(stored, policies.sla, new Date('2026-03-20T09:30:00.000Z'));
        expect(longAfter.breaches.map((breach) => breach.kind)).toContain('RESPONSE_OVERDUE');
        const responseBreach = longAfter.breaches.find((breach) => breach.kind === 'RESPONSE_OVERDUE');
        expect(responseBreach?.hoursOverdue).toBeGreaterThan(0);
    });
    it('does not report a response breach once a response has been recorded', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const result = runtime.cases.recordResponse({
            userId: 'user-respondent',
            role: 'RESIDENT_OWNER',
            actorType: 'RESIDENT_RESPONDENT',
            societyId: 'soc-test-1',
            sessionId: 's',
            authenticatedAt: '2026-03-02T09:00:00.000Z',
            displayName: 'Respondent',
        }, command(caseId, 'RECORD_RESPONSE', 'resp-sla', revisionOf(runtime, caseId)), caseId, {
            position: 'ACKNOWLEDGE_AND_COOPERATE',
            statement: 'The drilling did occur on two evenings and we agree to quiet hours.',
            cooperatesWithInspection: true,
            proposedOutcome: undefined,
            evidenceIds: [],
        });
        expect(result.ok).toBe(true);
        const stored = runtime.ports.cases.read(caseId);
        if (stored === undefined) {
            throw new Error('case missing');
        }
        const evaluation = evaluateSla(stored, runtime.ports.policies.sla, new Date('2026-03-20T09:30:00.000Z'));
        expect(evaluation.breaches.map((breach) => breach.kind)).not.toContain('RESPONSE_OVERDUE');
    });
    it('never marks a breach as automatically escalating into a penalty', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const stored = runtime.ports.cases.read(caseId);
        if (stored === undefined) {
            throw new Error('case missing');
        }
        const evaluation = evaluateSla(stored, runtime.ports.policies.sla, new Date('2026-06-01T09:30:00.000Z'));
        const breach = evaluation.breaches.find((entry) => entry.kind === 'RESPONSE_OVERDUE');
        expect(breach).toBeDefined();
        expect(breach?.escalatesAutomatically).toBe(true);
        expect(runtime.ports.policies.financeLink.disputeMayCreateCharge).toBe(false);
    });
});

