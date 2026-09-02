export enum MotionIntent {
  WORLD_TRANSITION = 'WORLD_TRANSITION',
  FOCUS_ENTER = 'FOCUS_ENTER',
  FOCUS_EXIT = 'FOCUS_EXIT',
  FLOW_STEP_FORWARD = 'FLOW_STEP_FORWARD',
  FLOW_STEP_BACK = 'FLOW_STEP_BACK',
  SUBTLE_REFRESH = 'SUBTLE_REFRESH',
  CARD_PRESS = 'CARD_PRESS',
  SHIMMER_PULSE = 'SHIMMER_PULSE',
}

export const motionTokens = {
  duration: {
    instant: 80,
    fast: 160,
    standard: 200,
    focus: 220,
    world: 240,
    flow: 200,
    normal: 240,
    slow: 380,
    entrance: 260,
    ambient: 3200,
    shimmer: 1200,
  },
  distance: {
    subtle: 4,
    focus: 8,
    standard: 12,
    flow: 16,
  },
  spring: {
    press: { damping: 14, stiffness: 450 },
    card: { damping: 16, stiffness: 280 },
    entrance: { damping: 18, stiffness: 200 },
    tabIcon: { damping: 22, stiffness: 360, overshootClamping: true },
    focus: { damping: 20, stiffness: 260, overshootClamping: true },
  },
  stagger: {
    tight: 30,
    normal: 50,
    relaxed: 80,
  },
  scale: {
    press: 0.975,
    active: 1.02,
    focusEnter: 0.985,
  },
} as const;

export type MotionTokens = typeof motionTokens;
export type MotionDurationToken = keyof MotionTokens['duration'];
export type MotionStaggerToken = keyof MotionTokens['stagger'];

export const Motion = motionTokens;

