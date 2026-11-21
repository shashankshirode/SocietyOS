import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { resolveResponsiveClass, responsiveLayoutTokens } from './responsiveTokens';

export function resolveContainerLayout(width: number) {
  const layoutClass = resolveResponsiveClass(width);
  return {
    width,
    layoutClass,
    isCompact: layoutClass === 'compact',
    isPhone: layoutClass === 'compact' || layoutClass === 'phone' || layoutClass === 'largePhone',
    isFold: layoutClass === 'fold',
    isTablet: layoutClass === 'tablet' || layoutClass === 'wide',
    isWide: layoutClass === 'wide',
    gutter: responsiveLayoutTokens.gutter[layoutClass],
    focusWidth: responsiveLayoutTokens.focusWidth[layoutClass],
    paneGap: responsiveLayoutTokens.paneGap[layoutClass],
  } as const;
}

export function useContainerLayout(initialWidth = 390) {
  const [width, setWidth] = useState(initialWidth);
  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setWidth((currentWidth) => currentWidth === nextWidth || nextWidth <= 0 ? currentWidth : nextWidth);
  }, []);
  const layout = useMemo(() => resolveContainerLayout(width), [width]);
  return { ...layout, onLayout };
}
