import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../../core/auth/AuthProvider';
import type { ResidenceMembership } from '../../../../core/householdGovernance/identity.types';
import { mockIdentityStore } from '../../../../core/householdGovernance/mockIdentityStore';
import type { ActorContextInput } from '../application/caseService';
import { deriveDisputeActor, disputeIdentityFromSession, type DisputeActorResolution, } from '../domain/types/actorContext.types';
import { listCasesForActor, viewCase, resetDisputeGateway } from './disputeGateway';
import type { CaseView } from '../application/caseService';
import type { DisputeCase } from '../domain/types/case.types';
export type DisputeActorContext = {
    readonly status: 'READY';
    readonly actor: ActorContextInput;
    readonly membership: ResidenceMembership;
} | {
    readonly status: 'LOADING';
} | {
    readonly status: 'SIGNED_OUT';
} | {
    readonly status: 'DENIED';
    readonly reason: string;
};
export type DisputeCasesView = {
    readonly status: 'LOADING' | 'READY' | 'ERROR';
    readonly cases: readonly DisputeCase[];
    readonly reason?: string;
};
function membershipForSession(userId: string, societyId: string): ResidenceMembership | undefined {
    return mockIdentityStore
        .listMemberships(userId)
        .find((membership) => membership.societyId === societyId && membership.status === 'ACTIVE');
}
export function useDisputeActorContext(): DisputeActorContext {
    const { session, status } = useAuth();
    const [context, setContext] = useState<DisputeActorContext>({ status: 'LOADING' });
    useEffect(() => {
        if (status !== 'authenticated' || session === null) {
            setContext({ status: 'SIGNED_OUT' });
            return;
        }
        if (session.societyId === undefined) {
            setContext({ status: 'DENIED', reason: 'No society is selected for this session.' });
            return;
        }
        const membership = membershipForSession(session.userId, session.societyId);
        if (membership === undefined) {
            setContext({
                status: 'DENIED',
                reason: 'No active residence membership exists for this user in this society.',
            });
            return;
        }
        const resolution: DisputeActorResolution = deriveDisputeActor(disputeIdentityFromSession({
            session,
            membership,
            displayName: session.name,
            sessionId: `sess-${session.userId}`,
        }));
        if (!resolution.ok) {
            setContext({ status: 'DENIED', reason: resolution.message });
            return;
        }
        setContext({ status: 'READY', actor: resolution.actor, membership: resolution.membership });
    }, [session, status]);
    return context;
}
export function useMyDisputeCases(): DisputeCasesView {
    const context = useDisputeActorContext();
    const [view, setView] = useState<DisputeCasesView>({ status: 'LOADING', cases: [] });
    const refresh = useCallback(() => {
        if (context.status === 'LOADING') {
            setView({ status: 'LOADING', cases: [] });
            return;
        }
        if (context.status !== 'READY') {
            setView({ status: 'ERROR', cases: [], reason: context.status === 'DENIED' ? context.reason : 'No dispute identity is available.' });
            return;
        }
        try {
            setView({ status: 'READY', cases: listCasesForActor(context.actor) });
        }
        catch (caught) {
            setView({
                status: 'ERROR',
                cases: [],
                reason: caught instanceof Error ? caught.message : 'Dispute cases could not be read.',
            });
        }
    }, [context]);
    useEffect(() => {
        refresh();
    }, [refresh]);
    return view;
}
export function useDisputeCase(caseId: string | undefined) {
    const context = useDisputeActorContext();
    return useMemo(() => {
        if (context.status === 'LOADING') {
            return { status: 'LOADING' as const };
        }
        if (context.status !== 'READY') {
            return { status: 'DENIED' as const, reason: context.status === 'DENIED' ? context.reason : 'No dispute identity is available.' };
        }
        if (caseId === undefined) {
            return { status: 'EMPTY' as const };
        }
        const result = viewCase(context.actor, caseId);
        if (!result.ok) {
            return { status: 'ERROR' as const, reason: result.message };
        }
        return { status: 'READY' as const, view: result.value as CaseView };
    }, [context, caseId]);
}
export function __resetDisputeGatewayForTests(): void {
    resetDisputeGateway();
}

