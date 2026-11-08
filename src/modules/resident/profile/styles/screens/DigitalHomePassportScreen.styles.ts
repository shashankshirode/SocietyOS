import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 64,
    gap: 16,
  },
  contentGrid: {
    gap: 16,
  },
  tabletContentGrid: {
    gap: 20,
  },
  passportHeroCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  passportHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  passportTitleCol: {
    flex: 1,
    gap: 4,
  },
  societyName: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unitHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flatNumberText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  towerWingText: {
    fontSize: 13,
    fontWeight: '500',
  },
  architecturalSpecsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  specChip: {
    flexBasis: '47%',
    flexGrow: 1,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 2,
  },
  specLabel: {
    fontSize: 11,
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  residenceSwitcherBar: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  switcherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switcherTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  residenceChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  residenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  residenceChipActive: {
    borderWidth: 2,
  },
  residenceChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sectionActionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  recordsTable: {
    gap: 8,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
  },
  recordKey: {
    fontSize: 13,
  },
  recordValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  immutableBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  immutableBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  correctionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
  },
  correctionBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  householdMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  householdAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  householdAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  householdDetails: {
    flex: 1,
    gap: 2,
  },
  householdName: {
    fontSize: 14,
    fontWeight: '600',
  },
  householdRole: {
    fontSize: 12,
  },
  vehicleItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  vehicleInfo: {
    gap: 2,
    flex: 1,
  },
  vehiclePlate: {
    fontSize: 15,
    fontWeight: '700',
  },
  vehicleSub: {
    fontSize: 12,
  },
  vehicleSlotPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vehicleSlotPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  docVaultSummaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  docVaultStat: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  docVaultStatCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  docVaultStatLabel: {
    fontSize: 11,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineIconCol: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 14,
    gap: 2,
  },
  timelineEventTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  timelineEventDate: {
    fontSize: 11,
  },
  timelineEventDesc: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 14,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  fieldOptionGroup: {
    gap: 8,
  },
  fieldOptionBtn: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  fieldOptionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
  },
  modalSubmitBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalSubmitText: {
    fontSize: 15,
    fontWeight: '700',
  },
  successBanner: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  successBannerText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyNoticeText: {
    fontSize: 13,
    paddingVertical: 6,
  },
});

export function createBgStyle(color: string) {
  return { backgroundColor: color };
}

export function createBorderColorStyle(color: string) {
  return { borderColor: color };
}

export function createBgBorderColorStyle(bg: string, border: string) {
  return { backgroundColor: bg, borderColor: border };
}

export function createTextColorStyle(color: string) {
  return { color };
}

