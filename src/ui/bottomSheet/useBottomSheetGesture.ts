import { useRef } from 'react';
import { PanResponder, type PanResponderInstance, Animated } from 'react-native';
import { BOTTOM_SHEET_DEFAULT_CONFIG } from './bottomSheet.types';
import { resolveBottomSheetDragEnd } from './resolveBottomSheetDragEnd';

export interface UseBottomSheetGestureProps {
  translateY: Animated.Value;
  onDismiss: () => void;
  onSnapBack: () => void;
  enabled?: boolean;
}

export function useBottomSheetGesture({
  translateY,
  onDismiss,
  onSnapBack,
  enabled = true,
}: UseBottomSheetGestureProps): PanResponderInstance {
  const config = BOTTOM_SHEET_DEFAULT_CONFIG;

  const panResponderRef = useRef<PanResponderInstance | null>(null);

  if (!panResponderRef.current) {
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (!enabled) return false;
        
        return gestureState.dy > 0 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: () => {
        translateY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        if (!enabled) return;
        
        if (gestureState.dy < config.maxUpwardDrag) {
          translateY.setValue(config.maxUpwardDrag);
        } else {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        if (!enabled) {
          onSnapBack();
          return;
        }
        
        const velocityY = gestureState.vy * 1000;
        const decision = resolveBottomSheetDragEnd(gestureState.dy, velocityY, config);
        if (decision === 'dismiss') {
          onDismiss();
        } else {
          onSnapBack();
        }
      },
      onPanResponderTerminate: () => {
        translateY.flattenOffset();
        onSnapBack();
      },
    });
  }

  return panResponderRef.current;
}

export default useBottomSheetGesture;
