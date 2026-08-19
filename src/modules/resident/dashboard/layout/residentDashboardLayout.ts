import { layoutBreakpoints } from '../../../../ui/layout/useResponsiveLayout';

export type ResidentDashboardLayoutMode =
  | 'compactPhone'
  | 'phone'
  | 'largePhone'
  | 'tablet'
  | 'largeTablet';

export type ResidentDashboardLayout = {
  mode: ResidentDashboardLayoutMode;
  isCompactPhone: boolean;
  isLargePhone: boolean;
  isTablet: boolean;
  isLargeTablet: boolean;
  usesTwoPane: boolean;
  usesWidePhonePairs: boolean;
  contentMaxWidth: number;
  horizontalGap: number;
  sectionGap: number;
  bottomContentInset: number;
};

export function resolveResidentDashboardLayout(
  width: number,
  _height: number,
): ResidentDashboardLayout {
  const isCompactPhone = width < layoutBreakpoints.standardPhone;
  const isLargePhone = width >= layoutBreakpoints.largePhone && width < layoutBreakpoints.tablet;
  const isTablet = width >= layoutBreakpoints.tablet;
  const isLargeTablet = width >= layoutBreakpoints.largeTablet;

  const mode: ResidentDashboardLayoutMode = isLargeTablet
    ? 'largeTablet'
    : isTablet
      ? 'tablet'
      : isLargePhone
        ? 'largePhone'
        : isCompactPhone
          ? 'compactPhone'
          : 'phone';

  return {
    mode,
    isCompactPhone,
    isLargePhone,
    isTablet,
    isLargeTablet,
    usesTwoPane: isTablet,
    usesWidePhonePairs: isLargePhone && width >= 680,
    contentMaxWidth: isLargeTablet ? 1240 : isTablet ? 1040 : width,
    horizontalGap: isLargeTablet ? 24 : isTablet ? 20 : 14,
    sectionGap: isCompactPhone ? 22 : isTablet ? 24 : 28,
    bottomContentInset: isTablet ? 144 : 112,
  };
}
