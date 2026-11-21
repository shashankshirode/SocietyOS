import { View } from 'react-native';
import type { Absent } from '../../../shared/types/absence.types';
import { SafeText } from '../../../shared/components/SafeText';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { createColorStyle, styles } from './styles/SocietyAmbientChrome.styles';

export function NarrativeHero({ title, subtitle, contextLabel }: { title: string; subtitle?: string | Absent; contextLabel?: string | Absent }) {
  const theme = useAppTheme();
  return (
    <View style={styles.narrative}>
      {contextLabel ? <SafeText variant="tiny" style={[styles.narrativeEyebrow, createColorStyle(theme.semantic.accent.moss)]}>{contextLabel}</SafeText> : null}
      <SafeText variant="h1" color="primary" style={styles.title}>{title}</SafeText>
      {subtitle ? <SafeText variant="body" color="secondary" style={styles.subtitle}>{subtitle}</SafeText> : null}
    </View>
  );
}
