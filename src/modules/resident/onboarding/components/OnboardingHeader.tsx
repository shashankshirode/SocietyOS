import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SocietyOSLogo } from '../../../../shared/components/SocietyOSLogo';
import { FONT_FAMILY_INTER_MEDIUM } from '../../../../shared/theme/typography';

interface OnboardingHeaderProps {
  onBack?: () => void;
  onHelp?: () => void;
  showBack?: boolean;
}

export function OnboardingHeader({
  onBack,
  onHelp,
  showBack = true,
}: OnboardingHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftCol}>
        {showBack && onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#10201D"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <View style={styles.centerCol}>
        <SocietyOSLogo size="sm" color="#10201D" align="center" />
      </View>

      <View style={styles.rightCol}>
        {onHelp ? (
          <Pressable
            onPress={onHelp}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Need help?"
          >
            <Text style={styles.helpText}>Need help?</Text>
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  leftCol: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  centerCol: {
    flex: 1,
    alignItems: 'center',
  },
  rightCol: {
    minWidth: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  helpText: {
    fontSize: 13,
    color: '#69716D',
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
});
