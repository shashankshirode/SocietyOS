import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenContainer } from '../../../shared/layouts/ScreenContainer';
import { ResponsivePageHeader } from '../../../shared/layouts/ResponsivePageHeader';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../../shared/constants/colors';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages as useGeneratedUiMessages } from '../../../messages/useMessages';

interface Props {
  featureName: string;
  description: string;
  navigation?: any;
}

export function AutomationPlaceholderScreen({ featureName, description, navigation }: Props) {
  const localizedUiText = useGeneratedUiMessages().uiLiterals;
  const { colors } = useAppTheme();

  return (
    <ScreenContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <ResponsivePageHeader
          title={featureName}
          subtitle={localizedUiText.m_automation_feature_disabled || 'Feature not yet implemented'}
          onBack={() => navigation?.goBack()}
        />
        <View style={{ flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="construct" size={64} color={Colors.textSecondary} />
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.textPrimary, marginTop: 16, textAlign: 'center' }}>
            {featureName}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
            {description}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 16, textAlign: 'center' }}>
            {localizedUiText.m_automation_coming_soon || 'This capability will be available in a future release.'}
          </Text>
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
}