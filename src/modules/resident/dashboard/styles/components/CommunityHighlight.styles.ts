import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

export const createSectionHeadingStyle = (color: string): TextStyle => ({ color });
export const createSectionLinkStyle = (color: string): TextStyle => ({ color });
export const createCardStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  backgroundColor,
  borderColor,
  borderWidth: 1,
  borderRadius: 18,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
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
export const createCardTitleStyle = (color: string): TextStyle => ({ color });
export const createCardSubtitleStyle = (color: string): TextStyle => ({ color });
export const createChevronStyle = (color: string): string => color;

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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  trailingAffordance: {
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },
});
