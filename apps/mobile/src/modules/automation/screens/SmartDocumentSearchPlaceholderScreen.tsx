import { NavigationOnlyScreenProps } from '../../../app/navigation/navigation.types';
import { AutomationPlaceholderScreen } from './AutomationPlaceholderScreen';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

export function SmartDocumentSearchPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  return (
    <AutomationPlaceholderScreen
      featureName={localizedUiText.m_capability_document_search || 'Smart Document Search'}
      description={localizedUiText.m_placeholder_document_search || 'Permission-safe document search with AI'}
      navigation={navigation}
    />
  );
}