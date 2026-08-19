import { useCallback, useState } from 'react';

export interface FacilityBookingMutation<TInput, TResult> {
  readonly data: TResult | null;
  readonly isPending: boolean;
  readonly error: Error | null;
  readonly mutate: (input: TInput) => Promise<TResult | null>;
  readonly reset: () => void;
}

export function useFacilityBookingMutation<TInput, TResult>(
  operation: (input: TInput) => Promise<TResult>,
): FacilityBookingMutation<TInput, TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (input: TInput) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await operation(input);
      setData(result);
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught : new Error('The facility action failed.'));
      return null;
    } finally {
      setIsPending(false);
    }
  }, [operation]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPending(false);
  }, []);

  return { data, isPending, error, mutate, reset };
}
