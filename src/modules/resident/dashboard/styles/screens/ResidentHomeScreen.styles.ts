import { StyleSheet, Platform, ImageStyle } from 'react-native';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor });
export const createScrollContentStyle = (topInset: number, bottomInset: number) => ({
  paddingTop: topInset,
  paddingBottom: bottomInset + 32,
});

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAF8F1',
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
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  societyUnitText: {
    fontSize: 11,
    color: '#64748B',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  } as ImageStyle,

  // Greeting & Weather
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
    color: '#475569',
    fontWeight: '400',
  },
  greetingName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginTop: 1,
  },
  greetingTagline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weatherTemp: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  weatherCondition: {
    fontSize: 11,
    color: '#64748B',
  },

  // Hero Spotlight
  heroContainer: {
    marginHorizontal: 20,
    marginTop: 18,
    height: 165,
    borderRadius: 20,
    overflow: 'hidden',
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
  } as ImageStyle,
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(4, 27, 23, 0.45)',
    padding: 18,
    justifyContent: 'space-between',
  },
  heroContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  heroArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  // Section Headers
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
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D5C4D',
  },

  // Needs your attention row
  attentionCardsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  attentionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    justifyContent: 'space-between',
    minHeight: 146,
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
  },
  attentionIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attentionCategoryText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  attentionValueText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  attentionDueText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 2,
  },
  attentionVisitorTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  payNowBtn: {
    backgroundColor: '#11382E',
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  payNowBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  viewPassBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  viewPassBtnText: {
    color: '#1E293B',
    fontSize: 12,
    fontWeight: '600',
  },

  // Today at a glance
  glanceRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  glanceCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
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
  glanceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  glanceLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },

  // Event Card
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventTextCol: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  eventSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // Compatibility styles preserved
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
