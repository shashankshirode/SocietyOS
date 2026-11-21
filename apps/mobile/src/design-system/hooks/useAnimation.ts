import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { Easing, withTiming, withSpring, withDelay, type EasingFunction, type EasingFunctionFactory } from 'react-native-reanimated';
import { motion } from '../tokens/motion';

export interface SpringConfig {
  damping?: number;
  stiffness?: number;
  mass?: number;
  overshootClamping?: boolean;
}

export function useSpring(
  initialValue: number | number[],
  config?: SpringConfig
) {
  const springRef = useRef(
    Array.isArray(initialValue)
      ? initialValue.map(v => new Animated.Value(v))
      : new Animated.Value(initialValue)
  ).current;

  const start = useCallback(
    (toValue: number | number[], overrideConfig?: SpringConfig) => {
      const springs = Array.isArray(springRef) ? springRef : [springRef];
      const values = Array.isArray(toValue) ? toValue : [toValue];

      springs.forEach((spring, i) => {
        spring.setValue(
          withSpring(values[i] ?? toValue, {
            damping: overrideConfig?.damping ?? config?.damping ?? motion.spring.standard.damping,
            stiffness: overrideConfig?.stiffness ?? config?.stiffness ?? motion.spring.standard.stiffness,
            mass: overrideConfig?.mass ?? config?.mass ?? 1,
            overshootClamping: overrideConfig?.overshootClamping ?? config?.overshootClamping ?? true,
          }) as any
        );
      });
    },
    [springRef, config]
  );

  const stop = useCallback(() => {
    const springs = Array.isArray(springRef) ? springRef : [springRef];
    springs.forEach(spring => spring.stopAnimation());
  }, [springRef]);

  return {
    spring: Array.isArray(springRef) ? springRef : [springRef],
    start,
    stop,
  };
}

export function useTiming(
  initialValue: number | number[],
  duration = motion.duration.normal,
  easing: EasingFunction | EasingFunctionFactory = Easing.out(Easing.cubic)
) {
  const timingRef = useRef(
    Array.isArray(initialValue)
      ? initialValue.map(v => new Animated.Value(v))
      : new Animated.Value(initialValue)
  ).current;

  const start = useCallback(
    (toValue: number | number[], overrideDuration?: number, overrideEasing?: EasingFunction | EasingFunctionFactory) => {
      const timings = Array.isArray(timingRef) ? timingRef : [timingRef];
      const values = Array.isArray(toValue) ? toValue : [toValue];

      timings.forEach((timing, i) => {
        timing.setValue(
          withTiming(values[i] ?? toValue, {
            duration: overrideDuration ?? duration,
            easing: overrideEasing ?? easing,
          }) as any
        );
      });
    },
    [timingRef, duration, easing]
  );

  const stop = useCallback(() => {
    const timings = Array.isArray(timingRef) ? timingRef : [timingRef];
    timings.forEach(timing => timing.stopAnimation());
  }, [timingRef]);

  return {
    timing: Array.isArray(timingRef) ? timingRef : [timingRef],
    start,
    stop,
  };
}

export function useStaggeredAnimation(
  count: number,
  delay = motion.stagger.normal
) {
  const animationsRef = useRef(
    Array.from({ length: count }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(20),
    }))
  ).current;

  const start = useCallback(() => {
    animationsRef.forEach((anim, index) => {
      anim.opacity.setValue(
        withDelay(index * delay, withTiming(1, { duration: motion.duration.normal })) as any
      );
      anim.translateY.setValue(
        withDelay(index * delay, withTiming(0, { duration: motion.duration.normal, easing: Easing.out(Easing.cubic) })) as any
      );
    });
  }, [delay]);

  const reset = useCallback(() => {
    animationsRef.forEach(anim => {
      anim.opacity.setValue(0);
      anim.translateY.setValue(20);
    });
  }, []);

  return {
    animations: animationsRef,
    start,
    reset,
  };
}

