export const motion = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 400,
    slowest: 500,
    enter: 250,
    exit: 200,
    modal: 300,
    sheet: 350,
    popover: 200,
    toast: 250,
  },

  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  spring: {
    gentle: { damping: 20, stiffness: 120 },
    standard: { damping: 18, stiffness: 180 },
    stiff: { damping: 16, stiffness: 280 },
    bouncy: { damping: 14, stiffness: 180 },
    wobbly: { damping: 12, stiffness: 150 },
    press: { damping: 14, stiffness: 450 },
    card: { damping: 16, stiffness: 280 },
    entrance: { damping: 18, stiffness: 200 },
    tabIcon: { damping: 22, stiffness: 360, overshootClamping: true },
    focus: { damping: 20, stiffness: 260, overshootClamping: true },
    modal: { damping: 20, stiffness: 220 },
    sheet: { damping: 22, stiffness: 200 },
  },

  stagger: {
    tight: 30,
    normal: 50,
    relaxed: 80,
    slow: 120,
  },

  scale: {
    press: 0.97,
    active: 1.02,
    hover: 1.01,
    focus: 0.98,
    disabled: 1,
  },

  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 0.6,
    focus: 0.12,
  },

  translate: {
    slideUp: { x: 0, y: -20 },
    slideDown: { x: 0, y: 20 },
    slideLeft: { x: -20, y: 0 },
    slideRight: { x: 20, y: 0 },
    press: { x: 0, y: 1 },
  },

  blur: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    '2xl': 40,
  },
} as const;

export const motionIntent = {
  WORLD_TRANSITION: 'WORLD_TRANSITION',
  FOCUS_ENTER: 'FOCUS_ENTER',
  FOCUS_EXIT: 'FOCUS_EXIT',
  FLOW_STEP_FORWARD: 'FLOW_STEP_FORWARD',
  FLOW_STEP_BACK: 'FLOW_STEP_BACK',
  SUBTLE_REFRESH: 'SUBTLE_REFRESH',
  CARD_PRESS: 'CARD_PRESS',
  SHIMMER_PULSE: 'SHIMMER_PULSE',
  MODAL_ENTER: 'MODAL_ENTER',
  MODAL_EXIT: 'MODAL_EXIT',
  SHEET_ENTER: 'SHEET_ENTER',
  SHEET_EXIT: 'SHEET_EXIT',
  TOAST_ENTER: 'TOAST_ENTER',
  TOAST_EXIT: 'TOAST_EXIT',
  POPOVER_ENTER: 'POPOVER_ENTER',
  POPOVER_EXIT: 'POPOVER_EXIT',
  DROPDOWN_ENTER: 'DROPDOWN_ENTER',
  DROPDOWN_EXIT: 'DROPDOWN_EXIT',
  TAB_SWITCH: 'TAB_SWITCH',
  SCREEN_TRANSITION: 'SCREEN_TRANSITION',
  LIST_REORDER: 'LIST_REORDER',
  DRAG_START: 'DRAG_START',
  DRAG_END: 'DRAG_END',
} as const;

export type MotionDurationToken = keyof typeof motion.duration;
export type MotionEasingToken = keyof typeof motion.easing;
export type MotionSpringToken = keyof typeof motion.spring;
export type MotionStaggerToken = keyof typeof motion.stagger;
export type MotionIntentToken = keyof typeof motionIntent;

export const getMotionConfig = (intent: MotionIntentToken) => {
  const configs: Record<MotionIntentToken, {
    duration: MotionDurationToken;
    easing: MotionEasingToken;
    spring?: MotionSpringToken;
  }> = {
    WORLD_TRANSITION: { duration: 'slow', easing: 'spring', spring: 'standard' },
    FOCUS_ENTER: { duration: 'fast', easing: 'standard' },
    FOCUS_EXIT: { duration: 'normal', easing: 'standard' },
    FLOW_STEP_FORWARD: { duration: 'normal', easing: 'decelerate' },
    FLOW_STEP_BACK: { duration: 'normal', easing: 'accelerate' },
    SUBTLE_REFRESH: { duration: 'fast', easing: 'standard' },
    CARD_PRESS: { duration: 'instant', easing: 'standard', spring: 'press' },
    SHIMMER_PULSE: { duration: 'slowest', easing: 'linear' },
    MODAL_ENTER: { duration: 'modal', easing: 'spring', spring: 'modal' },
    MODAL_EXIT: { duration: 'fast', easing: 'accelerate' },
    SHEET_ENTER: { duration: 'sheet', easing: 'spring', spring: 'sheet' },
    SHEET_EXIT: { duration: 'normal', easing: 'accelerate' },
    TOAST_ENTER: { duration: 'normal', easing: 'spring', spring: 'bouncy' },
    TOAST_EXIT: { duration: 'fast', easing: 'accelerate' },
    POPOVER_ENTER: { duration: 'fast', easing: 'spring', spring: 'standard' },
    POPOVER_EXIT: { duration: 'fast', easing: 'accelerate' },
    DROPDOWN_ENTER: { duration: 'fast', easing: 'standard' },
    DROPDOWN_EXIT: { duration: 'fast', easing: 'accelerate' },
    TAB_SWITCH: { duration: 'normal', easing: 'spring', spring: 'tabIcon' },
    SCREEN_TRANSITION: { duration: 'normal', easing: 'standard' },
    LIST_REORDER: { duration: 'normal', easing: 'spring', spring: 'bouncy' },
    DRAG_START: { duration: 'fast', easing: 'decelerate' },
    DRAG_END: { duration: 'normal', easing: 'spring', spring: 'bouncy' },
  };

  return configs[intent] || { duration: 'normal', easing: 'standard' };
};