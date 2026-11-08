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
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EBE8DF',
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
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  unreadHeaderBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D0C5',
  },
  markAllText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#2563EB',
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EBE8DF',
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D4D0C5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  filterPillText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#4B5563',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  pillCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  pillCountBadgeActive: {
    backgroundColor: '#334155',
  },
  pillCountText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#475569',
  },
  pillCountTextActive: {
    color: '#F8FAFC',
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    position: 'relative',
  },
  cardUnread: {
    backgroundColor: '#F0F7FF',
    borderColor: '#BFDBFE',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeSecurity: {
    backgroundColor: '#FEF3C7',
  },
  categoryBadgeBilling: {
    backgroundColor: '#DCFCE7',
  },
  categoryBadgeComplaints: {
    backgroundColor: '#FEE2E2',
  },
  categoryBadgeNotices: {
    backgroundColor: '#E0E7FF',
  },
  categoryBadgeCommunity: {
    backgroundColor: '#F3E8FF',
  },
  categoryBadgeDefault: {
    backgroundColor: '#F1F5F9',
  },
  categoryText: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  categoryTextSecurity: {
    color: '#92400E',
  },
  categoryTextBilling: {
    color: '#166534',
  },
  categoryTextComplaints: {
    color: '#991B1B',
  },
  categoryTextNotices: {
    color: '#3730A3',
  },
  categoryTextCommunity: {
    color: '#6B21A8',
  },
  categoryTextDefault: {
    color: '#475569',
  },
  timeText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER,
    color: '#64748B',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
    paddingRight: 16,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#475569',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#2563EB',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityBadgeCritical: {
    backgroundColor: '#FEE2E2',
  },
  priorityBadgeImportant: {
    backgroundColor: '#FEF3C7',
  },
  priorityTextCritical: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#DC2626',
  },
  priorityTextImportant: {
    fontSize: 11,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    color: '#D97706',
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
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
});

