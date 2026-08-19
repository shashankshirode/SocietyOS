import { Easing } from 'react-native';

export const motionDurations = {
  instant: 80,
  fast: 160,
  standard: 240,
  deliberate: 320,
};

export const motionDistances = {
  subtle: 8,
  standard: 16,
  prominent: 24,
};

export const motionEasings = {
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  spring: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
};
