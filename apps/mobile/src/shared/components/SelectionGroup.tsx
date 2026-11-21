import React from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '../theme/useAppTheme';
import { Spacing } from '../theme/spacing';
import { SafeText } from './SafeText';
import { PressableScale } from '../motion/PressableScale';

export interface SelectionOption<T extends string | number> {
  key: T;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SelectionTileProps<T extends string | number> {
  option: SelectionOption<T>;
  selected: boolean;
  onSelect: (key: T) => void;
  style?: StyleProp<ViewStyle>;
  minHeight?: number;
  testID?: string;
}

export function SelectionTile<T extends string | number>({
  option,
  selected,
  onSelect,
  style,
  minHeight = 76,
  testID,
}: SelectionTileProps<T>) {
  const theme = useAppTheme();

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: option.disabled }}
      disabled={option.disabled}
      onPress={() => onSelect(option.key)}
      style={[
        {
          minHeight,
          flexGrow: 1,
          flexBasis: 130,
          borderWidth: 1,
          borderRadius: 14,
          padding: Spacing.md,
          justifyContent: 'center',
          gap: Spacing.xs,
          backgroundColor: selected
            ? theme.semantic.surface.raised
            : theme.semantic.surface.soft,
          borderColor: selected
            ? theme.semantic.accent.moss
            : theme.semantic.border.default,
          opacity: option.disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {option.icon ? <View>{option.icon}</View> : null}
      <SafeText
        variant="bodyStrong"
        style={{
          color: selected
            ? theme.semantic.accent.moss
            : theme.semantic.text.primary,
          fontWeight: '600',
        }}
      >
        {option.label}
      </SafeText>
      {option.sublabel ? (
        <SafeText variant="caption" color="secondary" numberOfLines={1}>
          {option.sublabel}
        </SafeText>
      ) : null}
    </PressableScale>
  );
}

export interface ChoiceChipProps<T extends string | number> {
  option: SelectionOption<T>;
  selected: boolean;
  onSelect: (key: T) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ChoiceChip<T extends string | number>({
  option,
  selected,
  onSelect,
  style,
  testID,
}: ChoiceChipProps<T>) {
  const theme = useAppTheme();

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: option.disabled }}
      disabled={option.disabled}
      onPress={() => onSelect(option.key)}
      style={[
        {
          minHeight: 40,
          paddingHorizontal: Spacing.md,
          borderWidth: 1,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.xs,
          backgroundColor: selected
            ? theme.semantic.accent.moss
            : theme.semantic.surface.soft,
          borderColor: selected
            ? theme.semantic.accent.moss
            : theme.semantic.border.default,
          opacity: option.disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      {option.icon}
      <SafeText
        variant="caption"
        style={{
          color: selected
            ? theme.semantic.text.inverse
            : theme.semantic.text.primary,
          fontWeight: selected ? '600' : '400',
        }}
      >
        {option.label}
      </SafeText>
    </Pressable>
  );
}

export interface SelectionGroupProps<T extends string | number> {
  options: SelectionOption<T>[];
  selected: T | null;
  onSelect: (key: T) => void;
  layout?: 'grid' | 'rail' | 'wrap';
  label?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export function SelectionGroup<T extends string | number>({
  options,
  selected,
  onSelect,
  layout = 'grid',
  label,
  error,
  style,
}: SelectionGroupProps<T>) {
  const theme = useAppTheme();

  return (
    <View style={[{ gap: Spacing.sm }, style]}>
      {label ? (
        <SafeText variant="tiny" color="muted" style={{ textTransform: 'uppercase' }}>
          {label}
        </SafeText>
      ) : null}

      {layout === 'rail' ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Spacing.sm }}>
          {options.map((opt) => (
            <ChoiceChip
              key={String(opt.key)}
              option={opt}
              selected={selected === opt.key}
              onSelect={onSelect}
            />
          ))}
        </ScrollView>
      ) : layout === 'wrap' ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {options.map((opt) => (
            <ChoiceChip
              key={String(opt.key)}
              option={opt}
              selected={selected === opt.key}
              onSelect={onSelect}
            />
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {options.map((opt) => (
            <SelectionTile
              key={String(opt.key)}
              option={opt}
              selected={selected === opt.key}
              onSelect={onSelect}
            />
          ))}
        </View>
      )}

      {error ? (
        <SafeText variant="caption" style={{ color: theme.semantic.status.danger }}>
          {error}
        </SafeText>
      ) : null}
    </View>
  );
}
