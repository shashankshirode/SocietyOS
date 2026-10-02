import { NavigationOnlyScreenProps } from '../../../app/navigation/navigation.types';
import { AutomationPlaceholderScreen } from './AutomationPlaceholderScreen';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

export function MeetingSummaryGeneratorPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  return (
    <AutomationPlaceholderScreen
      featureName={localizedUiText.m_capability_meeting_summary || 'Meeting Summary Generator'}
      description={localizedUiText.m_placeholder_meeting_summary || 'AI-generated meeting summaries and action items'}
      navigation={navigation}
    />
  );
}