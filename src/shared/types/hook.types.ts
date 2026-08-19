import { AppError } from '../../core/errors/AppError';

export type QueryHookResult<T> = {
  data: T | null;
  isLoading: boolean;
  error: AppError | null;
  refetch: () => Promise<void>;
};

export type MutationHookResult<TInput, TResult> = {
  submit: (input: TInput) => Promise<TResult>;
  isSubmitting: boolean;
  error: AppError | null;
  reset: () => void;
};
