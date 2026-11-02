import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface SocietyStatusPillProps {
  label: string;
  tone?: StatusTone;
  iconName?: keyof typeof Ionicons.glyphMap;
  showDot?: boolean;
  style?: ViewStyle;
}

export function SocietyStatusPill({
  label,
  tone = 'neutral',
  iconName,
  showDot = false,
  style,
}: SocietyStatusPillProps) {
  const toneColors = {
    success: { bg: '#DCFCE7', text: '#15803D', dot: '#16A34A' },
    warning: { bg: '#FEF3C7', text: '#B45309', dot: '#D97706' },
    danger: { bg: '#FEE2E2', text: '#B91C1C', dot: '#DC2626' },
    info: { bg: '#EEF5F0', text: '#064F43', dot: '#064F43' },
    neutral: { bg: '#F2F1EB', text: '#626A65', dot: '#8C928E' },
  }[tone];

  return (
    <View style={[styles.pill, { backgroundColor: toneColors.bg }, style]}>
      {showDot ? (
        <View style={[styles.dot, { backgroundColor: toneColors.dot }]} />
      ) : null}
      {iconName ? (
        <Ionicons name={iconName} size={12} color={toneColors.text} />
      ) : null}
      <SafeText style={[styles.label, { color: toneColors.text }]}>
        {label}
      </SafeText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
