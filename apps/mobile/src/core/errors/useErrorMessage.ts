import { useMemo } from 'react';
import type { AppError } from './AppError';
import type { Absent } from "../../shared/types/absence.types";
export function useErrorMessage(error: AppError | null | Absent): string | null {
    return useMemo(() => {
        if (!error)
            return null;
        return error.userMessage || error.message || 'An unexpected error occurred.';
    }, [error]);
}
export default useErrorMessage;

