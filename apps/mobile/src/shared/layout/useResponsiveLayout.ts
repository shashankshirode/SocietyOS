import { useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width } = useWindowDimensions();
  const isSmallPhone = width <= 360;
  const isPhone = width < 600;
  const isLargePhone = width >= 390 && width < 600;
  const isTablet = width >= 768;
  const columns: 1 | 2 | 3 = isTablet ? 3 : isSmallPhone ? 1 : 2;

  return { width, isSmallPhone, isPhone, isLargePhone, isTablet, columns };
}
