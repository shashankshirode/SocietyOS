import type { RepositoryError } from '../../core/repositories/repository.types';
import type { Absent } from "../types/absence.types";
const permissionCodes = ['403', 'UNAUTHORIZED', 'FORBIDDEN', 'PERMISSION', 'RBAC', 'DENIED'];
export function toSafeUserMessage(error: RepositoryError | Error | string | null | Absent): string {
    if (!error) {
        return 'Unable to complete the request.';
    }
    const message = typeof error === 'string' ? error : error.message;
    const code = typeof error === 'object' && 'code' in error ? error.code : '';
    const combined = `${code} ${message}`.toUpperCase();
    if (permissionCodes.some((token) => combined.includes(token))) {
        return 'You do not have permission to view this information.';
    }
    if (combined.includes('TOKEN') || combined.includes('AUTHORIZATION')) {
        return 'Your session could not be verified. Please try again later.';
    }
    if (message.length > 180 || /society-\d|unit-|document-|stack|trace/i.test(message)) {
        return 'Unable to complete the request.';
    }
    return message;
}

