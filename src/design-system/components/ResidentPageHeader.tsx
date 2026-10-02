import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { HapticFeedback } from '../../shared/utils/haptics';
import { performBackNavigation } from '../../shared/navigation/performBackNavigation';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_SEMIBOLD,
  FONT_FAMILY_INTER_BOLD,
  FONT_FAMILY_SERIF_BOLD,
} from '../../shared/theme/typography';

export interface ResidentPageHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  rightIcon?: 'search' | 'filter' | 'refresh' | 'more' | 'none';
  onRightIconPress?: () => void;
  variant?: 'default' | 'editorial';
  style?: ViewStyle;
  testID?: string;
}

export function ResidentPageHeader({
  title,
  subtitle,
  eyebrow,
  showBackButton = true,
  onBack,
  rightAction,
  rightIcon = 'none',
  onRightIconPress,
  variant = 'editorial',
  style,
  testID = 'resident-page-header',
}: ResidentPageHeaderProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<{ canGoBack?: () => boolean; goBack?: () => void }>();

  const canGoBack = navigation?.canGoBack ? navigation.canGoBack() : false;
  const shouldShowBack = showBackButton && (canGoBack || !!onBack);

  const handleBack = useCallback(() => {
    HapticFeedback.light();
    if (onBack) {
      onBack();
    } else {
      performBackNavigation(navigation as never);
    }
  }, [navigation, onBack]);

  const handleRightPress = useCallback(() => {
    if (onRightIconPress) {
      HapticFeedback.light();
      onRightIconPress();
    }
  }, [onRightIconPress]);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 12) + 8 },
        style,
      ]}
      testID={testID}
    >
      <View style={styles.topRow}>
        {shouldShowBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 19l-7-7 7-7"
                stroke="#10201D"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        <View style={styles.centerContent}>
          {eyebrow ? (
            <Text style={styles.eyebrow} numberOfLines={1}>
              {eyebrow.toUpperCase()}
            </Text>
          ) : null}
          <Text
            style={[
              styles.title,
              variant === 'editorial' ? styles.titleEditorial : styles.titleInter,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : rightIcon === 'search' ? (
            <TouchableOpacity
              onPress={handleRightPress}
              style={styles.iconButton}
              accessibilityLabel="Search"
              accessibilityRole="button"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
                  stroke="#10201D"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>
          ) : rightIcon === 'filter' ? (
            <TouchableOpacity
              onPress={handleRightPress}
              style={styles.iconButton}
              accessibilityLabel="Filter"
              accessibilityRole="button"
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 4h18M6 12h12M10 20h4"
                  stroke="#10201D"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </Svg>
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF8F1',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(16, 32, 29, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3EC',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 38,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  eyebrow: {
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontSize: 10,
    letterSpacing: 1.2,
    color: '#064F45',
    marginBottom: 2,
    fontWeight: '600',
  },
  title: {
    color: '#10201D',
    textAlign: 'center',
  },
  titleEditorial: {
    fontFamily: FONT_FAMILY_SERIF_BOLD,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '700',
  },
  titleInter: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontFamily: FONT_FAMILY_INTER,
    fontSize: 12,
    color: '#607274',
    marginTop: 2,
  },
  rightContainer: {
    minWidth: 38,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F3EC',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
