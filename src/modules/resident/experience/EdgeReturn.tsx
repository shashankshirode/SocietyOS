import React from 'react';
import { Pressable, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useMessages } from '../../../shared/constants/useMessages';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useReducedMotion } from '../../../shared/motion/useReducedMotion';
import { styles } from './styles/SocietyAmbientChrome.styles';

export type ReturnSemantic = 'back' | 'close' | 'cancel' | 'minimize' | 'home';

export interface SocietyReturnControlProps {
  readonly onPress: () => void;
  readonly semantic?: ReturnSemantic;
  readonly accessibilityLabel?: string;
  readonly style?: ViewStyle;
  readonly testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ICON_MAP: Record<ReturnSemantic, keyof typeof Ionicons.glyphMap> = {
  back: 'chevron-back',
  close: 'close',
  cancel: 'close',
  minimize: 'chevron-down',
  home: 'home-outline',
};

export function SocietyReturnControl({
  onPress,
  semantic = 'back',
  accessibilityLabel,
  style,
  testID = 'society-return-control',
}: SocietyReturnControlProps) {
  const theme = useAppTheme();
  const { colors, semantic: sem, dark } = theme;
  const messages = useMessages();
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!reducedMotion) {
      scale.value = withSpring(0.92, { damping: 12, stiffness: 220 });
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      scale.value = withSpring(1, { damping: 12, stiffness: 220 });
    }
  };

  const defaultLabel =
    semantic === 'close' || semantic === 'cancel'
      ? messages.common.close
      : semantic === 'home'
      ? messages.tabs.home
      : messages.resident.experience.ambient.returnToPrevious;

  const surfaceBg = dark ? '#18271E' : '#E8E4DA';
  const borderCol = dark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? defaultLabel}
      testID={testID}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.edgeReturn,
        {
          backgroundColor: surfaceBg,
          borderColor: borderCol,
        },
        animatedStyle,
        style,
      ]}
    >
      <Ionicons
        name={ICON_MAP[semantic]}
        size={semantic === 'close' || semantic === 'cancel' ? 20 : 22}
        color={sem.text.primary}
      />
    </AnimatedPressable>
  );
}

// Backward compatibility export
export const EdgeReturn = SocietyReturnControl;
