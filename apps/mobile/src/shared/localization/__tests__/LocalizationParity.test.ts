import { enMessages } from '../../../messages/en';
import { hiFunctionTranslations, hiStringTranslations } from '../resources/hi-IN.generated';
import { mrFunctionTranslations, mrStringTranslations } from '../resources/mr-IN.generated';
import { getMessagesForLocale } from '../localizedMessages';
import { SupportedLocale } from '../language.models';

type MessageArgument = string | number;
type MessageFunction = (...args: MessageArgument[]) => string;
type MessageNode = string | MessageFunction | MessageTree;
type MessageTree = { readonly [key: string]: MessageNode };

function collectPaths(messages: MessageTree) {
  const stringPaths: string[] = [];
  const functionPaths: string[] = [];
  const visit = (node: MessageNode, path: string) => {
    if (typeof node === 'string') {
      stringPaths.push(path);
      return;
    }
    if (typeof node === 'function') {
      functionPaths.push(path);
      return;
    }
    Object.entries(node).forEach(([key, value]) => {
      visit(value, path.length > 0 ? `${path}.${key}` : key);
    });
  };
  visit(messages, '');
  return { stringPaths, functionPaths };
}

describe('localized message resources', () => {
  const paths = collectPaths(enMessages as MessageTree);

  it.each([
    ['Hindi', hiStringTranslations, hiFunctionTranslations],
    ['Marathi', mrStringTranslations, mrFunctionTranslations],
  ])('keeps complete English key parity for %s', (_name, strings, functions) => {
    expect(Object.keys(strings)).toHaveLength(paths.stringPaths.length);
    expect(Object.keys(functions)).toHaveLength(paths.functionPaths.length);
    paths.stringPaths.forEach((path) => {
      expect(Object.prototype.hasOwnProperty.call(strings, path)).toBe(true);
    });
    paths.functionPaths.forEach((path) => {
      expect(Object.prototype.hasOwnProperty.call(functions, path)).toBe(true);
    });
  });

  it('returns localized static and interpolated messages', () => {
    const hindi = getMessagesForLocale(SupportedLocale.HindiIndia);
    const marathi = getMessagesForLocale(SupportedLocale.MarathiIndia);

    expect(hindi.common.save).toBe('सहेजें');
    expect(marathi.common.save).toBe('जतन करा');
    expect(hindi.common.supportCode('ABC-42')).toContain('ABC-42');
    expect(marathi.common.supportCode('ABC-42')).toContain('ABC-42');
  });
});
