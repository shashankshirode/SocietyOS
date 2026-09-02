import type { MotionIntent } from '../../shared/theme/motion';

export enum ExperiencePerformanceTier {
  REDUCED = 'REDUCED',
  STANDARD = 'STANDARD',
  ENHANCED = 'ENHANCED',
}

export enum NavigationTransition {
  ROOT_WORLD_SWITCH = 'ROOT_WORLD_SWITCH',
  NESTED_PUSH = 'NESTED_PUSH',
  NESTED_POP = 'NESTED_POP',
  FOCUS_OPEN = 'FOCUS_OPEN',
  FOCUS_CLOSE = 'FOCUS_CLOSE',
  SHEET_OPEN = 'SHEET_OPEN',
  SHEET_CLOSE = 'SHEET_CLOSE',
  CONTEXT_SWITCH = 'CONTEXT_SWITCH',
  CRITICAL_MODE_ENTER = 'CRITICAL_MODE_ENTER',
  CRITICAL_MODE_EXIT = 'CRITICAL_MODE_EXIT',
}

export type ExperienceRuntimeProfile = {
  tier: ExperiencePerformanceTier;
  reducedMotion: boolean;
  animateShimmer: boolean;
  animateTransitions: boolean;
  maxInitialSkeletonItems: number;
};

export type TransitionSpec = {
  motionIntent: MotionIntent;
  durationMs: number;
  distance: number;
};

export type ExperienceRuntimeContextValue = {
  profile: ExperienceRuntimeProfile;
  transition: (transition: NavigationTransition) => TransitionSpec;
};