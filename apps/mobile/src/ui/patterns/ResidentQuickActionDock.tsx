import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../shared/components/SafeText';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { HapticFeedback } from '../../shared/utils/haptics';

export interface QuickActionItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
  badge?: string;
  onPress: () => void;
}

export interface ResidentQuickActionDockProps {
  actions: QuickActionItem[];
}

export function ResidentQuickActionDock({ actions }: ResidentQuickActionDockProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]} testID="resident-quick-action-dock">
      <View style={styles.grid}>
        {actions.map((action) => (
          <Pressable
            key={action.id}
            onPress={() => {
              HapticFeedback.light();
              action.onPress();
            }}
            style={({ pressed }) => [
              styles.actionButton,
              { opacity: pressed ? 0.75 : 1, transform: [{ scale: pressed ? 0.96 : 1 }] }
            ]}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <View style={[styles.iconWrap, { backgroundColor: action.bgColor }]}>
              <Ionicons name={action.icon} size={22} color={action.color} />
              {action.badge ? (
                <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                  <SafeText variant="tiny" style={styles.badgeText}>{action.badge}</SafeText>
                </View>
              ) : null}
            </View>
            <SafeText variant="caption" color="primary" style={styles.label} numberOfLines={1}>
              {action.label}
            </SafeText>
            {action.sublabel ? (
              <SafeText variant="tiny" color="muted" numberOfLines={1}>
                {action.sublabel}
              </SafeText>
            ) : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
  },
});
