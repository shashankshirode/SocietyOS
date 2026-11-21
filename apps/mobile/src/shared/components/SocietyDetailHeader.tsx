import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeText } from './SafeText';
import { useAppTheme } from '../theme/useAppTheme';

interface SocietyDetailHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function SocietyDetailHeader({
  title,
  subtitle,
  onBack,
  onBackPress,
  rightAction,
  style,
}: SocietyDetailHeaderProps) {
  const { colors } = useAppTheme();
  const handleBack = onBackPress ?? onBack;

  return (
    <View style={[styles.headerContainer, style]}>
      <View style={styles.leftCol}>
        {handleBack ? (
          <Pressable
            onPress={handleBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>
        ) : null}
        <View style={{ flex: 1 }}>
          <SafeText
            style={[styles.headerTitle, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </SafeText>
          {subtitle ? (
            <SafeText
              style={{ fontSize: 13, color: colors.textSecondary, marginTop: 1 }}
              numberOfLines={1}
            >
              {subtitle}
            </SafeText>
          ) : null}
        </View>
      </View>

      {rightAction ? <View style={styles.rightCol}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
