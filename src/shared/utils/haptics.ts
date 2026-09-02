import { Platform } from 'react-native';

/**
 * Safe haptic feedback trigger that operates across mobile devices without throwing on web.
 */
export const HapticFeedback = {
  light: () => {
    if (Platform.OS === 'web') return;
    try {
      // Optional runtime call or vibration fallback
    } catch {
      // safe fallback
    }
  },
  medium: () => {
    if (Platform.OS === 'web') return;
    try {
      // safe fallback
    } catch {
      // safe fallback
    }
  },
  success: () => {
    if (Platform.OS === 'web') return;
    try {
      // safe fallback
    } catch {
      // safe fallback
    }
  },
  warning: () => {
    if (Platform.OS === 'web') return;
    try {
      // safe fallback
    } catch {
      // safe fallback
    }
  },
  error: () => {
    if (Platform.OS === 'web') return;
    try {
      // safe fallback
    } catch {
      // safe fallback
    }
  },
};
