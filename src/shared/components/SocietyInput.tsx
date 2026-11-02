import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

interface SocietyInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  prefix?: React.ReactNode;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
}

export function SocietyInput({
  label,
  prefix,
  rightIcon,
  onRightIconPress,
  error,
  helperText,
  containerStyle,
  ...inputProps
}: SocietyInputProps) {
  const { colors } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <SafeText style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </SafeText>
      ) : null}

      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.surface,
            borderColor: error
              ? colors.danger
              : isFocused
              ? colors.primary
              : colors.border,
          },
        ]}
      >
        {prefix ? <View style={styles.prefixContainer}>{prefix}</View> : null}

        <TextInput
          {...inputProps}
          style={[styles.textInput, { color: colors.textPrimary }]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
        />

        {rightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            style={styles.rightIconBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={error ? colors.danger : colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error ? (
        <SafeText style={[styles.errorText, { color: colors.danger }]}>
          {error}
        </SafeText>
      ) : helperText ? (
        <SafeText style={[styles.helperText, { color: colors.textMuted }]}>
          {helperText}
        </SafeText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  prefixContainer: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    fontWeight: '500',
  },
  rightIconBtn: {
    paddingLeft: 10,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
