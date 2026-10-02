import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 20,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  ticketLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  ticketNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  privateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  privateBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  parentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  parentBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStep: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    borderColor: '#064F45',
    backgroundColor: '#ECFDF5',
  },
  progressDotCompleted: {
    borderColor: '#064F45',
    backgroundColor: '#064F45',
  },
  progressLine: {
    position: 'absolute',
    top: 12,
    left: '50%',
    right: '50%',
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  progressStepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  progressStepLabelActive: {
    color: '#064F45',
    fontWeight: '700',
  },
  detailsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 16,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    minWidth: 140,
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  descriptionText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  evidenceScroll: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  evidenceThumbnail: {
    width: 100,
    alignItems: 'center',
    gap: 6,
  },
  evidenceThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evidenceThumbLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 90,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#F0FDF4',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: '#064F45',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#064F45',
    borderRadius: 2,
  },
  tabContent: {
    paddingTop: 16,
    gap: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 24,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#064F45',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  timelineTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  timelineNote: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  timelineActor: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  evidenceScrollContent: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyTab: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyTabText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  evidenceList: {
    gap: 8,
  },
  evidenceListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  evidenceListIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  evidenceListInfo: {
    flex: 1,
    gap: 2,
  },
  evidenceListName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  evidenceListMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  commentItem: {
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  commentTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  commentText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  commentRole: {
    fontSize: 10,
    fontWeight: '600',
    color: '#064F45',
    textTransform: 'uppercase',
  },
  commentVisibility: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  commentInputField: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    maxHeight: 100,
  },
  actionsSection: {
    paddingTop: 8,
    gap: 12,
  },
  refreshControl: {
    paddingVertical: 16,
  },
});

export const createTextColorStyle = (color: string) => ({
  color,
});

export const createViewBackgroundColorStyle = (color: string) => ({
  backgroundColor: color,
});