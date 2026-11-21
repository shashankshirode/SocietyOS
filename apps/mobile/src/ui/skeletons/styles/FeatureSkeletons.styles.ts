import { StyleSheet } from "react-native";
import { Radius } from "../../../shared/theme/radius";
import { Spacing } from "../../../shared/theme/spacing";

export const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  greetingBlock: {
    marginBottom: 16,
    gap: 6,
  },
  pulseCard: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 20,
    gap: 14,
  },
  pulsePillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  statGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 10,
    gap: 6,
  },
  timelineNode: {
    alignItems: 'center',
    width: 20,
  },
  timelineLine: {
    marginVertical: 4,
  },
  grid2Col: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%',
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  facilityCard: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 14,
    gap: 10,
    marginBottom: 14,
  },
  noticeRow: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
});
