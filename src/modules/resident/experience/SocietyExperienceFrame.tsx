import { View } from 'react-native';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { AmbientPageChrome } from './AmbientPageChrome';
import { createBackgroundStyle, styles } from './styles/SocietyAmbientChrome.styles';

export function SocietyExperienceFrame({ children, showAmbientChrome = true }: { children: React.ReactNode; showAmbientChrome?: boolean }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.frame, createBackgroundStyle(theme.semantic.surface.canvas)]}>
      {showAmbientChrome ? <AmbientPageChrome showNarrative={false} /> : null}
      <View style={styles.frameContent}>{children}</View>
    </View>
  );
}
