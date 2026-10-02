import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { FONT_FAMILY_INTER_BOLD, FONT_FAMILY_INTER } from '../theme/typography';

interface SocietyOSLogoProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showText?: boolean;
  showTagline?: boolean;
  align?: 'left' | 'center';
  style?: ViewStyle;
}

export function SocietyOSLogoMark({
  size = 40,
  color = '#10201D',
}: {
  size?: number;
  color?: string;
}) {
  const height = (size * 56) / 48;
  return (
    <Svg width={size} height={height} viewBox="0 0 48 56" fill="none">
      {/* Outer gable roof & walls */}
      <Path
        d="M 7 50 L 7 18 L 24 6 L 41 18 L 41 50"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center spine */}
      <Path
        d="M 24 6 L 24 50"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner chevron & pillars */}
      <Path
        d="M 15.5 50 L 15.5 27 L 24 20 L 32.5 27 L 32.5 50"
        stroke={color}
        strokeWidth={3.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SocietyOSLogo({
  size = 'md',
  color = '#10201D',
  showText = true,
  showTagline = true,
  align = 'center',
  style,
}: SocietyOSLogoProps) {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 36;
  const titleSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const taglineSize = size === 'sm' ? 10 : size === 'lg' ? 13 : 11;
  const letterSpacing = size === 'sm' ? 2.5 : size === 'lg' ? 4.5 : 3.5;

  return (
    <View
      style={[
        styles.container,
        align === 'left' && { alignItems: 'flex-start' },
        style,
      ]}
    >
      <View style={align === 'left' ? { alignItems: 'center', alignSelf: 'flex-start' } : undefined}>
        <SocietyOSLogoMark size={iconSize} color={color} />
      </View>
      {showText && (
        <Text
          style={[
            styles.title,
            align === 'left' && { textAlign: 'left' },
            {
              color,
              fontSize: titleSize,
              letterSpacing,
              fontFamily: FONT_FAMILY_INTER_BOLD,
            },
          ]}
        >
          SOCIETY OS
        </Text>
      )}
      {showTagline && (
        <Text
          style={[
            styles.tagline,
            align === 'left' && { textAlign: 'left' },
            {
              color: color === '#10201D' ? '#5E6662' : color,
              fontSize: taglineSize,
              fontFamily: FONT_FAMILY_INTER,
            },
          ]}
        >
          Live Together, Better
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    marginTop: 8,
    textAlign: 'center',
  },
  tagline: {
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
