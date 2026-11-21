import React from 'react';
import { StyleSheet, View, Platform, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../shared/theme/useAppTheme';
import { useReducedMotion } from '../../shared/motion/useReducedMotion';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  children,
  onPress,
  accentColor,
  style,
  testID,
  disabled,
}: CardProps) {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reducedMotion && onPress && !disabled) {
      scale.value = withSpring(0.98, { damping: 16, stiffness: 380 });
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      scale.value = withSpring(1, { damping: 16, stiffness: 380 });
    }
  };

  const cardContent = (
    <>
      {accentColor && (
        <View style={[styles.accentStripe, { backgroundColor: accentColor }]} />
      )}
      <View style={styles.content}>{children}</View>
    </>
  );

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        testID={testID}
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
          animatedStyle,
          style,
        ]}
        accessibilityRole="button"
      >
        {cardContent}
      </AnimatedPressable>
    );
  }

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {cardContent}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#101828',
        shadowOpacity: 0.08,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  accentStripe: {
    height: 4,
    width: '100%',
  },
  content: {
    padding: 16,
  },
});

export default Card;
