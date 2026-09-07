import { StyleSheet } from 'react-native';
import { Radius } from '../../../../../shared/theme/radius';

export const styles = StyleSheet.create({
  stack: {
    gap: 14,
    paddingVertical: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  heroCard: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billRow: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 14,
  },
});
