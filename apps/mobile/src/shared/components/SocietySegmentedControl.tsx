import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

interface SegmentItem<T extends string> {
  id: T;
  label: string;
  badge?: number;
}

interface SocietySegmentedControlProps<T extends string> {
  items: readonly SegmentItem<T>[] | SegmentItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: ViewStyle;
}

export function SocietySegmentedControl<T extends string>({
  items,
  selectedId,
  onSelect,
  style,
}: SocietySegmentedControlProps<T>) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSoft }, style]}>
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.segmentBtn,
              isSelected && {
                backgroundColor: colors.primary,
              },
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={item.label}
          >
            <SafeText
              style={[
                styles.segmentLabel,
                { color: isSelected ? '#FFFFFF' : colors.textSecondary },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </SafeText>
            {item.badge !== undefined && item.badge > 0 ? (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : colors.danger },
                ]}
              >
                <SafeText
                  style={[
                    styles.badgeText,
                    { color: isSelected ? '#FFFFFF' : '#FFFFFF' },
                  ]}
                >
                  {item.badge}
                </SafeText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 44,
    borderRadius: 22,
    padding: 3,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    height: '100%',
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 8,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
