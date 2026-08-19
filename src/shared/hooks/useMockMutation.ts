import { useCallback, useState } from 'react';
import type { MockResult } from '../mock/mockResult';

export type MockMutationState<TOutput> = {
  data: TOutput | null;
  isSubmitting: boolean;
  isSuccess: boolean;
  errorMessage: string | null;
  submit: () => Promise<MockResult<TOutput>>;
  reset: () => void;
};

export function useMockMutation<TOutput>(
  mutation: () => Promise<MockResult<TOutput>>
): MockMutationState<TOutput> {
  const [data, setData] = useState<TOutput | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setIsSubmitting(true);
    const result = await mutation();
    setIsSubmitting(false);

    if (result.ok) {
      setData(result.data);
      setIsSuccess(true);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error.message);
      setIsSuccess(false);
    }

    return result;
  }, [mutation]);

  const reset = useCallback(() => {
    setData(null);
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrorMessage(null);
  }, []);

  return { data, isSubmitting, isSuccess, errorMessage, submit, reset };
}

