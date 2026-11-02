/**
 * Lightweight, zero-dependency runtime DTO decoders for SocietyOS API boundary.
 *
 * External JSON responses are untrusted until validated by a Decoder.
 * Decoders ensure malformed or unexpected server payloads fail fast at the transport
 * boundary before corrupting domain or presentation layers.
 */

export interface DecodeFailure {
  readonly ok: false;
  readonly path: string;
  readonly expected: string;
  readonly received: string;
  readonly message: string;
}

export interface DecodeSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

export type DecodeResult<T> = DecodeSuccess<T> | DecodeFailure;

export type Decoder<T> = (input: unknown, path?: string) => DecodeResult<T>;

export class ApiContractError extends Error {
  readonly path: string;
  readonly expected: string;
  readonly received: string;

  constructor(failure: Omit<DecodeFailure, 'ok'>) {
    super(`API Contract Violation at '${failure.path}': expected ${failure.expected}, got ${failure.received}`);
    this.name = 'ApiContractError';
    this.path = failure.path;
    this.expected = failure.expected;
    this.received = failure.received;
  }
}

export function decodeOrThrow<T>(decoder: Decoder<T>, input: unknown, contextName = 'payload'): T {
  const result = decoder(input, contextName);
  if (!result.ok) {
    throw new ApiContractError(result);
  }
  return result.value;
}

function describe(val: unknown): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (Array.isArray(val)) return `Array(length: ${val.length})`;
  return typeof val;
}

export const D = {
  string: (input: unknown, path = '$'): DecodeResult<string> => {
    if (typeof input === 'string') {
      return { ok: true, value: input };
    }
    return {
      ok: false,
      path,
      expected: 'string',
      received: describe(input),
      message: `Expected string at ${path}, received ${describe(input)}`,
    };
  },

  nonEmptyString: (input: unknown, path = '$'): DecodeResult<string> => {
    if (typeof input === 'string' && input.trim().length > 0) {
      return { ok: true, value: input.trim() };
    }
    return {
      ok: false,
      path,
      expected: 'non-empty string',
      received: typeof input === 'string' ? 'empty string' : describe(input),
      message: `Expected non-empty string at ${path}`,
    };
  },

  number: (input: unknown, path = '$'): DecodeResult<number> => {
    if (typeof input === 'number' && !Number.isNaN(input) && Number.isFinite(input)) {
      return { ok: true, value: input };
    }
    return {
      ok: false,
      path,
      expected: 'number',
      received: describe(input),
      message: `Expected finite number at ${path}, received ${describe(input)}`,
    };
  },

  boolean: (input: unknown, path = '$'): DecodeResult<boolean> => {
    if (typeof input === 'boolean') {
      return { ok: true, value: input };
    }
    return {
      ok: false,
      path,
      expected: 'boolean',
      received: describe(input),
      message: `Expected boolean at ${path}, received ${describe(input)}`,
    };
  },

  optional: <T>(decoder: Decoder<T>): Decoder<T | undefined> => {
    return (input: unknown, path = '$'): DecodeResult<T | undefined> => {
      if (input === undefined || input === null) {
        return { ok: true, value: undefined };
      }
      return decoder(input, path);
    };
  },

  oneOf: <T extends string | number>(allowed: readonly T[]): Decoder<T> => {
    return (input: unknown, path = '$'): DecodeResult<T> => {
      if (allowed.includes(input as T)) {
        return { ok: true, value: input as T };
      }
      return {
        ok: false,
        path,
        expected: `one of [${allowed.join(', ')}]`,
        received: String(input),
        message: `Expected one of [${allowed.join(', ')}] at ${path}, received '${String(input)}'`,
      };
    };
  },

  array: <T>(elementDecoder: Decoder<T>): Decoder<T[]> => {
    return (input: unknown, path = '$'): DecodeResult<T[]> => {
      if (!Array.isArray(input)) {
        return {
          ok: false,
          path,
          expected: 'Array',
          received: describe(input),
          message: `Expected Array at ${path}, received ${describe(input)}`,
        };
      }
      const values: T[] = [];
      for (let i = 0; i < input.length; i++) {
        const itemResult = elementDecoder(input[i], `${path}[${i}]`);
        if (!itemResult.ok) {
          return itemResult;
        }
        values.push(itemResult.value);
      }
      return { ok: true, value: values };
    };
  },

  object: <Shape extends Record<string, Decoder<unknown>>>(
    schema: Shape
  ): Decoder<{ [K in keyof Shape]: Shape[K] extends Decoder<infer Out> ? Out : never }> => {
    return (input: unknown, path = '$') => {
      if (typeof input !== 'object' || input === null || Array.isArray(input)) {
        return {
          ok: false,
          path,
          expected: 'Object',
          received: describe(input),
          message: `Expected Object at ${path}, received ${describe(input)}`,
        };
      }
      const record = input as Record<string, unknown>;
      const output: Record<string, unknown> = {};

      for (const [key, fieldDecoder] of Object.entries(schema)) {
        const fieldResult = fieldDecoder(record[key], `${path}.${key}`);
        if (!fieldResult.ok) {
          return fieldResult as DecodeFailure;
        }
        if (fieldResult.value !== undefined) {
          output[key] = fieldResult.value;
        }
      }

      return {
        ok: true,
        value: output as { [K in keyof Shape]: Shape[K] extends Decoder<infer Out> ? Out : never },
      };
    };
  },
};
