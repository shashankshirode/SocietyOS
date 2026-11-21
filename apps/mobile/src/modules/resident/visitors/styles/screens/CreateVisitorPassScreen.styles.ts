import { StyleSheet } from 'react-native';
import { Radius, Spacing } from '../../../../../shared/theme';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  composer: { gap: Spacing.xl, width: '100%', maxWidth: 1040, alignSelf: 'center' },
  composerSplit: { flexDirection: 'row', alignItems: 'flex-start' },
  inputs: { minWidth: 0, gap: Spacing.md },
  splitColumn: { flex: 1, minWidth: 0 },
  section: { gap: Spacing.sm },
  recentRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  recentPerson: { minWidth: 132, flexGrow: 1, flexBasis: 132, borderWidth: 1, borderRadius: Radius.control, padding: Spacing.md, gap: 2 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeZone: { minHeight: 76, flexGrow: 1, flexBasis: 132, borderWidth: 1, borderRadius: Radius.card, padding: Spacing.md, justifyContent: 'center', gap: Spacing.xs },
  fields: { gap: Spacing.md },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  choice: { minHeight: 44, borderWidth: 1, borderRadius: Radius.control, paddingHorizontal: Spacing.md, alignItems: 'center', justifyContent: 'center' },
  disclosure: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  summary: { minWidth: 0 },
  accessObject: { borderWidth: 1, borderRadius: Radius.hero, padding: Spacing.xl, gap: Spacing.sm },
  accessRule: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(128,128,128,0.35)', marginVertical: Spacing.sm },
  issued: { gap: Spacing.sm },
  command: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
});

export const colorStyle = (color: string) => ({ color });
export const backgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const backgroundBorder = (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor });
