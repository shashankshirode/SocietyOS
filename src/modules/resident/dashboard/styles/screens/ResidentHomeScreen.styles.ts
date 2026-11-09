import { StyleSheet, Platform, ImageStyle } from 'react-native';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createScrollContentStyle = (topInset: number, bottomInset: number) => ({
  paddingTop: topInset,
  paddingBottom: bottomInset + 24, // Extra space for content breathing room above bottom nav
});
export const createConnectLabTopStyle = (top: number) => ({ top });
export const createLabTextColorStyle = (color: string) => ({ color });

export const createSocietyNameStyle = (color: string) => ({ color });
export const createSocietyUnitTextStyle = (color: string) => ({ color });
export const createNotificationBtnStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});
export const createNotificationBadgeStyle = (backgroundColor: string) => ({ backgroundColor });
export const createNotificationBadgeTextStyle = (color: string) => ({ color });
export const createAvatarContainerStyle = (borderColor: string) => ({ borderColor });
export const createGreetingIntroStyle = (color: string) => ({ color });
export const createGreetingNameStyle = (color: string) => ({ color });
export const createGreetingTaglineStyle = (color: string) => ({ color });
export const createWeatherPillStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});
export const createWeatherTempStyle = (color: string) => ({ color });
export const createWeatherConditionStyle = (color: string) => ({ color });
export const createSectionHeadingStyle = (color: string) => ({ color });
export const createSectionLinkStyle = (color: string) => ({ color });
export const createAttentionCardStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});
export const createAttentionCategoryTextStyle = (color: string) => ({ color });
export const createAttentionValueTextStyle = (color: string) => ({ color });
export const createAttentionDueTextStyle = (color: string) => ({ color });
export const createAttentionVisitorTimeStyle = (color: string) => ({ color });
export const createPayNowBtnStyle = (backgroundColor: string) => ({ backgroundColor });
export const createPayNowBtnTextStyle = (color: string) => ({ color });
export const createViewPassBtnStyle = (backgroundColor: string) => ({ backgroundColor });
export const createViewPassBtnTextStyle = (color: string) => ({ color });
export const createGlanceCardStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});
export const createGlanceValueStyle = (color: string) => ({ color });
export const createGlanceLabelStyle = (color: string) => ({ color });
export const createEventCardStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});
export const createEventIconBadgeStyle = (backgroundColor: string) => ({ backgroundColor });
export const createEventTitleStyle = (color: string) => ({ color });
export const createEventSubtitleStyle = (color: string) => ({ color });

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centeredState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  connectLabButton: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectLabText: {
    fontWeight: '700',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  societyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  societyLogoBox: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  societyTextCol: {
    flex: 1,
  },
  societyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  societyName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  societyUnitText: {
    fontSize: 11,
    marginTop: 1,
  },
  headerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  greetingTextCol: {
    flex: 1,
  },
  greetingIntro: {
    fontSize: 14,
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  greetingTagline: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  weatherTemp: {
    fontSize: 13,
    fontWeight: '700',
  },
  weatherCondition: {
    fontSize: 11,
    fontWeight: '500',
  },
  heroContainer: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 20,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  } as ImageStyle,
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 10, 18, 0.45)',
    justifyContent: 'flex-end',
    padding: 18,
  },
  heroContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  heroTextCol: {
    flex: 1,
    marginRight: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  heroArrowBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
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
  attentionCardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  attentionCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    justifyContent: 'space-between',
    minHeight: 142,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  attentionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  attentionIconBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionCategoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  attentionValueText: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  attentionDueText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  attentionVisitorTime: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  payNowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  payNowBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  viewPassBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  viewPassBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  glanceRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
  },
  glanceCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  glanceValue: {
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },
  glanceLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginHorizontal: 20,
    marginTop: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  eventIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTextCol: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  eventSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  greetingBlock: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  contextBar: {
    minHeight: 68,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contextCopy: { flex: 1, gap: 2 },
  contextSociety: { letterSpacing: 0.55, textTransform: 'uppercase' },
  rolePill: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7 },
  communityRow: {
    borderTopWidth: 1,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});