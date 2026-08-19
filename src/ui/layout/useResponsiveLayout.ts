
import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

export type DeviceLayoutSize = 'phoneSmall' | 'phone' | 'phoneLarge' | 'tablet' | 'tabletWide';

export const layoutBreakpoints = {
  compactPhone: 0,
  standardPhone: 360,
  largePhone: 480,
  tablet: 768,
  largeTablet: 1024,
  
  phoneSmall: 0,
  phone: 360,
  phoneLarge: 480,
  tabletWide: 1024,
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
  
  contentMaxWidth: number;
  
  columns: number;
  
  modalMode: 'sheet' | 'centered';
  
  screenPadding: number;
}

export function resolveResponsiveLayout(width: number, height: number): ResponsiveLayout {
  const isSmall = width < layoutBreakpoints.phone;
  const isNormal = width >= layoutBreakpoints.phone && width < layoutBreakpoints.phoneLarge;
  const isLarge = width >= layoutBreakpoints.phoneLarge && width < layoutBreakpoints.tablet;
  const isTablet = width >= layoutBreakpoints.tablet;
  const isTabletWide = width >= layoutBreakpoints.tabletWide;
  const layoutSize: DeviceLayoutSize = isSmall
    ? 'phoneSmall'
    : isNormal
      ? 'phone'
      : isLarge
        ? 'phoneLarge'
        : isTabletWide
          ? 'tabletWide'
          : 'tablet';
  const contentMaxWidth = isTabletWide ? 1240 : isTablet ? 1040 : width;
  const screenPadding = isTabletWide ? 32 : isTablet ? 28 : isLarge ? 24 : isSmall ? 16 : 20;

  return {
    width,
    height,
    isSmall,
    isNormal,
    isLarge,
    isTablet,
    isTabletWide,
    layoutSize,
    contentMaxWidth,
    columns: isTabletWide ? 4 : isTablet ? 3 : isLarge ? 2 : isSmall ? 1 : 2,
    modalMode: isTablet || isLarge ? 'centered' : 'sheet',
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
