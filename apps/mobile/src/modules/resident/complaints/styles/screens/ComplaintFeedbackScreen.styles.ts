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
  },
  centerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E5E3DC',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#064F43',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  resolvedTitle: {
    fontSize: 22,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
    color: '#111613',
  },
  complaintIdSubtitle: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#626A65',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 15,
    fontFamily: FONT_FAMILY_INTER_MEDIUM,
    fontWeight: '600',
    color: '#111613',
    marginTop: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },
  starPressable: {
    padding: 4,
  },
  commentsBox: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginTop: 8,
  },
  commentsInput: {
    fontSize: 14,
    fontFamily: FONT_FAMILY_INTER,
    color: '#111613',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitBtn: {
    width: '100%',
    backgroundColor: '#064F43',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONT_FAMILY_INTER_BOLD,
    fontWeight: '700',
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E3DC',
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  doneBtnText: {
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
