import { View, type ViewStyle } from 'react-native';
import type { Absent } from '../../../shared/types/absence.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { resolveResidentMessage, type MessageTree } from '../navigation/ResidentHeaderTitle';
import type { MessageKey, ResidentHeaderAction } from '../navigation/residentHeader.types';
import { ResidentHeaderActions } from '../navigation/ResidentHeaderActions';
import { EdgeReturn, type ReturnSemantic } from './EdgeReturn';
import { IdentityOrb } from './IdentityOrb';
import { ResidenceBeacon } from './ResidenceBeacon';
import { NarrativeHero } from './NarrativeHero';
import { createBackgroundStyle, createChromeInsetStyle, styles } from './styles/SocietyAmbientChrome.styles';

type AmbientPageChromeProps = {
  titleKey?: MessageKey | Absent;
  subtitleKey?: MessageKey | Absent;
  contextLabelKey?: MessageKey | Absent;
  showBackButton?: boolean;
  onBackPress?: (() => void) | Absent;
  semantic?: ReturnSemantic;
  includeSafeAreaTop?: boolean;
  showNarrative?: boolean;
  testID?: string;
  actions?: ResidentHeaderAction[] | Absent;
  contextualAction?: React.ReactNode | Absent;
  style?: ViewStyle | Absent;
};

export function AmbientPageChrome({
  titleKey,
  subtitleKey,
  contextLabelKey,
  showBackButton = false,
  onBackPress,
  semantic = 'back',
  includeSafeAreaTop = true,
  showNarrative = true,
  testID = 'resident-header-container',
  actions,
  contextualAction,
  style,
}: AmbientPageChromeProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const messages = useMessages();
  const tree = messages as MessageTree;
  const title = titleKey ? resolveResidentMessage(tree, titleKey) : undefined;
  const subtitle = subtitleKey ? resolveResidentMessage(tree, subtitleKey) : undefined;
  const contextLabel = contextLabelKey ? resolveResidentMessage(tree, contextLabelKey) : undefined;

  return (
    <View testID={testID} style={[styles.chrome, createChromeInsetStyle(includeSafeAreaTop ? insets.top : 0), style]}>
      <View style={styles.controls}>
        {showBackButton && onBackPress ? <EdgeReturn onPress={onBackPress} semantic={semantic} /> : null}
        <ResidenceBeacon />
        <IdentityOrb />
      </View>
      {showNarrative && title ? <NarrativeHero title={title} subtitle={subtitle} contextLabel={contextLabel} /> : null}
      {actions && actions.length > 0 ? (
        <View style={[styles.contextualActions, createBackgroundStyle(theme.semantic.surface.soft)]}>
          <ResidentHeaderActions actions={actions} iconColor={theme.semantic.text.primary} badgeBackgroundColor={theme.semantic.status.danger} badgeTextColor={theme.semantic.text.inverse} />
        </View>
      ) : null}
      {contextualAction ? <View style={[styles.contextualActions, createBackgroundStyle(theme.semantic.surface.soft)]}>{contextualAction}</View> : null}
    </View>
  );
}
