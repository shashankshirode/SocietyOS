import { StyleSheet } from 'react-native';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../../shared/theme/typography';

export const createRootStyle = (backgroundColor: string) => ({ backgroundColor, flex: 1 });

export const createCardSurfaceStyle = (backgroundColor: string, borderColor: string) => ({
  backgroundColor,
  borderColor,
});

export const createTextStyle = (color: string) => ({ color });

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 6,
    marginLeft: -6,
  },
  titleText: {
    fontSize: 20,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  unreadHeaderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unreadHeaderBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  filterContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPillActive: {
    borderColor: 'transparent',
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
  },
  filterPillTextActive: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  pillCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCountBadgeActive: {},
  pillCountText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  pillCountTextActive: {},

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {},
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTextContent: {
    flex: 1,
    minWidth: 0,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    lineHeight: 20,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2,
    flexShrink: 0,
  },
  chevron: {
    marginTop: 2,
    flexShrink: 0,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    textAlign: 'center',
    lineHeight: 20,
  },

  listFooter: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerLoader: {
    marginBottom: 8,
  },
  footerLoadingText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  footerEndText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
  },
  listFooterError: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  footerErrorText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    textAlign: 'center',
    marginBottom: 4,
  },
  footerRetryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  footerRetryText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
});