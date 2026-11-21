import type { AppError } from './AppError';
import type { RepositoryError } from '../repositories/repository.types';
import { includeWhenPresent } from "../../shared/utils/presentProperty";
export function mapRepositoryErrorToAppError(repoError: RepositoryError, defaultUserMessage = 'Unable to complete the request.'): AppError {
    const fieldErrors: Record<string, string> = {};
    if (repoError.fieldErrors) {
        for (const fe of repoError.fieldErrors) {
            fieldErrors[fe.field] = fe.message;
        }
    }
    return {
        code: repoError.code,
        message: repoError.message,
        userMessage: repoError.message || defaultUserMessage,
        ...includeWhenPresent("fieldErrors", Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined)
    };
}
export function mapUnknownErrorToAppError(error: JsonValue, defaultUserMessage = 'An unexpected error occurred.'): AppError {
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        const err = error;
        return {
            code: String(err.code || 'UNKNOWN_ERROR'),
            message: String(err.message || 'Unknown error'),
            userMessage: String(err.userMessage || err.message || defaultUserMessage)
        };
    }
    const message = error instanceof Error ? error.message : String(error);
    return {
        code: 'UNKNOWN_ERROR',
        message,
        userMessage: defaultUserMessage
    };
}
export default { mapRepositoryErrorToAppError, mapUnknownErrorToAppError };

