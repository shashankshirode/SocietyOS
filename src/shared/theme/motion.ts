export const motionTokens = {
  duration: {
    instant: 80,
    fast: 150,
    normal: 240,
    slow: 380,
    entrance: 300,
  },
  spring: {
    press: { damping: 14, stiffness: 450 },
    card: { damping: 16, stiffness: 280 },
    entrance: { damping: 18, stiffness: 200 },
    tabIcon: { damping: 14, stiffness: 400 },
  },
  stagger: {
    tight: 40,
    normal: 65,
    relaxed: 100,
  },
  scale: {
    press: 0.975,
    active: 1.02,
  },
} as const;

export type MotionTokens = typeof motionTokens;
export type MotionDurationToken = keyof MotionTokens['duration'];
export type MotionStaggerToken = keyof MotionTokens['stagger'];

export const Motion = motionTokens;
