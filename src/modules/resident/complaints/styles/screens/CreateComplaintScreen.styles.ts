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
    paddingTop: 12,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
    marginBottom: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  categoryItemSelected: {
    backgroundColor: '#EEF7F4',
    borderColor: '#064F43',
    borderWidth: 1.5,
  },
  categoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F1EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconBoxSelected: {
    backgroundColor: '#064F43',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#626A65',
    textAlign: 'center',
  },
  categoryTextSelected: {
    color: '#064F43',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    padding: 16,
    gap: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    minHeight: 88,
    textAlignVertical: 'top',
  },
  locationScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  locationChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  locationChipSelected: {
    backgroundColor: '#064F43',
    borderColor: '#064F43',
  },
  locationChipText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#626A65',
  },
  locationChipTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '600',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityChipSelectedLow: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  priorityChipSelectedMedium: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  priorityChipSelectedHigh: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  priorityChipSelectedUrgent: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
  },
  priorityChipText: {
    fontSize: 13,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    color: '#626A65',
  },
  priorityChipTextSelected: {
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  mediaSection: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  photoThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E3DC',
  },
  addPhotoBtn: {
    width: 64,
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#064F43',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF7F4',
  },
  submitBtn: {
    backgroundColor: '#064F43',
    borderRadius: 16,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
});

export function createRootTopInset(inset: number) {
  return { paddingTop: inset } as const;
}

export function createScrollPadding(bottom: number) {
  return { paddingBottom: bottom + 48 } as const;
}
