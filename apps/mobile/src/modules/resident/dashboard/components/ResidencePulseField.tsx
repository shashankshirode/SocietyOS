import { useEffect } from 'react';
import { View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { cancelAnimation, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { SafeText } from '../../../../shared/components/SafeText';
import { useReducedMotion } from '../../../../shared/motion';
import { Motion } from '../../../../shared/theme/motion';
import { useAppTheme } from '../../../../shared/theme/useAppTheme';
import { residentColors } from '../../../../shared/theme/residentColors';
import { residentSemanticDark } from '../../../../ui/foundation/semanticTokens';
import { useContainerLayout } from '../../../../ui/layout/useContainerLayout';
import { PressableScale } from '../../../../shared/motion/PressableScale';
import { includeWhenPresent } from '../../../../shared/utils/presentProperty';
import type { Absent } from '../../../../shared/types/absence.types';
import type { PulseScope, PulseSignal as ResidencePulseSignal } from '../data/pulseSignal.model';
import { createFieldBackgroundStyle, createFieldHeightStyle, createOrbitColorStyle, createOrbitSizeStyle, createPulseCenterStyle, createRingSizeStyle, styles } from '../styles/components/ResidencePulseField.styles';
import { PulseSignal } from './PulseSignal';
import { rankPulseSignals, resolvePulseLayout, type PulseSignalLayout } from './PulseLayoutEngine';

export type ResidencePulseState = 'calm' | 'active' | 'attention';

type ResidencePulseFieldProps = {
  state: ResidencePulseState;
  eyebrow: string;
  title: string;
  subtitle: string;
  signals: readonly ResidencePulseSignal[];
  accessibilityLabel: string;
  onPress: () => void;
};

export function ResidencePulseOrbit({ state, signals, expanded = false, scope = 'today', selectedId, onSignalPress }: Pick<ResidencePulseFieldProps, 'state' | 'signals'> & {
  expanded?: boolean;
  scope?: PulseScope;
  selectedId?: string | Absent;
  onSignalPress?: (signal: PulseSignalLayout) => void;
}) {
  const { colors } = useAppTheme();
  const reducedMotion = useReducedMotion();
  const container = useContainerLayout(expanded ? 350 : 264);
  const estimatedSize = Math.max(200, Math.min(container.width, expanded ? (container.width >= 720 ? 560 : container.width >= 480 ? 460 : 360) : container.width < 300 ? 252 : 320));
  const reservedBoxes = expanded ? [] : [{ x: 0, y: 0, width: estimatedSize, height: 54 }];
  const layout = resolvePulseLayout(signals, container.width, expanded, scope, reservedBoxes, selectedId);
  const breath = useSharedValue(1);
  const orbitColor = state === 'attention' ? colors.danger : state === 'active' ? colors.success : colors.textMuted;

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimation(breath);
      breath.value = 1;
      return;
    }
    breath.value = withRepeat(withSequence(withTiming(1.025, { duration: Motion.duration.ambient }), withTiming(1, { duration: Motion.duration.ambient })), -1);
    return () => cancelAnimation(breath);
  }, [breath, reducedMotion]);

  const breathStyle = useAnimatedStyle(() => ({ transform: [{ scale: breath.value }] }));
  const centerSize = expanded ? 68 : 56;
  return (
    <View style={styles.orbitHost} onLayout={container.onLayout}>
      <Animated.View style={[styles.orbit, createOrbitSizeStyle(layout.size), breathStyle]} accessibilityElementsHidden={!onSignalPress} importantForAccessibility={onSignalPress ? 'auto' : 'no-hide-descendants'} testID={`residence-pulse-${layout.density}`}>
        <View style={[styles.ring, createRingSizeStyle(layout.size * 0.92), createOrbitColorStyle(orbitColor)]} />
        <View style={[styles.ring, createRingSizeStyle(layout.size * 0.74), createOrbitColorStyle(orbitColor)]} />
        <View style={[styles.ring, createRingSizeStyle(layout.size * 0.57), createOrbitColorStyle(orbitColor)]} />
        <View style={[styles.ring, createRingSizeStyle(layout.size * 0.4), createOrbitColorStyle(orbitColor)]} />
        <View style={[styles.center, createOrbitSizeStyle(centerSize), createPulseCenterStyle(state, colors.danger, colors.primarySoft)]}>
          <Ionicons name={state === 'attention' ? 'alert' : 'home-outline'} size={expanded ? 29 : 25} color={state === 'attention' ? colors.textInverse : colors.primary} />
        </View>
        {layout.signals.map((signal, index) => {
          const selected = signal.sourceSignals.some((item) => item.id === selectedId);
          return <Animated.View key={signal.id} {...includeWhenPresent('entering', reducedMotion ? undefined : FadeIn.delay(index * Motion.stagger.tight).duration(Motion.duration.fast))} style={styles.signalLayer} pointerEvents="box-none">
            <PulseSignal signal={signal} selected={selected} {...includeWhenPresent('onPress', onSignalPress ? () => onSignalPress(signal) : undefined)} />
          </Animated.View>;
        })}
      </Animated.View>
    </View>
  );
}

export function ResidencePulseField({ state, eyebrow, title, subtitle, signals, accessibilityLabel, onPress }: ResidencePulseFieldProps) {
  const container = useContainerLayout(390);
  const fieldHeight = container.isCompact ? 370 : container.isFold || container.isTablet ? 414 : 400;
  const focusSignal = rankPulseSignals(signals)[0];
  return (
    <View style={styles.fieldWrapper} onLayout={container.onLayout}>
      <PressableScale onPress={onPress} style={[styles.field, createFieldHeightStyle(fieldHeight), createFieldBackgroundStyle(state === 'attention' ? residentSemanticDark.dangerSoft : residentColors.darkSurface)]} accessibilityRole="button" accessibilityLabel={accessibilityLabel} testID="dashboard-home-pulse">
        <View style={styles.copy}>
          <SafeText variant="tiny" style={styles.eyebrow}>{eyebrow}</SafeText>
          <SafeText variant="h1" style={[styles.title, container.isCompact && styles.titleCompact]}>{title}</SafeText>
          <SafeText variant="caption" style={styles.subtitle}>{subtitle}</SafeText>
        </View>
        <View style={styles.orbitPosition}><ResidencePulseOrbit state={state} signals={signals} {...includeWhenPresent('selectedId', focusSignal?.id)} /></View>
      </PressableScale>
      {focusSignal ? <PressableScale onPress={onPress} style={styles.momentRail} accessibilityRole="button" accessibilityLabel={`${focusSignal.timeLabel}, ${focusSignal.title}`}><View style={styles.moment}><SafeText variant="tiny" style={styles.momentTime}>{focusSignal.timeLabel}</SafeText><SafeText variant="caption" style={styles.momentTitle} numberOfLines={1}>{focusSignal.title}</SafeText></View><Ionicons name="arrow-forward" size={20} color={residentColors.onBrand} /></PressableScale> : null}
    </View>
  );
}
