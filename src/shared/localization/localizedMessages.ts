import { enMessages, type EnglishMessagesType } from '../../messages/en';
import { SupportedLocale } from './language.models';
import { hiFunctionTranslations, hiStringTranslations } from './resources/hi-IN.generated';
import { mrFunctionTranslations, mrStringTranslations } from './resources/mr-IN.generated';

type MessageArgument = string | number;
type MessageFunction = (...args: MessageArgument[]) => string;
type MessageLeaf = string | MessageFunction;
type MessageNode = MessageLeaf | MessageTree;
type MessageTree = { readonly [key: string]: MessageNode };
type TranslationTable = Readonly<Record<string, string>>;

function applyArguments(template: string, args: MessageArgument[]): string {
  return args.reduce<string>(
    (message, value, index) => message.replaceAll(`__SOCIETYOS_ARG_${index}__`, String(value)),
    template,
  );
}

function localizeNode(
  node: MessageNode,
  path: string,
  stringTranslations: TranslationTable,
  functionTranslations: TranslationTable,
): MessageNode {
  if (typeof node === 'string') {
    return stringTranslations[path] ?? node;
  }

  if (typeof node === 'function') {
    return (...args: MessageArgument[]) => {
      const translatedTemplate = functionTranslations[path];
      if (translatedTemplate) {
        return applyArguments(translatedTemplate, args);
      }
      return node(...args);
    };
  }

  return Object.fromEntries(
    Object.entries(node).map(([key, value]) => {
      const childPath = path.length > 0 ? `${path}.${key}` : key;
      return [key, localizeNode(value, childPath, stringTranslations, functionTranslations)];
    }),
  ) as MessageTree;
}

function createLocalizedMessages(
  stringTranslations: TranslationTable,
  functionTranslations: TranslationTable,
): EnglishMessagesType {
  return localizeNode(
    enMessages as MessageTree,
    '',
    stringTranslations,
    functionTranslations,
  ) as EnglishMessagesType;
}

let hindiMessages: EnglishMessagesType | null = null;
let marathiMessages: EnglishMessagesType | null = null;

export function getMessagesForLocale(locale: SupportedLocale): EnglishMessagesType {
  if (locale === SupportedLocale.HindiIndia) {
    hindiMessages ??= createLocalizedMessages(hiStringTranslations, hiFunctionTranslations);
    return hindiMessages;
  }
  if (locale === SupportedLocale.MarathiIndia) {
    marathiMessages ??= createLocalizedMessages(mrStringTranslations, mrFunctionTranslations);
    return marathiMessages;
  }
  return enMessages;
}
