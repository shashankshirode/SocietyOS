import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

export const createSignalCardStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createDotStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createSectionHeadingStyle = (color: string): TextStyle => ({
  color,
});

export const createSectionLinkStyle = (color: string): TextStyle => ({
  color,
});

export const createCellValueStyle = (color: string): TextStyle => ({
  color,
});

export const createCellLabelStyle = (color: string): TextStyle => ({
  color,
});

export const createBeaconDotStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createCellStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  backgroundColor,
  borderColor,
  borderWidth: 1,
});

export const createIconBoxStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createRowStyle = (): ViewStyle => ({
  flexDirection: 'row',
  gap: 12,
});

export const createCellFlexStyle = (): ViewStyle => ({
  flex: 1,
  minWidth: 0,
});

export const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  beaconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cellTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cellValue: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  cellLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});