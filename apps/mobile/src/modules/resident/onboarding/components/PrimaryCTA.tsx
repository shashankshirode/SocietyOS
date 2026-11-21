import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONT_FAMILY_INTER_BOLD } from '../../../../shared/theme/typography';

interface PrimaryCTAProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  showArrow?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  testID?: string;
}

export function PrimaryCTA({
  label,
  onPress,
  disabled = false,
  isLoading = false,
  showArrow = true,
  style,
  textStyle,
  accessibilityLabel,
  testID,
}: PrimaryCTAProps) {
  const isInteractive = !disabled && !isLoading;

  return (
    <Pressable
      testID={testID || 'primary-cta-btn'}
      onPress={onPress}
      disabled={!isInteractive}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && isInteractive && styles.buttonPressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
    >
      {isLoading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <>
          <Text style={[styles.text, textStyle]}>{label}</Text>
          {showArrow && (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" style={styles.arrowIcon}>
              <Path
                d="M5 12h14M12 5l7 7-7 7"
                stroke="#FFFFFF"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: '#064F45',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    shadowColor: '#064F45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A0A5A2',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonPressed: {
    backgroundColor: '#043F38',
    transform: [{ scale: 0.985 }],
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    letterSpacing: -0.2,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});
