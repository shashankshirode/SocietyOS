import { useEffect, useState, useRef } from 'react';
import { loadingThresholds } from './loadingThresholds';


export function useLoadingCoordinator(
  rawLoading: boolean,
  options?: {
    showIndicatorAfterMs?: number;
    showSkeletonAfterMs?: number;
    minimumVisibleDurationMs?: number;
  }
) {
  const showIndicatorAfterMs = options?.showIndicatorAfterMs ?? loadingThresholds.showIndicatorAfterMs;
  const showSkeletonAfterMs = options?.showSkeletonAfterMs ?? loadingThresholds.showSkeletonAfterMs;
  const minimumVisibleDurationMs = options?.minimumVisibleDurationMs ?? loadingThresholds.minimumVisibleDurationMs;

  const [shouldShowIndicator, setShouldShowIndicator] = useState(false);
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  const loadingStartTimeRef = useRef<number | null>(null);
  const indicatorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skeletonTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const minDurationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shouldShowIndicatorRef = useRef(shouldShowIndicator);
  const shouldShowSkeletonRef = useRef(shouldShowSkeleton);

  useEffect(() => {
    shouldShowIndicatorRef.current = shouldShowIndicator;
    shouldShowSkeletonRef.current = shouldShowSkeleton;
  }, [shouldShowIndicator, shouldShowSkeleton]);

  const clearAllTimeouts = () => {
    if (indicatorTimeoutRef.current) clearTimeout(indicatorTimeoutRef.current);
    if (skeletonTimeoutRef.current) clearTimeout(skeletonTimeoutRef.current);
    if (minDurationTimeoutRef.current) clearTimeout(minDurationTimeoutRef.current);
  };

  useEffect(() => {
    if (rawLoading) {
      if (loadingStartTimeRef.current === null) {
        loadingStartTimeRef.current = Date.now();
        
        indicatorTimeoutRef.current = setTimeout(() => {
          setShouldShowIndicator(true);
        }, showIndicatorAfterMs);

        skeletonTimeoutRef.current = setTimeout(() => {
          setShouldShowSkeleton(true);
        }, showSkeletonAfterMs);
      }
    } else {
      const startTime = loadingStartTimeRef.current;
      if (startTime) {
        const elapsed = Date.now() - startTime;
        const wasShown = shouldShowIndicatorRef.current || shouldShowSkeletonRef.current;
        
        if (wasShown && elapsed < minimumVisibleDurationMs) {
          const remaining = minimumVisibleDurationMs - elapsed;
          clearAllTimeouts();
          
          minDurationTimeoutRef.current = setTimeout(() => {
            setShouldShowIndicator(false);
            setShouldShowSkeleton(false);
            loadingStartTimeRef.current = null;
          }, remaining);
        } else {
          clearAllTimeouts();
          setShouldShowIndicator(false);
          setShouldShowSkeleton(false);
          loadingStartTimeRef.current = null;
        }
      } else {
        clearAllTimeouts();
        setShouldShowIndicator(false);
        setShouldShowSkeleton(false);
      }
    }

    return () => clearAllTimeouts();
  }, [rawLoading, showIndicatorAfterMs, showSkeletonAfterMs, minimumVisibleDurationMs]);

  return {
    shouldShowIndicator,
    shouldShowSkeleton,
  };
}
