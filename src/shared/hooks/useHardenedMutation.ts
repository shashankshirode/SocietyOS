import * as React from 'react';
import { useRepositoryMutation, type UseRepositoryMutationOptions } from '../../core/repositories/useRepositoryMutation';
import { auditService, createAuditEntry } from '../../core/audit';
import { createIdempotencyKey } from '../../core/api/idempotency';
import type { RepositoryResult, RepositoryError } from '../../core/repositories/repository.types';

export type HardenedMutationOptions<TInput, TOutput> = UseRepositoryMutationOptions<TInput, TOutput> & {
  enableOfflineQueue?: boolean;
  retryConfig?: {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
  };
  validationSchema?: (input: TInput) => { valid: boolean; errors: Record<string, string> };
};

export function useHardenedMutation<TInput, TOutput>(
  mutation: (input: TInput, idempotencyKey: string) => Promise<RepositoryResult<TOutput>>,
  options: HardenedMutationOptions<TInput, TOutput> = {}
) {
  const {
    enableOfflineQueue = true,
    retryConfig = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000, backoffMultiplier: 2 },
    validationSchema,
    ...mutationOptions
  } = options;

  const baseMutation = React.useCallback(async (input: TInput, idempotencyKey: string) => {
    if (validationSchema) {
      const validation = validationSchema(input);
      if (!validation.valid) {
        return {
          ok: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Input validation failed',
            category: 'VALIDATION' as const,
            fieldErrors: Object.entries(validation.errors).map(([field, message]) => ({ field, message })),
          },
        } as const;
      }
    }

    let attempt = 0;
    while (true) {
      try {
        const result = await mutation(input, idempotencyKey);
        return result;
      } catch (error) {
        attempt++;
        if (attempt > retryConfig.maxRetries) throw error;

        const delay = Math.min(
          retryConfig.baseDelayMs * Math.pow(retryConfig.backoffMultiplier, attempt - 1),
          retryConfig.maxDelayMs
        );
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }, [mutation, validationSchema, retryConfig]);

  const enhancedOptions: UseRepositoryMutationOptions<TInput, TOutput> = {
    ...mutationOptions,
    onMutate: (input: TInput) => {
      mutationOptions.onMutate?.(input);
    },
    onSuccess: (data: TOutput, input: TInput) => {
      mutationOptions.onSuccess?.(data, input);
    },
    onError: (error: RepositoryError, input: TInput) => {
      mutationOptions.onError?.(error, input);
    },
  };

  return useRepositoryMutation(baseMutation, enhancedOptions);
}

export function withRetry<T>(
  fn: () => Promise<T>,
  config: { maxRetries: number; baseDelayMs: number; maxDelayMs: number; backoffMultiplier: number } = { maxRetries: 3, baseDelayMs: 1000, maxDelayMs: 30000, backoffMultiplier: 2 }
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    let attempt = 0;
    while (true) {
      try {
        const result = await fn();
        resolve(result);
        return;
      } catch (error) {
        attempt++;
        if (attempt > config.maxRetries) {
          reject(error);
          return;
        }
        const delay = Math.min(
          config.baseDelayMs * Math.pow(config.backoffMultiplier, attempt - 1),
          config.maxDelayMs
        );
        await new Promise(r => setTimeout(r, delay));
      }
    }
  });
}

export function createHardenedFormHandler<T>(
  submit: (data: T) => Promise<void>,
  options: {
    validate: (data: T) => { valid: boolean; errors: Record<string, string> };
    onSuccess?: (data: T) => void;
    onError?: (errors: Record<string, string>) => void;
  }
) {
  return async (data: T) => {
    const validation = options.validate(data);
    if (!validation.valid) {
      options.onError?.(validation.errors);
      return;
    }

    try {
      await submit(data);
      options.onSuccess?.(data);
    } catch (error) {
      options.onError?.({ submit: error instanceof Error ? error.message : 'Submission failed' });
    }
  };
}

export class OfflineQueue<T> {
  private queue: Array<{
    id: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: string;
    entityId: string;
    data: T;
    timestamp: string;
    retries: number;
  }> = [];
  private processing = false;
  private listeners: Array<(queue: typeof this.queue) => void> = [];
  private syncFn: ((item: typeof this.queue[0]) => Promise<void>) | null = null;
  private maxRetries = 5;

  constructor(private storageKey: string) {
    this.loadFromStorage();
  }

  setSyncFunction(fn: (item: typeof this.queue[0]) => Promise<void>): void {
    this.syncFn = fn;
  }

  private loadFromStorage(): void {
    try {
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      if (stored) this.queue = JSON.parse(stored);
    } catch (error) {
      console.error('[OfflineQueue] Failed to load:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(this.queue));
      }
    } catch (error) {
      console.error('[OfflineQueue] Failed to save:', error);
    }
  }

  enqueue(operation: 'CREATE' | 'UPDATE' | 'DELETE', entityType: string, entityId: string, data: T): void {
    this.queue.push({
      id: `off_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`,
      operation,
      entityType,
      entityId,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  async processQueue(): Promise<void> {
    if (this.processing || !this.syncFn || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue[0];
      if (!item) break;
      try {
        await this.syncFn(item);
        this.queue.shift();
        this.saveToStorage();
        this.notifyListeners();
      } catch (error) {
        item.retries++;
        if (item.retries >= this.maxRetries) {
          this.queue.shift();
          this.saveToStorage();
          this.notifyListeners();
        } else {
          break;
        }
      }
    }

    this.processing = false;
  }

  getQueue(): typeof this.queue {
    return [...this.queue];
  }

  onChange(listener: (queue: typeof this.queue) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const idx = this.listeners.indexOf(listener);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(l => l(this.queue));
  }
}

export function useOfflineQueue<T>(storageKey: string) {
  const [queue, setQueue] = React.useState<Array<{
    id: string;
    operation: 'CREATE' | 'UPDATE' | 'DELETE';
    entityType: string;
    entityId: string;
    data: T;
    timestamp: string;
    retries: number;
  }>>([]);

  React.useEffect(() => {
    const q = new OfflineQueue<T>(storageKey);
    setQueue(q.getQueue());
    const unsubscribe = q.onChange((updated) => setQueue([...updated]));
    return () => unsubscribe();
  }, [storageKey]);

  return queue;
}

export function createAccessibilityProps(
  label: string,
  options?: {
    required?: boolean;
    invalid?: boolean;
    describedBy?: string;
    liveRegion?: 'polite' | 'assertive';
  }
) {
  const props: React.AriaAttributes & React.HTMLAttributes<HTMLElement> = {
    'aria-label': label,
    'aria-required': options?.required ?? false,
    'aria-invalid': options?.invalid ?? false,
    'aria-describedby': options?.describedBy,
    'aria-live': options?.liveRegion,
  };
  return props;
}

export function useFocusTrap(enabled: boolean) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleTab);
  }, [enabled]);

  return containerRef;
}

export function useAnnouncer() {
  const [announcements, setAnnouncements] = React.useState<string[]>([]);

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1));
    }, 3000);
  }, []);

  return { announcements, announce };
}