export function useSpringValue(initialValue: number, config?: SpringConfig) {
  const valueRef = useRef(new Animated.Value(initialValue)).current;

  const animate = useCallback(
    (toValue: number, overrideConfig?: SpringConfig) => {
      valueRef.setValue(
        withSpring(toValue, {
          damping: overrideConfig?.damping ?? config?.damping ?? motion.spring.standard.damping,
          stiffness: overrideConfig?.stiffness ?? config?.stiffness ?? motion.spring.standard.stiffness,
          mass: overrideConfig?.mass ?? config?.mass ?? 1,
          overshootClamping: overrideConfig?.overshootClamping ?? config?.overshootClamping ?? true,
        }) as any
      );
    },
    [config]
  );

  const setValue = useCallback((value: number) => {
    valueRef.setValue(value);
  }, []);

  const stop = useCallback(() => {
    valueRef.stopAnimation();
  }, []);

  return {
    value: valueRef,
    animate,
    setValue,
    stop,
  };
}

export function useTimingValue(initialValue: number, duration = motion.duration.normal) {
  const valueRef = useRef(new Animated.Value(initialValue)).current;

  const animate = useCallback(
    (toValue: number, overrideDuration?: number, easing: EasingFunction | EasingFunctionFactory = Easing.out(Easing.cubic)) => {
      valueRef.setValue(
        withTiming(toValue, { duration: overrideDuration ?? duration, easing }) as any
      );
    },
    [duration]
  );

  const setValue = useCallback((value: number) => {
    valueRef.setValue(value);
  }, []);

  const stop = useCallback(() => {
    valueRef.stopAnimation();
  }, []);

  return {
    value: valueRef,
    animate,
    setValue,
    stop,
  };
}

export function useFadeIn(
  duration = motion.duration.normal,
  delay = 0
) {
  const opacityRef = useRef(new Animated.Value(0)).current;

  const start = useCallback(() => {
    opacityRef.setValue(
      withDelay(delay, withTiming(1, { duration, easing: Easing.out(Easing.cubic) })) as any
    );
  }, [duration, delay]);

  const reset = useCallback(() => {
    opacityRef.setValue(0);
  }, []);

  return {
    opacity: opacityRef,
    start,
    reset,
  };
}

export function useSlide(
  direction: 'up' | 'down' | 'left' | 'right',
  distance = 20,
  duration = motion.duration.normal
) {
  const translateRef = useRef({
    x: new Animated.Value(direction === 'left' ? distance : direction === 'right' ? -distance : 0),
    y: new Animated.Value(direction === 'up' ? distance : direction === 'down' ? -distance : 0),
  }).current;

  const start = useCallback(() => {
    translateRef.x.setValue(
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) }) as any
    );
    translateRef.y.setValue(
      withTiming(0, { duration, easing: Easing.out(Easing.cubic) }) as any
    );
  }, [duration]);

  const reset = useCallback(() => {
    translateRef.x.setValue(direction === 'left' ? distance : direction === 'right' ? -distance : 0);
    translateRef.y.setValue(direction === 'up' ? distance : direction === 'down' ? -distance : 0);
  }, [direction, distance]);

  return {
    translateX: translateRef.x,
    translateY: translateRef.y,
    start,
    reset,
  };
}

export function useScale(initialValue = 1) {
  const scaleRef = useRef(new Animated.Value(initialValue)).current;

  const animate = useCallback((toValue: number, config?: SpringConfig) => {
    scaleRef.setValue(
      withSpring(toValue, {
        damping: config?.damping ?? motion.spring.standard.damping,
        stiffness: config?.stiffness ?? motion.spring.standard.stiffness,
      }) as any
    );
  }, []);

  const pressIn = useCallback(() => {
    scaleRef.setValue(withSpring(motion.scale.press, motion.spring.press) as any);
  }, []);

  const pressOut = useCallback(() => {
    scaleRef.setValue(withSpring(1, motion.spring.press) as any);
  }, []);

  return {
    scale: scaleRef,
    animate,
    pressIn,
    pressOut,
  };
}