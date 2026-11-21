import { StyleSheet } from 'react-native';
import {
  FONT_FAMILY_INTER,
  FONT_FAMILY_INTER_MEDIUM,
  FONT_FAMILY_INTER_BOLD,
} from '../../../../../shared/theme/typography';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F6F0',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
    marginRight: -4,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
    marginTop: 2,
  },
  hiddenAccessibilityText: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#064F43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingHorizontal: 14,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
  },
  segmentedWrapper: {
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 17,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  groupCount: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#8C928E',
  },
  listGrid: {
    gap: 12,
  },
  complaintCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  infoCol: {
    flex: 1,
    gap: 4,
  },
  ticketRefText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#8C928E',
  },
  titleText: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  sublineText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  pillRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
    color: '#111613',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 20,
  },
  emptyCtaBtn: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#064F43',
    borderRadius: 14,
  },
  emptyCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
  },
});

export function createRootTopInset(inset: number) {
  return { paddingTop: inset } as const;
}

export function createScrollPadding(bottom: number) {
  return { paddingBottom: bottom + 84 } as const;
}
