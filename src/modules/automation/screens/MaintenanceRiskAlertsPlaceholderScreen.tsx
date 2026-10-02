import { NavigationOnlyScreenProps } from '../../../app/navigation/navigation.types';
import { AutomationPlaceholderScreen } from './AutomationPlaceholderScreen';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

export function MaintenanceRiskAlertsPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  return (
    <AutomationPlaceholderScreen
      featureName={localizedUiText.m_capability_maintenance_risk || 'Maintenance Risk Alerts'}
      description={localizedUiText.m_placeholder_maintenance_risk || 'Asset risk assessment and predictive maintenance alerts'}
      navigation={navigation}
    />
  );
}