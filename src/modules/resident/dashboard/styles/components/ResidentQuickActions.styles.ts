import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

export const createIconBoxStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createRailStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  backgroundColor,
  borderColor,
  flexDirection: 'row',
});

export const createActionLabelStyle = (color: string): TextStyle => ({
  color,
});

export const createBadgeDotStyle = (backgroundColor: string): ViewStyle => ({
  backgroundColor,
});

export const createActionItemStyle = (): ViewStyle => ({
  flex: 1,
  alignItems: 'center',
  paddingHorizontal: 6,
  paddingVertical: 10,
  minWidth: 0,
});

export const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  rail: {
    flexDirection: 'row',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
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
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 10,
    minWidth: 0,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});