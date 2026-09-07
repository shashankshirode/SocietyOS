import { useState, useCallback, useRef } from 'react';
import { formatDomainError, type DomainError } from '../errors/errorPresenter';

export interface CommandOptions<TInput, TOutput> {
  action: (input: TInput) => Promise<{ ok: true; data: TOutput } | { ok: false; error: DomainError | Error }>;
  onSuccess?: (data: TOutput) => void;
  onError?: (error: DomainError | Error) => void;
}

export interface CommandState<TInput, TOutput> {
  isExecuting: boolean;
  error: string | null;
  data: TOutput | null;
  execute: (input: TInput) => Promise<{ ok: boolean; data?: TOutput; error?: string }>;
  reset: () => void;
}

export function useDomainCommand<TInput = void, TOutput = void>(
  options: CommandOptions<TInput, TOutput>
): CommandState<TInput, TOutput> {
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TOutput | null>(null);
  const isExecutingRef = useRef(false);

  const execute = useCallback(
    async (input: TInput) => {
      if (isExecutingRef.current) {
        return { ok: false, error: 'Command already in progress' };
      }

      try {
        isExecutingRef.current = true;
        setIsExecuting(true);
        setError(null);

        const result = await options.action(input);

        if (result.ok) {
          setData(result.data);
          options.onSuccess?.(result.data);
          return { ok: true, data: result.data };
        } else {
          const formatted = formatDomainError(result.error);
          setError(formatted);
          options.onError?.(result.error);
          return { ok: false, error: formatted };
        }
      } catch (err) {
        const errorObject = err instanceof Error ? err : new Error('An unexpected error occurred.');
        const formatted = formatDomainError(errorObject);
        setError(formatted);
        options.onError?.(errorObject);
        return { ok: false, error: formatted };
      } finally {
        isExecutingRef.current = false;
        setIsExecuting(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
    setIsExecuting(false);
    isExecutingRef.current = false;
  }, []);

  return {
    isExecuting,
    error,
    data,
    execute,
    reset,
  };
}
