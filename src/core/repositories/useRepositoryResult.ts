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

export { useRepositoryMutation, useRepositoryMutationWithIdempotency } from './useRepositoryMutation';
