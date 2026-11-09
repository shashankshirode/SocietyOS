import { StyleSheet, Platform } from 'react-native';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor, flex: 1 });
export const createScrollContentStyle = (bottomInset: number) => ({
  paddingHorizontal: 16,
  paddingTop: 16,
  paddingBottom: bottomInset + 96,
});

export const createCardSurfaceStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});

export const createTextStyle = (color: string) => ({ color });

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  introSection: {
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  pageSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 20,
  },
  attentionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  attentionLeft: {
    flex: 1,
    marginRight: 12,
  },
  attentionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  attentionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 3,
    lineHeight: 18,
  },
  attentionBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterPillActive: {
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  actionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  actionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionHeaderMeta: {
    flex: 1,
  },
  actionCategoryTag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  actionPriorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionPriorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 22,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    marginBottom: 6,
  },
  actionMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  actionMetaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionDivider: {
    height: 1,
    marginVertical: 12,
  },
  actionFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    minHeight: 38,
  },
  actionCtaText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubheading: {
    fontSize: 13,
    fontWeight: '500',
  },
  activityGroup: {
    marginBottom: 16,
  },
  activityGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  activityGroupTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  activityGroupCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  activityListCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  activityItemLast: {
    borderBottomWidth: 0,
  },
  activityIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  activityDescription: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    lineHeight: 16,
  },
  activityTime: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  activityChevron: {
    flexShrink: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 8,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 280,
  },
});
