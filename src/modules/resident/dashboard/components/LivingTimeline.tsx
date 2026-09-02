import { Pressable, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeText } from '../../../../shared/components/SafeText';
import { useReducedMotion } from '../../../../shared/motion';
import { Motion } from '../../../../shared/theme/motion';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';
import type { HomeActivityItem } from '../data/dashboard.types';
import { createLineStyle, createNodeStyle, createTimeStyle, styles } from '../styles/components/LivingTimeline.styles';

type LivingTimelineProps = {
  title: string;
  quietTitle: string;
  quietDescription: string;
  moments: readonly HomeActivityItem[];
  onMomentPress: (item: HomeActivityItem) => void;
};

function nodeColor(item: HomeActivityItem, colors: ReturnType<typeof useAppTheme>['colors']): string {
  if (item.module === 'billing' || item.module === 'notice') return colors.warning;
  if (item.module === 'facility') return colors.accentSky;
  return colors.success;
}

export function LivingTimeline({ title, quietTitle, quietDescription, moments, onMomentPress }: LivingTimelineProps) {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const displayedMoments = moments.slice(0, 4);
  return (
    <View style={styles.section} testID="dashboard-activity">
      <SafeText variant="title" color="primary">{title}</SafeText>
      {displayedMoments.length === 0 ? (
        <View style={styles.quietState}>
          <SafeText variant="h3" color="primary">{quietTitle}</SafeText>
          <SafeText variant="caption" color="muted">{quietDescription}</SafeText>
        </View>
      ) : (
        <View style={styles.timeline}>
          {displayedMoments.map((item, index) => (
            <Animated.View
              key={item.id}
              {...includeWhenPresent('entering', reducedMotion ? undefined : FadeInDown.delay(index * Motion.stagger.tight).duration(Motion.duration.normal))}
            >
              <Pressable onPress={() => onMomentPress(item)} style={styles.row} accessibilityRole="button">
                <SafeText variant="caption" style={[styles.time, createTimeStyle(colors.success)]}>{item.timestampLabel}</SafeText>
                <View style={styles.rail}>
                  <View style={[styles.node, createNodeStyle(nodeColor(item, colors))]} />
                  {index < displayedMoments.length - 1 ? <View style={[styles.line, createLineStyle(colors.border)]} /> : null}
                </View>
                <View style={styles.copy}>
                  <SafeText variant="bodyStrong" color="primary">{item.title}</SafeText>
                  <SafeText variant="caption" color="muted" numberOfLines={1}>{item.description}</SafeText>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      )}
    </View>
  );
}
