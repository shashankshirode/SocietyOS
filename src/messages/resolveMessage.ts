import {
  DevelopmentDiagnosticCode,
  reportDevelopmentDiagnostic,
} from '../core/diagnostics/developmentDiagnostics';
import { enMessages, type EnglishMessagesType } from './en';

type MessageArgument = string | number;
type MessageFunction = (...args: MessageArgument[]) => string;
type MessageLeaf = string | MessageFunction;
type MessageNode = MessageLeaf | MessageTree;
type MessageTree = { readonly [key: string]: MessageNode };

function interpolate(template: string, values: Readonly<Record<string, MessageArgument>>): string {
  return Object.entries(values).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function findMessage(messages: EnglishMessagesType, key: string): MessageLeaf | null {
  const segments = key.split('.');
  let current: MessageNode = messages as MessageTree;
  for (const segment of segments) {
    if (typeof current === 'string' || typeof current === 'function') return null;
    if (!(segment in current)) return null;
    const next: MessageNode | null = current[segment] ?? null;
    if (!next) return null;
    current = next;
  }
  return typeof current === 'string' || typeof current === 'function' ? current : null;
}

function humanizeKey(key: string): string {
  const parts = key.split('.');
  const lastSegment = parts[parts.length - 1] ?? key;
  return lastSegment
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function resolveLeaf(
  leaf: MessageLeaf,
  values: Readonly<Record<string, MessageArgument>>,
): string {
  if (typeof leaf === 'string') return interpolate(leaf, values);
  return leaf(...Object.values(values));
}

export function resolveMessage(
  messages: EnglishMessagesType,
  key: string,
  values: Readonly<Record<string, MessageArgument>> = {},
): string {
  const localizedLeaf = findMessage(messages, key);
  if (localizedLeaf) {
    try {
      return resolveLeaf(localizedLeaf, values);
    } catch {
      reportDevelopmentDiagnostic(DevelopmentDiagnosticCode.MissingMessage, key);
    }
  }

  const englishLeaf = findMessage(enMessages, key);
  if (englishLeaf) {
    try {
      return resolveLeaf(englishLeaf, values);
    } catch {
      reportDevelopmentDiagnostic(DevelopmentDiagnosticCode.MissingMessage, key);
    }
  }

  reportDevelopmentDiagnostic(DevelopmentDiagnosticCode.MissingMessage, key);
  return humanizeKey(key);
}
