import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { FONT_FAMILY_INTER_MEDIUM } from '../../../../shared/theme/typography';

interface SecondaryCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export function SecondaryCTA({
  label,
  onPress,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
}: SecondaryCTAProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text style={[styles.text, textStyle, disabled && styles.textDisabled]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    backgroundColor: '#FAF8F1',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonDisabled: {
    opacity: 0.5,
    borderColor: '#EBE8DE',
  },
  buttonPressed: {
    backgroundColor: '#F5F2EA',
  },
  text: {
    color: '#10201D',
    fontSize: 14.5,
    fontWeight: '500',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  textDisabled: {
    color: '#A0A5A2',
  },
});
