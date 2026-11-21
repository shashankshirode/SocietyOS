import React from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { SocietyButton } from './SocietyButton';
import { useAppTheme } from '../theme/useAppTheme';

interface SocietySuccessViewProps {
  title: string;
  subtitle?: string;
  badgeLabel?: string;
  children?: React.ReactNode;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  style?: ViewStyle;
}

export function SocietySuccessView({
  title,
  subtitle,
  badgeLabel,
  children,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  style,
}: SocietySuccessViewProps) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentCol}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={40} color="#FFFFFF" />
        </View>

        <SafeText style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </SafeText>

        {badgeLabel ? (
          <View style={[styles.badge, { backgroundColor: '#EEF5F0' }]}>
            <SafeText style={styles.badgeText}>{badgeLabel}</SafeText>
          </View>
        ) : null}

        {subtitle ? (
          <SafeText style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </SafeText>
        ) : null}

        {children ? <View style={styles.customContent}>{children}</View> : null}
      </View>

      <View style={styles.actionCol}>
        <SocietyButton
          title={primaryActionLabel}
          onPress={onPrimaryAction}
          variant="primary"
          size="lg"
          fullWidth
        />

        {secondaryActionLabel && onSecondaryAction ? (
          <SocietyButton
            title={secondaryActionLabel}
            onPress={onSecondaryAction}
            variant="secondary"
            size="lg"
            fullWidth
            style={styles.secondaryBtn}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 24,
  },
  contentCol: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginTop: 10,
  },
  badgeText: {
    color: '#064F43',
    fontWeight: '700',
    fontSize: 13,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 280,
  },
  customContent: {
    width: '100%',
    marginTop: 24,
  },
  actionCol: {
    width: '100%',
    gap: 12,
  },
  secondaryBtn: {
    marginTop: 2,
  },
});
