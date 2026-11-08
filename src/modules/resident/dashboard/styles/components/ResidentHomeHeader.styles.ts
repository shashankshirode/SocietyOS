import { StyleSheet, Platform, ViewStyle, TextStyle } from 'react-native';

export const createHeaderContainerStyle = (topInset: number): ViewStyle => ({
  paddingTop: Math.max(topInset, 12),
});

export const createAuraDotStyle = (color: string): ViewStyle => ({
  backgroundColor: color,
});

export const createLogoBoxStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  width: 38,
  height: 38,
  borderRadius: 12,
  backgroundColor,
  borderWidth: 1,
  borderColor,
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

export const createSocietyNameStyle = (color: string): TextStyle => ({
  fontSize: 16,
  fontWeight: '700',
  color,
  letterSpacing: -0.2,
  flex: 1,
  maxWidth: '100%',
});

export const createChevronIconStyle = (color: string): TextStyle => ({
  marginTop: 1,
  color,
  flexShrink: 0,
});

export const createUnitTextStyle = (color: string): TextStyle => ({
  fontSize: 12,
  fontWeight: '500',
  color,
  marginTop: 1,
});

export const createLabBadgeStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
  backgroundColor,
  borderWidth: 1,
  borderColor,
  paddingHorizontal: 8,
  paddingVertical: 5,
  borderRadius: 10,
});

export const createLabTextStyle = (color: string): TextStyle => ({
  fontSize: 11,
  fontWeight: '700',
  color,
});

export const createIconButtonStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor,
  borderWidth: 1,
  borderColor,
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  flexShrink: 0,
});

export const createBadgeStyle = (backgroundColor: string): ViewStyle => ({
  position: 'absolute',
  top: 5,
  right: 5,
  minWidth: 16,
  height: 16,
  borderRadius: 8,
  paddingHorizontal: 4,
  backgroundColor,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.5,
  borderColor: '#FFFFFF',
});

export const createBadgeTextStyle = (color: string): TextStyle => ({
  color,
  fontSize: 9,
  fontWeight: '800',
  lineHeight: 11,
});

export const createAvatarButtonStyle = (backgroundColor: string, borderColor: string): ViewStyle => ({
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor,
  borderWidth: 1.5,
  borderColor,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  flexShrink: 0,
});

export const createGreetingTextStyle = (color: string): TextStyle => ({
  fontSize: 22,
  fontWeight: '400',
  color,
  letterSpacing: -0.3,
});

export const createResidentNameTextStyle = (color: string): TextStyle => ({
  fontSize: 24,
  fontWeight: '800',
  color,
  letterSpacing: -0.4,
});

export const createStatusAuraTextStyle = (color: string): TextStyle => ({
  fontSize: 13,
  fontWeight: '500',
  color,
});

export const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  residenceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  residenceInfo: {
    flex: 1,
    minWidth: 0,
  },
  societyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  avatarImage: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
  },
  avatarFallback: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  greetingBlock: {
    marginTop: 4,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    flexWrap: 'wrap',
  },
  statusAuraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  auraDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  logoBoxShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconButtonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
});