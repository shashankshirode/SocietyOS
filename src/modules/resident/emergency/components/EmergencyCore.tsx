import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from '../../../../shared/components/SafeText';
import { emergencyTheme } from '../theme/emergencyTheme';
import type { EmergencyLensFrame } from '../layout/emergencyLensLayout';

interface EmergencyCoreProps {
  onPress: () => void;
  isSending?: boolean;
  isReceded?: boolean;
  isSelected?: boolean;
  frame?: EmergencyLensFrame;
}

export function EmergencyCore({
  onPress,
  isSending = false,
  isReceded = false,
  isSelected = false,
  frame,
}: EmergencyCoreProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="SOS Emergency Core. I need urgent help"
      style={({ pressed }) => [
        styles.coreOuter,
        frame ? { position: 'absolute', left: frame.left, top: frame.top, width: frame.width, height: frame.height, borderRadius: frame.width / 2 } : null,
        isSelected
          ? [styles.coreSelected, { borderColor: emergencyTheme.core }]
          : isReceded
          ? styles.coreReceded
          : [styles.coreIdle, { backgroundColor: pressed ? `${emergencyTheme.core}22` : emergencyTheme.coreSoft }],
      ]}
    >
      <View style={styles.coreInner}>
        <Ionicons
          name={isSending ? 'sync-outline' : 'alert'}
          size={28}
          color={emergencyTheme.core}
        />
        <SafeText variant="bodyStrong" style={[styles.coreTitle, { color: emergencyTheme.text }]}>
          {isSending ? 'Sending…' : 'SOS'}
        </SafeText>
        <SafeText variant="tiny" style={[styles.coreSub, { color: emergencyTheme.textSecondary }]}>
          Urgent Help
        </SafeText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  coreOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: emergencyTheme.core,
    backgroundColor: emergencyTheme.coreSoft,
  },
  coreInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  coreIdle: {
    opacity: 1,
  },
  coreSelected: {
    transform: [{ scale: 1.06 }],
    backgroundColor: `${emergencyTheme.core}33`,
  },
  coreReceded: {
    opacity: 0.4,
    transform: [{ scale: 0.92 }],
  },
  coreTitle: {
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 16,
  },
  coreSub: {
    fontSize: 10,
    fontWeight: '600',
  },
});
