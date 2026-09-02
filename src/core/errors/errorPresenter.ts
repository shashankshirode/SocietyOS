export type DomainErrorCode =
  | 'PERMISSION_DENIED'
  | 'FEATURE_DISABLED'
  | 'MEMBERSHIP_INACTIVE'
  | 'VALIDATION_ERROR'
  | 'STALE_STATE'
  | 'CONFLICT'
  | 'SLOT_UNAVAILABLE'
  | 'NOT_FOUND'
  | 'NETWORK_FAILURE'
  | 'DUPLICATE'
  | 'PASS_CANCELLED'
  | 'INTEGRATION_UNAVAILABLE';

export interface DomainError {
  code: DomainErrorCode;
  message: string;
  details?: Record<string, string | number | boolean>;
}

export function formatDomainError(error: DomainError | Error | string | null): string {
  if (!error) return 'An unexpected error occurred.';

  if (typeof error === 'string') return error;

  if (error instanceof Error) {
    return error.message || 'An error occurred while processing your request.';
  }

  if (error.message) {
    return error.message;
  }

  switch (error.code) {
    case 'PERMISSION_DENIED':
      return 'You do not have permission to perform this action.';
    case 'FEATURE_DISABLED':
      return 'This feature is currently not enabled for your society.';
    case 'MEMBERSHIP_INACTIVE':
      return 'Your unit relationship or membership is inactive.';
    case 'STALE_STATE':
      return 'Your active context has changed. Please refresh and try again.';
    case 'CONFLICT':
    case 'SLOT_UNAVAILABLE':
      return 'The requested slot or resource is no longer available. Please select another.';
    case 'PASS_CANCELLED':
      return 'This pass has been cancelled and cannot be used.';
    case 'NETWORK_FAILURE':
      return 'Network connection issue. Please check your connection and retry.';
    default:
      return 'An error occurred while processing your request. Please try again.';
  }
}
