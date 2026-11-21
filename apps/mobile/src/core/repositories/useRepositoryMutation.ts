import * as React from 'react';
import { repositoryErrorFromUnknown, repositoryFailure, type RepositoryError, type RepositoryResult } from './repository.types';
import { useLatestValue } from '../../shared/hooks/useLatestValue';
import { createIdempotencyKey } from '../api/idempotency';
import { auditService, createAuditEntry, type AuditActorType, type AuditAction, type AuditEntityType } from '../audit';
import type { JsonObject } from '../api/api.types';
import type { Absent } from "../../shared/types/absence.types";
export type MutationAuditConfig = {
    actorUserId: string;
    actorType: AuditActorType;
    societyId: string;
    unitId?: string | Absent;
    role?: string | Absent;
    action: AuditAction;
    entityType: AuditEntityType;
    entityIdFromResult?: ((result: RepositoryResult<JsonObject>) => string) | Absent;
    getPreviousState?: (() => JsonObject) | Absent;
    getNewState?: ((input: JsonObject, result: RepositoryResult<JsonObject>) => JsonObject) | Absent;
    source?: ('MOBILE' | 'WEB' | 'API' | 'GATE_DEVICE' | 'BIOMETRIC_DEVICE' | 'SYSTEM_JOB') | Absent;
};
export type UseRepositoryMutationOptions<TInput, TOutput> = {
    idempotencyKeyPrefix?: string | Absent;
    audit?: MutationAuditConfig | Absent;
    onMutate?: ((input: TInput) => void) | Absent;
    onSuccess?: ((data: TOutput, input: TInput) => void) | Absent;
    onError?: ((error: RepositoryError, input: TInput) => void) | Absent;
    onSettled?: ((data: TOutput | Absent, error: RepositoryError | null, input: TInput) => void) | Absent;
};
export function useRepositoryMutation<TInput, TOutput>(mutation: (input: TInput, idempotencyKey: string) => Promise<RepositoryResult<TOutput>>, options: UseRepositoryMutationOptions<TInput, TOutput> = {}): {
    submit: (input: TInput, customIdempotencyKey?: string) => Promise<RepositoryResult<TOutput>>;
    isSubmitting: boolean;
    error: RepositoryError | null;
    reset: () => void;
    lastResult: RepositoryResult<TOutput> | null;
} {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<RepositoryError | null>(null);
    const [lastResult, setLastResult] = React.useState<RepositoryResult<TOutput> | null>(null);
    const inFlight = React.useRef<Promise<RepositoryResult<TOutput>> | null>(null);
    const isMounted = React.useRef(true);
    const mutationVersion = React.useRef(0);
    const mutationRef = React.useRef(mutation);
    mutationRef.current = mutation;
    React.useEffect(() => () => {
        isMounted.current = false;
        mutationVersion.current += 1;
    }, []);
    const submit = React.useCallback(async (input: TInput, customIdempotencyKey?: string): Promise<RepositoryResult<TOutput>> => {
        if (inFlight.current) {
            return inFlight.current;
        }
        const idempotencyKey = customIdempotencyKey ?? (options.idempotencyKeyPrefix
            ? createIdempotencyKey(options.idempotencyKeyPrefix)
            : createIdempotencyKey('mutation'));
        setIsSubmitting(true);
        setError(null);
        options.onMutate?.(input);
        const version = ++mutationVersion.current;
        const previousState = options.audit?.getPreviousState?.();
        const request = (async (): Promise<RepositoryResult<TOutput>> => {
            try {
                return await mutationRef.current(input, idempotencyKey);
            }
            catch (unknownError) {
                return repositoryFailure(repositoryErrorFromUnknown(unknownError as Error));
            }
        })();
        inFlight.current = request;
        try {
            const result = await request;
            inFlight.current = null;
            if (!isMounted.current || version !== mutationVersion.current) {
                return result;
            }
            setIsSubmitting(false);
            setError(result.ok ? null : result.error);
            setLastResult(result);
            if (options.audit) {
                const entityId = options.audit.entityIdFromResult?.(result as unknown as RepositoryResult<JsonObject>) ?? 'unknown';
                const newState = options.audit.getNewState?.(input as unknown as JsonObject, result as unknown as RepositoryResult<JsonObject>);
                const auditEntry = createAuditEntry({
                    actorUserId: options.audit.actorUserId,
                    actorType: options.audit.actorType,
                    societyId: options.audit.societyId,
                    ...(options.audit.unitId ? { unitId: options.audit.unitId } : {}),
                    ...(options.audit.role ? { role: options.audit.role } : {}),
                    action: options.audit.action,
                    entityType: options.audit.entityType,
                    entityId,
                    ...(previousState ? { previousState } : {}),
                    ...(newState ? { newState } : {}),
                    idempotencyKey,
                    ...(options.audit.source ? { source: options.audit.source } : {}),
                    outcome: result.ok ? 'SUCCESS' : 'FAILURE',
                    ...(result.ok ? {} : { error: { code: result.error.code, message: result.error.message } }),
                });
                auditService.log(auditEntry);
            }
            if (result.ok) {
                options.onSuccess?.(result.data, input);
            }
            else {
                options.onError?.(result.error, input);
            }
            options.onSettled?.(result.ok ? result.data : undefined, result.ok ? null : result.error, input);
            return result;
        }
        catch (unexpectedError) {
            inFlight.current = null;
            if (!isMounted.current || version !== mutationVersion.current) {
                throw unexpectedError;
            }
            setIsSubmitting(false);
            const repoError = repositoryErrorFromUnknown(unexpectedError as Error);
            setError(repoError);
            const failResult: RepositoryResult<TOutput> = { ok: false, error: repoError };
            setLastResult(failResult);
            options.onError?.(repoError, input);
            options.onSettled?.(undefined, repoError, input);
            return failResult;
        }
    }, [options]);
    const reset = React.useCallback(() => {
        mutationVersion.current += 1;
        inFlight.current = null;
        setError(null);
        setIsSubmitting(false);
        setLastResult(null);
    }, []);
    return {
        submit,
        isSubmitting,
        error,
        reset,
        lastResult,
    };
}
export function useRepositoryMutationWithIdempotency<TInput, TOutput>(mutation: (input: TInput) => Promise<RepositoryResult<TOutput>>, idempotencyKeyPrefix: string, audit?: MutationAuditConfig | Absent) {
    return useRepositoryMutation<TInput, TOutput>((input: TInput, _idempotencyKey: string) => mutation(input), { idempotencyKeyPrefix, ...(audit ? { audit } : {}) });
}

