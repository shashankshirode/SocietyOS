import * as React from 'react';
import type { RepositoryError, RepositoryResult } from './repository.types';
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
    const dependencySignature = JSON.stringify(dependencies);
    const loaderHandle = useLatestValue(loader, dependencySignature);
    const load = React.useCallback(async () => {
        setIsLoading(true);
        const result = await loaderHandle.valueRef.current();
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
        async function run() {
            setIsLoading(true);
            setError(null);
            const result = await loaderHandle.valueRef.current();
            if (!isMounted) {
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
    const submit = React.useCallback(async (input: TInput) => {
        setIsSubmitting(true);
        const result = await mutation(input);
        setIsSubmitting(false);
        if (result.ok) {
            setError(null);
        }
        else {
            setError(result.error);
        }
        return result;
    }, [mutation]);
    const reset = React.useCallback(() => {
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

