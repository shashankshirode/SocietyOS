import { StyleSheet } from 'react-native';
import { residentColors } from '../../../../../shared/theme/residentColors';
import { residentSemanticDark } from '../../../../../ui/foundation/semanticTokens';

export const createRootInsetStyle = (topInset: number) => ({ paddingTop: topInset + 16 });
export const createContentInsetStyle = (bottomInset: number, isScreen: boolean = false) => ({
  paddingBottom: isScreen ? bottomInset + 120 : bottomInset + 32,
});

export const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: residentColors.darkCanvas, paddingHorizontal: 18 },
  modalContent: { backgroundColor: residentColors.darkCanvas, paddingBottom: 0 },
  header: { minHeight: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1200, width: '100%', alignSelf: 'center' },
  content: { paddingTop: 14, gap: 16, width: '100%', maxWidth: 1200, alignSelf: 'center' },
  contentWide: { paddingTop: 20 },
  environment: { gap: 18 },
  environmentWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 28 },
  pulsePane: { flex: 1.12, minWidth: 0 },
  contextPane: { flex: 0.88, minWidth: 0, gap: 14 },
  title: { color: residentColors.onBrand },
  muted: { color: residentColors.onBrandMedium },
  scopeRail: { alignSelf: 'center', minHeight: 44, flexDirection: 'row', alignItems: 'center', borderRadius: 22, padding: 4, backgroundColor: residentColors.darkElevatedSurface },
  scopeOption: { minWidth: 72, minHeight: 36, paddingHorizontal: 14, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scopeOptionSelected: { backgroundColor: residentSemanticDark.success },
  scopeTextSelected: { color: residentColors.darkCanvas, fontWeight: '800' },
  orbitWrap: { alignItems: 'center', justifyContent: 'center', minHeight: 372, paddingVertical: 10 },
  orbitWrapWide: { minHeight: 570 },
  selectedSignal: { minHeight: 92, borderRadius: 22, backgroundColor: residentColors.darkElevatedSurface, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  selectedSignalCopy: { flex: 1, gap: 3 },
  focusEyebrow: { color: residentSemanticDark.warning, letterSpacing: 0.7, textTransform: 'uppercase' },
  narrative: { gap: 6, paddingTop: 4 },
  eyebrow: { color: residentColors.attentionOnBrand, letterSpacing: 0.8, marginTop: 8, textTransform: 'uppercase' },
  timeline: { marginBottom: 4 },
  timelineRow: { minHeight: 76, flexDirection: 'row', borderRadius: 16, paddingTop: 7, paddingHorizontal: 4 },
  timelineRowSelected: { backgroundColor: residentColors.darkElevatedSurface },
  timelineRail: { width: 24, alignItems: 'center' },
  timelineNode: { width: 10, height: 10, borderRadius: 5, marginTop: 4, zIndex: 2 },
  timelineLine: { position: 'absolute', width: 1, backgroundColor: residentSemanticDark.borderStrong, top: 12, bottom: -4 },
  time: { color: residentColors.attentionOnBrand, width: 68 },
  timelineCopy: { flex: 1, gap: 2, paddingBottom: 16 },
  timelineNode_sage: { backgroundColor: residentSemanticDark.success },
  timelineNode_amber: { backgroundColor: residentSemanticDark.warning },
  timelineNode_facility: { backgroundColor: residentSemanticDark.accentSecondary },
  financialCommand: { minHeight: 92, borderRadius: 24, backgroundColor: residentColors.darkElevatedSurface, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  amber: { color: residentSemanticDark.warning },
  sage: { color: residentSemanticDark.success },
  explanation: { gap: 5, paddingVertical: 10 },
});
