import * as React from 'react';
import { repositoryErrorFromUnknown, repositoryFailure, type RepositoryError, type RepositoryResult } from './repository.types';
import { useLatestValue } from '../../shared/hooks/useLatestValue';
import type { Absent } from "../../shared/types/absence.types";
export function useRepositoryResult<T>(loader: () => Promise<RepositoryResult<T>>, dependencies: React.DependencyList = []): {
    data: T | Absent;
    isLoading: boolean;
    error: RepositoryError | null;
    refetch: () => Promise<void>;
} {
    const [data, setData] = React.useState<T | Absent>(undefined);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<RepositoryError | null>(null);
    const requestVersion = React.useRef(0);
    const dependencySignature = JSON.stringify(dependencies);
    const loaderHandle = useLatestValue(loader, dependencySignature);
    const load = React.useCallback(async () => {
        const version = ++requestVersion.current;
        setIsLoading(true);
        setError(null);
        let result: RepositoryResult<T>;
        try {
            result = await loaderHandle.valueRef.current();
        }
        catch (unknownError) {
            result = repositoryFailure(repositoryErrorFromUnknown(unknownError as Error));
        }
        if (version !== requestVersion.current) {
            return;
        }
        if (result.ok) {
            setData(result.data);
            setError(null);
        }
        else {
            setError(result.error);
        }
        setIsLoading(false);
    }, [loaderHandle]);
    React.useEffect(() => {
        let isMounted = true;
        const version = ++requestVersion.current;
        async function run() {
            setIsLoading(true);
            setError(null);
            setData(undefined);
            let result: RepositoryResult<T>;
            try {
                result = await loaderHandle.valueRef.current();
            }
            catch (unknownError) {
                result = repositoryFailure(repositoryErrorFromUnknown(unknownError as Error));
            }
            if (!isMounted || version !== requestVersion.current) {
                return;
            }
            if (result.ok) {
                setData(result.data);
                setError(null);
            }
            else {
                setError(result.error);
            }
            setIsLoading(false);
        }
        run();
        return () => {
            isMounted = false;
            requestVersion.current += 1;
        };
    }, [loaderHandle]);
    return {
        data,
        isLoading,
        error,
        refetch: load,
    };
}
export function useRepositoryMutation<TInput, TOutput>(mutation: (input: TInput) => Promise<RepositoryResult<TOutput>>): {
    submit: (input: TInput) => Promise<RepositoryResult<TOutput>>;
    isSubmitting: boolean;
    error: RepositoryError | null;
    reset: () => void;
} {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [error, setError] = React.useState<RepositoryError | null>(null);
    const inFlight = React.useRef<Promise<RepositoryResult<TOutput>> | null>(null);
    const isMounted = React.useRef(true);
    const mutationVersion = React.useRef(0);
    React.useEffect(() => () => {
        isMounted.current = false;
        mutationVersion.current += 1;
    }, []);
    const submit = React.useCallback(async (input: TInput) => {
        if (inFlight.current) {
            return inFlight.current;
        }
        setIsSubmitting(true);
        setError(null);
        const version = ++mutationVersion.current;
        const request = (async (): Promise<RepositoryResult<TOutput>> => {
            try {
                return await mutation(input);
            }
            catch (unknownError) {
                return repositoryFailure(repositoryErrorFromUnknown(unknownError as Error));
            }
        })();
        inFlight.current = request;
        const result = await request;
        inFlight.current = null;
        if (!isMounted.current || version !== mutationVersion.current) {
            return result;
        }
        setIsSubmitting(false);
        setError(result.ok ? null : result.error);
        return result;
    }, [mutation]);
    const reset = React.useCallback(() => {
        mutationVersion.current += 1;
        inFlight.current = null;
        setError(null);
        setIsSubmitting(false);
    }, []);
    return {
        submit,
        isSubmitting,
        error,
        reset,
    };
}
