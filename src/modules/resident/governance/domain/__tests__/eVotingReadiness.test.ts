import { evaluateEVotingReadiness } from '../eVotingReadiness';
import type { EVotingControls } from '../eVotingReadiness';
const ALL_CONTROLS: EVotingControls = {
    secretBallot: true,
    verifiedIdentity: true,
    integrityAttestation: true,
    auditTrail: true,
    backend: 'LIVE',
};
describe('e-voting readiness', () => {
    it('reports NOT_READY when no policy governs the decision kind', () => {
        expect(evaluateEVotingReadiness({ activation: undefined, controls: ALL_CONTROLS })).toEqual({
            status: 'NOT_READY',
            reasons: ['POLICY_NOT_CONFIGURED'],
        });
    });
    it('reports NOT_READY for an unconfigured or disabled activation', () => {
        expect(evaluateEVotingReadiness({ activation: { state: 'NOT_CONFIGURED' }, controls: ALL_CONTROLS })).toEqual({ status: 'NOT_READY', reasons: ['POLICY_NOT_CONFIGURED'] });
        expect(evaluateEVotingReadiness({ activation: { state: 'DISABLED' }, controls: ALL_CONTROLS })).toEqual({ status: 'NOT_READY', reasons: ['POLICY_DISABLED'] });
    });
    it('reports AVAILABLE only when the policy is enabled and every control holds', () => {
        expect(evaluateEVotingReadiness({ activation: { state: 'ENABLED' }, controls: ALL_CONTROLS })).toEqual({ status: 'AVAILABLE' });
    });
    it('does not treat an enabled policy as proof of a secret ballot', () => {
        expect(evaluateEVotingReadiness({
            activation: { state: 'ENABLED' },
            controls: { ...ALL_CONTROLS, secretBallot: false },
        })).toEqual({ status: 'NOT_READY', reasons: ['BALLOT_NOT_SECRET'] });
    });
    it('reports every missing control at once rather than only the first', () => {
        expect(evaluateEVotingReadiness({
            activation: { state: 'ENABLED' },
            controls: {
                secretBallot: false,
                verifiedIdentity: false,
                integrityAttestation: false,
                auditTrail: false,
                backend: 'MOCK_ONLY',
            },
        })).toEqual({
            status: 'NOT_READY',
            reasons: [
                'BALLOT_NOT_SECRET',
                'IDENTITY_NOT_VERIFIED',
                'INTEGRITY_NOT_ATTESTED',
                'AUDIT_TRAIL_MISSING',
                'BACKEND_NOT_LIVE',
            ],
        });
    });
    it('refuses a mock or unavailable backend', () => {
        for (const backend of ['MOCK_ONLY', 'UNAVAILABLE'] as const) {
            expect(evaluateEVotingReadiness({ activation: { state: 'ENABLED' }, controls: { ...ALL_CONTROLS, backend } })).toEqual({ status: 'NOT_READY', reasons: ['BACKEND_NOT_LIVE'] });
        }
    });
    it('combines a policy reason with control reasons', () => {
        expect(evaluateEVotingReadiness({
            activation: { state: 'DISABLED' },
            controls: { ...ALL_CONTROLS, verifiedIdentity: false },
        })).toEqual({ status: 'NOT_READY', reasons: ['POLICY_DISABLED', 'IDENTITY_NOT_VERIFIED'] });
    });
});

