import { Platform } from 'react-native';
import { motionTokens, MotionIntent } from '../../shared/theme/motion';
import { ExperiencePerformanceTier, NavigationTransition, type ExperienceRuntimeProfile, type TransitionSpec } from './experienceRuntime.types';

export function resolvePerformanceTier(input: { reducedMotion: boolean; lowPowerMode?: boolean; deviceMemoryGb?: number }): ExperiencePerformanceTier {
  if (input.reducedMotion || input.lowPowerMode || (input.deviceMemoryGb !== undefined && input.deviceMemoryGb <= 2)) return ExperiencePerformanceTier.REDUCED;
  if (Platform.OS === 'web' || (input.deviceMemoryGb !== undefined && input.deviceMemoryGb >= 6)) return ExperiencePerformanceTier.ENHANCED;
  return ExperiencePerformanceTier.STANDARD;
}

export function createExperienceRuntimeProfile(input: { reducedMotion: boolean; lowPowerMode?: boolean; deviceMemoryGb?: number }): ExperienceRuntimeProfile {
  const tier = resolvePerformanceTier(input);
  const reduced = tier === ExperiencePerformanceTier.REDUCED;
  return {
    tier,
    reducedMotion: input.reducedMotion,
    animateShimmer: !reduced,
    animateTransitions: !input.reducedMotion,
    maxInitialSkeletonItems: reduced ? 3 : 5,
  };
}

export function resolveTransitionSpec(transition: NavigationTransition, profile: ExperienceRuntimeProfile): TransitionSpec {
  const reducedDuration = profile.reducedMotion ? motionTokens.duration.instant : undefined;
  const specs: Record<NavigationTransition, TransitionSpec> = {
    ROOT_WORLD_SWITCH: { motionIntent: MotionIntent.WORLD_TRANSITION, durationMs: motionTokens.duration.world, distance: motionTokens.distance.subtle },
    NESTED_PUSH: { motionIntent: MotionIntent.FOCUS_ENTER, durationMs: motionTokens.duration.focus, distance: motionTokens.distance.focus },
    NESTED_POP: { motionIntent: MotionIntent.FOCUS_EXIT, durationMs: motionTokens.duration.focus, distance: motionTokens.distance.focus },
    FOCUS_OPEN: { motionIntent: MotionIntent.FOCUS_ENTER, durationMs: motionTokens.duration.focus, distance: motionTokens.distance.focus },
    FOCUS_CLOSE: { motionIntent: MotionIntent.FOCUS_EXIT, durationMs: motionTokens.duration.focus, distance: motionTokens.distance.focus },
    SHEET_OPEN: { motionIntent: MotionIntent.FLOW_STEP_FORWARD, durationMs: motionTokens.duration.standard, distance: motionTokens.distance.standard },
    SHEET_CLOSE: { motionIntent: MotionIntent.FLOW_STEP_BACK, durationMs: motionTokens.duration.standard, distance: motionTokens.distance.standard },
    CONTEXT_SWITCH: { motionIntent: MotionIntent.FLOW_STEP_FORWARD, durationMs: motionTokens.duration.flow, distance: motionTokens.distance.standard },
    CRITICAL_MODE_ENTER: { motionIntent: MotionIntent.FLOW_STEP_FORWARD, durationMs: motionTokens.duration.fast, distance: motionTokens.distance.subtle },
    CRITICAL_MODE_EXIT: { motionIntent: MotionIntent.FLOW_STEP_BACK, durationMs: motionTokens.duration.fast, distance: motionTokens.distance.subtle },
  };
  const spec = specs[transition];
  return reducedDuration === undefined ? spec : { ...spec, durationMs: reducedDuration, distance: 0 };
}

export function resolveMotionIntentSpec(intent: MotionIntent, profile: ExperienceRuntimeProfile): TransitionSpec {
  const transition = intent === MotionIntent.WORLD_TRANSITION
    ? NavigationTransition.ROOT_WORLD_SWITCH
    : intent === MotionIntent.FOCUS_EXIT
      ? NavigationTransition.FOCUS_CLOSE
      : intent === MotionIntent.FOCUS_ENTER
        ? NavigationTransition.FOCUS_OPEN
        : intent === MotionIntent.FLOW_STEP_BACK
          ? NavigationTransition.NESTED_POP
          : NavigationTransition.NESTED_PUSH;
  return resolveTransitionSpec(transition, profile);
}