import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated, BackHandler, AccessibilityInfo } from 'react-native';
import { useEmergencyHaptics } from './useEmergencyHaptics';
import type { SosCommandDockState } from '../data/residentEmergency.types';
import type { EmergencyActionId } from '../data/emergencyAction.types';

export function useSosCommandDockState(onClose?: () => void) {
  const [state, setState] = useState<SosCommandDockState>({ status: 'idle' });
  const [reducedMotion, setReducedMotion] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;
  const haptics = useEmergencyHaptics();

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReducedMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReducedMotion(enabled);
      }
    );

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  const openDock = () => {
    setState({ status: 'open' });
    haptics.triggerSelection();
    Animated.timing(animValue, {
      toValue: 1,
      duration: reducedMotion ? 50 : 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDock = useCallback(() => {
    haptics.triggerSelection();
    Animated.timing(animValue, {
      toValue: 0,
      duration: reducedMotion ? 50 : 200,
      useNativeDriver: true,
    }).start(() => {
      setState({ status: 'idle' });
      onClose?.();
    });
  }, [animValue, haptics, onClose, reducedMotion]);

  const selectAction = (actionId: EmergencyActionId) => {
    setState({ status: 'confirming', actionId });
  };

  const cancelConfirmation = () => {
    setState({ status: 'open' });
  };

  useEffect(() => {
    if (state.status === 'idle') return;

    const handleBack = () => {
      if (state.status === 'confirming') {
        cancelConfirmation();
      } else if (state.status === 'open' || state.status === 'success' || state.status === 'failed') {
        closeDock();
      }
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => {
      subscription.remove();
    };
  }, [closeDock, state.status]);

  return {
    state,
    setState,
    isOpen: state.status !== 'idle',
    animValue,
    reducedMotion,
    openDock,
    closeDock,
    selectAction,
    cancelConfirmation,
  };
}

export default useSosCommandDockState;
