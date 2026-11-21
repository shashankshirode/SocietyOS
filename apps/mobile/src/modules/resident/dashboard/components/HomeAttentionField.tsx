import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeText } from '../../../../shared/components/SafeText';
import { useReducedMotion } from '../../../../shared/motion';
import { Motion } from '../../../../shared/theme/motion';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';
import type { ResidentPriorityItem } from '../data/dashboard.types';
import {
  createActionIconStyle,
  createActionListStyle,
  createActionTextStyle,
  createDividerStyle,
  styles,
} from '../styles/components/HomeAttentionField.styles';

type HomeAttentionFieldProps = {
  title: string;
  viewAllLabel: string;
  accessibilityLabel: string;
  items: readonly ResidentPriorityItem[];
  totalCount: number;
  onViewAll: () => void;
  onAction: (actionId?: string) => void;
};

export function HomeAttentionField({ title, viewAllLabel, accessibilityLabel, items, totalCount, onViewAll, onAction }: HomeAttentionFieldProps) {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  if (items.length === 0) return null;

  return (
    <View style={styles.section} testID="dashboard-priorities" accessibilityLabel={accessibilityLabel}>
      <View style={styles.header}>
        <SafeText variant="title" color="primary">{title}</SafeText>
        {totalCount > items.length ? (
          <Pressable onPress={onViewAll} accessibilityRole="button">
            <SafeText variant="caption" style={createActionTextStyle(colors.success)}>{viewAllLabel} →</SafeText>
          </Pressable>
        ) : null}
      </View>
      <View style={[styles.list, createActionListStyle(colors.surface, colors.border)]}>
        {items.map((item, index) => {
          const toneColor = item.tone === 'danger' ? colors.danger : item.tone === 'warning' ? colors.warning : colors.success;
          const toneSurface = item.tone === 'danger' ? colors.dangerSoft : item.tone === 'warning' ? colors.warningSoft : colors.primarySoft;
          return (
            <Animated.View
              key={item.id}
              {...includeWhenPresent('entering', reducedMotion ? undefined : FadeInDown.delay(index * Motion.stagger.tight).duration(Motion.duration.fast))}
            >
              <Pressable
                onPress={() => onAction(item.actionId)}
                style={[styles.row, index > 0 && createDividerStyle(colors.divider)]}
                accessibilityRole="button"
              >
                <View style={[styles.icon, createActionIconStyle(toneSurface)]}>
                  <Ionicons name={item.iconName} size={19} color={toneColor} />
                </View>
                <View style={styles.copy}>
                  <SafeText variant="bodyStrong" color="primary" numberOfLines={1}>{item.title}</SafeText>
                  <SafeText variant="caption" color="muted" numberOfLines={1}>{item.description}</SafeText>
                </View>
                <SafeText variant="caption" style={createActionTextStyle(colors.success)}>{item.actionLabel} →</SafeText>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
