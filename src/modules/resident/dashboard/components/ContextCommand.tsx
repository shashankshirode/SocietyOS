import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { FadeInView, PressableScale } from '../../../../shared/motion';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import type { ResidentPriorityItem } from '../data/dashboard.types';
import { createCommandSurfaceStyle, createLabelStyle, styles } from '../styles/components/ContextCommand.styles';

type ContextCommandProps = {
  sectionLabel: string;
  item: ResidentPriorityItem;
  onPress: () => void;
};

export function ContextCommand({ sectionLabel, item, onPress }: ContextCommandProps) {
  const { colors } = useAppTheme();
  return (
    <FadeInView style={styles.section}>
      <SafeText variant="title" color="primary">{sectionLabel}</SafeText>
      <PressableScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.actionLabel}: ${item.title}`}
        style={[styles.surface, createCommandSurfaceStyle(colors.primarySoft)]}
      >
        <View style={styles.icon}><Ionicons name={item.iconName} size={25} color={colors.primary} /></View>
        <View style={styles.copy}>
          <SafeText variant="tiny" style={createLabelStyle(colors.success)}>{item.metaLabel}</SafeText>
          <SafeText variant="h3" color="primary">{item.title}</SafeText>
          <SafeText variant="caption" color="secondary">{item.description}</SafeText>
        </View>
        <Ionicons name="arrow-forward" size={25} color={colors.primary} />
      </PressableScale>
    </FadeInView>
  );
}

