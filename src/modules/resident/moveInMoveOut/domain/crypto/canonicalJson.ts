import type { Absent } from '../../../../../shared/types/absence.types';
import { getRequiredItem } from '../../../../../shared/utils/requiredItem';
import { sha256Hex } from './sha256';

export type CanonicalValue =
  | string
  | number
  | boolean
  | null
  | readonly CanonicalValue[]
  | { readonly [key: string]: CanonicalValue };

export type CanonicalPart = {
  readonly key: string;
  readonly value: CanonicalValue | Absent;
};

const FIELD_SEPARATOR = '|';
const PAIR_SEPARATOR = '=';
const KEY_SEPARATOR = ':';
const VALUE_SEPARATOR = ',';

function isPlainObject(value: CanonicalValue): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    throw new Error('CANONICAL_NUMBER_NOT_FINITE');
  }
  if (Number.isInteger(value) && Math.abs(value) < 1e21) {
    return value.toFixed(0);
  }
  return JSON.stringify(value);
}

function formatString(value: string): string {
  return JSON.stringify(value);
}

function formatScalar(value: CanonicalValue): string {
  if (value === null) {
    return 'null';
  }
  if (typeof value === 'string') {
    return formatString(value);
  }
  if (typeof value === 'number') {
    return formatNumber(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  throw new Error('CANONICAL_VALUE_UNSUPPORTED');
}

function formatValue(value: CanonicalValue): string {
  if (Array.isArray(value)) {
    const elements = value.map(formatValue);
    return `[${elements.join(VALUE_SEPARATOR)}]`;
  }
  if (isPlainObject(value)) {
    const record = value as { readonly [key: string]: CanonicalValue };
    const keys = Object.keys(record).sort();
    const entries = keys.map((key) => `${formatString(key)}${KEY_SEPARATOR}${formatValue(getRecordValue(record, key))}`);
    return `{${entries.join(VALUE_SEPARATOR)}}`;
  }
  return formatScalar(value);
}

function getRecordValue(
  record: { readonly [key: string]: CanonicalValue },
  key: string,
): CanonicalValue {
  return record[key] as CanonicalValue;
}

export function canonicalStringify(value: CanonicalValue): string {
  return formatValue(value);
}

export function canonicalPreimage(namespace: string, parts: readonly CanonicalPart[]): string {
  const segments: string[] = [namespace];
  const ordered = [...parts].sort((left, right) => (left.key < right.key ? -1 : left.key > right.key ? 1 : 0));
  for (const part of ordered) {
    const rendered =
      part.value === undefined
        ? 'absent'
        : isPlainObject(part.value) || Array.isArray(part.value)
          ? formatValue(part.value)
          : formatScalar(part.value);
    segments.push(`${part.key}${PAIR_SEPARATOR}${rendered}`);
  }
  return segments.join(FIELD_SEPARATOR);
}

export function canonicalPreimageSha256(namespace: string, parts: readonly CanonicalPart[]): string {
  return sha256Hex(canonicalPreimage(namespace, parts));
}

export function requiredPart(
  key: string,
  value: CanonicalValue | Absent,
): CanonicalPart {
  if (value === undefined) {
    throw new Error(`CANONICAL_PART_REQUIRED:${key}`);
  }
  return { key, value };
}

export function optionalPart(
  key: string,
  value: CanonicalValue | Absent,
): CanonicalPart {
  return { key, value };
}

export function requiredString(key: string, value: string): CanonicalPart {
  if (value.length === 0) {
    throw new Error(`CANONICAL_STRING_REQUIRED:${key}`);
  }
  return { key, value };
}

export function requiredNumber(key: string, value: number): CanonicalPart {
  return { key, value };
}

export function sortedStringListPart(
  key: string,
  values: readonly string[],
): CanonicalPart {
  return { key, value: [...values].sort() };
}

export function stringListPart(key: string, values: readonly string[]): CanonicalPart {
  return { key, value: [...values] };
}

export function readPartValue(parts: readonly CanonicalPart[], key: string): CanonicalValue {
  const match = parts.find((part) => part.key === key);
  if (match === undefined) {
    throw new Error(`CANONICAL_PART_MISSING:${key}`);
  }
  return getRequiredItem(parts, parts.indexOf(match), 'canonicalPart').value as CanonicalValue;
}
