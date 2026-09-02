import { useNavigation, useRoute, type NavigationProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { RootTabParamList } from '../../../app/navigation/navigation.types';
import { AmbientPageChrome } from '../experience/AmbientPageChrome';
import type { ResidentAppHeaderProps } from './residentHeader.types';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { RESIDENT_ROUTE_FALLBACKS } from './residentRouteFallbacks';

export function ResidentAppHeader({
  titleKey,
  subtitleKey,
  showBackButton = false,
  actions,
  contextualAction,
  contextLabelKey,
  onBackPress,
  semantic = 'back',
  fallbackRoute,
  fallbackTab,
  includeSafeAreaTop = true,
  showNarrative = true,
  testID = 'resident-header-container',
}: ResidentAppHeaderProps) {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  let currentRouteName: string | undefined;
  try {
    const route = useRoute();
    currentRouteName = route?.name;
  } catch {
    currentRouteName = undefined;
  }

  const { dark } = useAppTheme();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (typeof navigation?.canGoBack === 'function' && navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    const fallbackConfig = currentRouteName ? RESIDENT_ROUTE_FALLBACKS[currentRouteName] : undefined;
    const targetTab = fallbackTab ?? fallbackConfig?.tab ?? 'HomeTab';
    const targetScreen = fallbackRoute ?? fallbackConfig?.screen ?? 'ResidentHome';

    if (typeof navigation?.navigate === 'function') {
      navigation.navigate(targetTab as any, { screen: targetScreen } as any);
    }
  };

  return (
    <>
      <StatusBar style={dark ? 'light' : 'dark'} />
      <AmbientPageChrome
        titleKey={titleKey}
        subtitleKey={subtitleKey}
        contextLabelKey={contextLabelKey}
        showBackButton={showBackButton}
        onBackPress={handleBackPress}
        semantic={semantic}
        includeSafeAreaTop={includeSafeAreaTop}
        showNarrative={showNarrative && Boolean(titleKey)}
        testID={testID}
        actions={actions}
        contextualAction={contextualAction}
      />
    </>
  );
}
