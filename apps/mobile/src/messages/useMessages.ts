import { enMessages, type EnglishMessagesType } from './en';
import { useOptionalLanguage } from '../shared/localization/LanguageProvider';

export function useMessages(): EnglishMessagesType {
  return useOptionalLanguage()?.messages ?? enMessages;
}

export default useMessages;
