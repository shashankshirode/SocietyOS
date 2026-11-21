import { Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeText } from '../../../shared/components/SafeText';
import { useReducedMotion } from '../../../shared/motion/useReducedMotion';
import { useAppTheme } from '../../../shared/theme/useAppTheme';
import { useMessages } from '../../../shared/constants/useMessages';
import { includeWhenPresent } from '../../../shared/utils/presentProperty';
import { createBackgroundStyle, createColorStyle, styles } from './styles/ContextCapsule.styles';

export function ContextCapsule({ label, visible, onBack }: { label: string; visible: boolean; onBack: () => void }) {
  const theme = useAppTheme();
  const messages = useMessages();
  const reducedMotion = useReducedMotion();
  if (!visible) return null;
  return (
    <Animated.View {...includeWhenPresent('entering', reducedMotion ? undefined : FadeIn.duration(theme.motion.duration.fast))} {...includeWhenPresent('exiting', reducedMotion ? undefined : FadeOut.duration(theme.motion.duration.fast))} style={[styles.capsule, createBackgroundStyle(theme.semantic.surface.inverse)]}>
      <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel={messages.resident.experience.ambient.returnToContext(label)} style={styles.pressable}>
        <Ionicons name="chevron-back" size={18} color={theme.semantic.text.inverse} />
        <SafeText variant="tiny" style={[styles.label, createColorStyle(theme.semantic.text.inverse)]} numberOfLines={1}>{label}</SafeText>
      </Pressable>
    </Animated.View>
  );
}
