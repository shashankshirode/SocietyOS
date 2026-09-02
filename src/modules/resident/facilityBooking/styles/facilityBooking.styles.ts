import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { Radius } from '../../../../shared/theme/radius';
import { Spacing } from '../../../../shared/theme/spacing';

export const facilityBookingStyles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  contentStack: { gap: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  footerContainer: { width: '100%' },
  compactStack: { gap: Spacing.md },
  section: { gap: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  wrapRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm },
  grow: { flex: 1 },
  mutedDivider: { height: 1, width: '100%' },

  // Hero & Narrative
  hero: { borderRadius: Radius.xl, overflow: 'hidden', minHeight: 180, position: 'relative' },
  heroImage: { minHeight: 180, width: '100%', borderRadius: Radius.xl },
  heroScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'flex-end',
    padding: Spacing.lg,
    gap: 6,
    backgroundColor: 'rgba(10, 18, 14, 0.75)',
  },
  heroBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.pill },
  heroAction: { alignSelf: 'flex-start', marginTop: Spacing.xs },

  // Space Horizon
  horizonContainer: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
  },
  horizonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  horizonTrack: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  horizonNode: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
    minWidth: 130,
  },

  // Space Objects (Discovery)
  spaceFeatureCard: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    gap: 0,
  },
  spaceFeatureImage: {
    height: 160,
    width: '100%',
  },
  spaceFeatureBody: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  spaceCompactCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },

  // Facts Grid (2x2)
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  factCell: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
  },

  // Time Landscape (Availability Ribbon)
  timeLandscape: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  timeRibbonTrack: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  timeSlotNode: {
    minWidth: 100,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  timeSlotNodeSelected: {
    transform: [{ scale: 1.04 }],
  },

  // My Time (Bookings)
  nextBookingSpotlight: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  timelineCard: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  paymentCallout: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },

  // Legacy / Form Elements
  searchBar: { minHeight: 50, borderWidth: 1, borderRadius: Radius.input, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg },
  searchInput: { flex: 1, minHeight: 48, fontSize: 15 },
  horizontalContent: { gap: Spacing.sm, paddingRight: Spacing.lg },
  chip: { minHeight: 38, paddingHorizontal: Spacing.md, borderRadius: Radius.pill, borderWidth: 1, justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.lg },
  gridItem: { minWidth: 280, flexGrow: 1, flexBasis: 320, maxWidth: 560 },
  facilityCard: { overflow: 'hidden', gap: 0 },
  facilityCardImage: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
  facilityCardContent: { padding: Spacing.lg, gap: Spacing.md },
  facilityCardMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.md },
  iconText: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  statusPill: { borderRadius: Radius.pill, borderWidth: 1, paddingHorizontal: Spacing.md, minHeight: 28, justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start' },
  detailHero: { borderRadius: Radius.xl, overflow: 'hidden' },
  detailImage: { minHeight: 200, width: '100%' },
  imageBadges: { position: 'absolute', left: Spacing.lg, right: Spacing.lg, bottom: Spacing.lg, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm },
  informationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  informationCell: { minWidth: 150, flexGrow: 1, flexBasis: 180, borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, gap: Spacing.xs },
  amenityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  amenity: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, minHeight: 40, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, flexGrow: 1, flexBasis: 140 },
  policyCard: { gap: Spacing.md },
  policyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  policyIcon: { width: 34, height: 34, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center' },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: Spacing.md },
  dateStripContent: { gap: Spacing.sm, paddingRight: Spacing.lg },
  dateButton: { minWidth: 78, minHeight: 74, borderWidth: 1, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', gap: Spacing.xs, padding: Spacing.sm },
  slotCard: { gap: Spacing.sm },
  slotSelectIndicator: { width: 22, height: 22, borderRadius: Radius.pill, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  slotSelectInner: { width: 10, height: 10, borderRadius: Radius.pill },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  legendDot: { width: 10, height: 10, borderRadius: Radius.pill },
  holdBanner: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.md, flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  formCard: { gap: Spacing.lg },
  guestCounter: { borderWidth: 1, borderRadius: Radius.input, minHeight: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.sm },
  counterButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md },
  counterValue: { minWidth: 56, alignItems: 'center' },
  setupOption: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.md },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderRadius: Radius.xs, alignItems: 'center', justifyContent: 'center' },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, minHeight: 48 },
  summaryCard: { gap: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.lg, paddingVertical: Spacing.sm },
  infoLabel: { flexBasis: 130, flexShrink: 1 },
  infoValue: { flex: 1 },
  priceTotal: { borderTopWidth: 1, marginTop: Spacing.sm, paddingTop: Spacing.lg },
  paymentMethod: { borderWidth: 1, borderRadius: Radius.md, padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  paymentIcon: { width: 42, height: 42, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  paymentRadio: { width: 22, height: 22, borderRadius: Radius.pill, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  successIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  successHero: { alignItems: 'center', gap: Spacing.sm },
  qrSurface: { alignSelf: 'center', borderRadius: Radius.lg, padding: Spacing.lg },
  qrCodeText: { letterSpacing: 3 },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  bookingCard: { gap: Spacing.md },
  bookingImage: { width: 72, height: 72, borderRadius: Radius.md },
  bookingCardContent: { flex: 1, gap: Spacing.xs },
  bookingActions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: Spacing.sm },
  tabs: { flexDirection: 'row', gap: Spacing.sm, paddingVertical: Spacing.md },
  tab: { flex: 1, minHeight: 40, borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.sm },
  timeline: { gap: 0 },
  timelineRow: { flexDirection: 'row', alignItems: 'stretch', gap: Spacing.md },
  timelineMarkerColumn: { width: 24, alignItems: 'center' },
  timelineMarker: { width: 16, height: 16, borderRadius: Radius.pill, borderWidth: 2, marginTop: 3 },
  timelineLine: { width: 2, flex: 1, minHeight: 30 },
  timelineContent: { flex: 1, gap: Spacing.xs, paddingBottom: Spacing.lg },
  cancellationChoice: { minHeight: 48, borderWidth: 1, borderRadius: Radius.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.lg },
  refundHighlight: { borderWidth: 1, borderRadius: Radius.lg, padding: Spacing.lg, gap: Spacing.sm },
  waitlistPosition: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  stickyButtons: { gap: Spacing.sm },
  stickyButtonRow: { flexDirection: 'row', gap: Spacing.sm },
  stickyButton: { flex: 1 },
  skeletonCard: { gap: Spacing.md },
  skeletonRow: { flexDirection: 'row', gap: Spacing.md },
  footerLoader: { paddingVertical: Spacing.lg, alignItems: 'center' },
  emptyContainer: { paddingVertical: Spacing['3xl'] },
  offlineBanner: { borderBottomWidth: 1, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  tabletColumns: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xl },
  tabletPrimary: { flex: 1.4 },
  tabletSecondary: { flex: 1 },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  opacityMuted: { opacity: 0.58 },
});

export function backgroundColorStyle(backgroundColor: string): ViewStyle {
  return { backgroundColor };
}

export function backgroundBorderStyle(backgroundColor: string, borderColor: string): ViewStyle {
  return { backgroundColor, borderColor };
}

export function colorStyle(color: string): TextStyle {
  return { color };
}

export function borderColorStyle(borderColor: string): ViewStyle {
  return { borderColor };
}

export function heroOverlayStyle(backgroundColor: string): ViewStyle {
  return { backgroundColor };
}

export function selectedBorderStyle(borderColor: string, backgroundColor: string): ViewStyle {
  return { borderColor, backgroundColor };
}

export function bottomPaddingStyle(paddingBottom: number): ViewStyle {
  return { paddingBottom };
}
