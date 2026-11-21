import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

export interface FilterPillItem<T extends string> {
  id: T;
  label: string;
}

interface SocietyFilterPillsProps<T extends string> {
  items: readonly FilterPillItem<T>[] | FilterPillItem<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  style?: ViewStyle;
}

export function SocietyFilterPills<T extends string>({
  items,
  selectedId,
  onSelect,
  style,
}: SocietyFilterPillsProps<T>) {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        return (
          <Pressable
            key={item.id}
            onPress={() => onSelect(item.id)}
            style={[
              styles.pillBtn,
              {
                backgroundColor: isSelected ? colors.primary : colors.surface,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={item.label}
          >
            <SafeText
              style={[
                styles.pillLabel,
                { color: isSelected ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {item.label}
            </SafeText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 14,
  },
  pillBtn: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
