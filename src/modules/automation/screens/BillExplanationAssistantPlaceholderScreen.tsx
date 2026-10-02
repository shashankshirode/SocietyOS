import { NavigationOnlyScreenProps } from '../../../app/navigation/navigation.types';
import { AutomationPlaceholderScreen } from './AutomationPlaceholderScreen';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

export function BillExplanationAssistantPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  return (
    <AutomationPlaceholderScreen
      featureName={localizedUiText.m_capability_bill_explanation || 'Bill Explanation Assistant'}
      description={localizedUiText.m_placeholder_bill_explanation || 'AI-powered bill explanation with deterministic fallback'}
      navigation={navigation}
    />
  );
}