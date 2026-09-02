
import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';
import { resolveResponsiveClass, responsiveBreakpoints, responsiveLayoutTokens, type ResponsiveClass } from './responsiveTokens';

export type DeviceLayoutSize = 'phoneSmall' | 'phone' | 'phoneLarge' | 'fold' | 'tablet' | 'tabletWide';

export const layoutBreakpoints = {
  compactPhone: responsiveBreakpoints.compact,
  standardPhone: responsiveBreakpoints.phone,
  largePhone: responsiveBreakpoints.largePhone,
  fold: responsiveBreakpoints.fold,
  tablet: responsiveBreakpoints.tablet,
  largeTablet: responsiveBreakpoints.wide,
  phoneSmall: responsiveBreakpoints.compact,
  phone: responsiveBreakpoints.phone,
  phoneLarge: responsiveBreakpoints.largePhone,
  tabletWide: responsiveBreakpoints.wide,
} as const;

export interface ResponsiveLayout {
  
  width: number;
  
  height: number;
  
  isSmall: boolean;
  
  isNormal: boolean;
  
  isLarge: boolean;
  
  isTablet: boolean;
  
  isTabletWide: boolean;
  
  layoutSize: DeviceLayoutSize;
  layoutClass: ResponsiveClass;
  isFold: boolean;
  
  contentMaxWidth: number;
  
  columns: number;
  
  modalMode: 'sheet' | 'centered';
  
  screenPadding: number;
}

export function resolveResponsiveLayout(width: number, height: number): ResponsiveLayout {
  const layoutClass = resolveResponsiveClass(width);
  const isSmall = layoutClass === 'compact';
  const isNormal = layoutClass === 'phone';
  const isFold = layoutClass === 'fold';
  const isLarge = layoutClass === 'largePhone' || isFold;
  const isTablet = layoutClass === 'tablet' || layoutClass === 'wide';
  const isTabletWide = layoutClass === 'wide';
  const layoutSize: DeviceLayoutSize = layoutClass === 'compact'
    ? 'phoneSmall'
    : layoutClass === 'phone'
      ? 'phone'
      : layoutClass === 'largePhone'
        ? 'phoneLarge'
        : layoutClass === 'wide'
          ? 'tabletWide'
          : layoutClass;
  const contentMaxWidth = Math.min(width, responsiveLayoutTokens.maxContentWidth[layoutClass]);
  const screenPadding = responsiveLayoutTokens.gutter[layoutClass];

  return {
    width,
    height,
    isSmall,
    isNormal,
    isLarge,
    isTablet,
    isTabletWide,
    layoutSize,
    layoutClass,
    isFold,
    contentMaxWidth,
    columns: isTabletWide ? 4 : isTablet ? 3 : isSmall ? 1 : 2,
    modalMode: isTablet || isFold ? 'centered' : 'sheet',
    screenPadding,
  };
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    return resolveResponsiveLayout(width, height);
  }, [width, height]);
}

export default useResponsiveLayout;
