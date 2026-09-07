import { useNavigation, useRoute, type NavigationProp } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import type { RootTabParamList } from '../../../app/navigation/navigation.types';
import { AmbientPageChrome } from '../experience/AmbientPageChrome';
import type { ResidentAppHeaderProps } from './residentHeader.types';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { performBackNavigation } from '../../../shared/navigation/performBackNavigation';

const validTabs = ['HomeTab', 'ActivityTab', 'CommunityTab', 'ServicesTab', 'VisitorTab', 'ComplaintTab', 'BillTab', 'ChatTab'] as const;

function isValidTab(tab: string): tab is keyof RootTabParamList {
  return (validTabs as readonly string[]).includes(tab);
}

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
  let currentRouteName: string | null = null;
  try {
    const route = useRoute();
    currentRouteName = route?.name ?? null;
  } catch {
    currentRouteName = null;
  }

  const { dark } = useAppTheme();

  const handleBackPress = () => {
    performBackNavigation(navigation, {
      customHandler: onBackPress,
      fallbackTab,
      fallbackRoute,
      currentRouteName: currentRouteName ?? undefined,
    });
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
