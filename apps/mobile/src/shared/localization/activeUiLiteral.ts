import { getActiveLocale } from '../../core/localization/activeLocale';
import type { UiLiteralKey } from '../../messages/en/uiLiterals.generated';
import { resolveSupportedLocale } from './language.constants';
import { getMessagesForLocale } from './localizedMessages';

export function getActiveUiLiteral(key: UiLiteralKey): string {
  const locale = resolveSupportedLocale(getActiveLocale());
  return getMessagesForLocale(locale).uiLiterals[key];
}
