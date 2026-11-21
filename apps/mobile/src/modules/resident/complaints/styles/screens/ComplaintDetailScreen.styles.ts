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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  complaintTitle: {
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
    lineHeight: 28,
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    gap: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
  },
  metaValue: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
  },
  metaDivider: {
    height: 1,
    backgroundColor: '#F2F1EB',
  },
  descCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    gap: 8,
  },
  descLabel: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#8C928E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  descText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    lineHeight: 22,
  },
  timelineSection: {
    gap: 10,
    marginTop: 4,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  feedbackCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    gap: 6,
  },
  feedbackTitle: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#064F43',
  },
  feedbackComment: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER,
    color: '#047857',
  },
  actionButtonsCol: {
    gap: 10,
    marginTop: 12,
  },
  primaryActionBtn: {
    backgroundColor: '#064F43',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  reopenBtn: {
    backgroundColor: '#FEF3C7',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reopenBtnText: {
    color: '#92400E',
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  secondaryActionBtn: {
    backgroundColor: '#FFFFFF',
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionBtnText: {
    color: '#064F43',
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
  },
});

export function createRootTopInset(inset: number) {
  return { paddingTop: inset } as const;
}

export function createScrollPadding(bottom: number) {
  return { paddingBottom: bottom + 40 } as const;
}
