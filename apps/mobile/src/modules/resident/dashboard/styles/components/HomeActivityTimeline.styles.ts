import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

export const createSectionHeadingStyle = (color: string): TextStyle => ({ color });
export const createSectionLinkStyle = (color: string): TextStyle => ({ color });
export const createEmptyIconStyle = (color: string): string => color;
export const createEmptyTextStyle = (color: string): TextStyle => ({ color });
export const createItemTitleStyle = (color: string): TextStyle => ({ color });
export const createTimestampStyle = (color: string): TextStyle => ({ color });
export const createItemSubtitleStyle = (color: string): TextStyle => ({ color });
export const createChevronStyle = (color: string): string => color;

export const createCardStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  backgroundColor,
  borderColor,
  borderWidth: 1,
  borderRadius: 20,
  paddingHorizontal: 16,
  paddingVertical: 4,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
    },
    android: {
      elevation: 2,
    },
  }),
});

export const createDividerStyle = (color: string): ViewStyle => ({
  height: StyleSheet.hairlineWidth,
  backgroundColor: color,
  marginLeft: 52,
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
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },
  leadingIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  contentCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: 2,
  },
  itemTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  itemSubtitle: {
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 16,
  },
  timestamp: {
    fontSize: 11.5,
    fontWeight: '500',
    lineHeight: 15,
  },
  trailingAffordance: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 52,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
