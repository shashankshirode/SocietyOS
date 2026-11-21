import { StyleSheet } from 'react-native';
import { residentColors } from '../../../../../shared/theme/residentColors';

export const createFieldBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createFieldHeightStyle = (minHeight: number) => ({ minHeight });
export const createOrbitColorStyle = (borderColor: string) => ({ borderColor });
export const createOrbitSizeStyle = (size: number) => ({ width: size, height: size, borderRadius: size / 2 });
export const createRingSizeStyle = (size: number) => ({ width: size, height: size, borderRadius: size / 2 });
export const createPulseCenterStyle = (state: 'calm' | 'active' | 'attention', danger: string, primarySoft: string) => ({ backgroundColor: state === 'attention' ? danger : primarySoft });

export const styles = StyleSheet.create({
  fieldWrapper: { width: '100%', gap: 10 },
  field: { borderRadius: 34, padding: 22, overflow: 'hidden' },
  copy: { zIndex: 3, maxWidth: '76%', gap: 7 },
  eyebrow: { color: residentColors.onBrandMedium, letterSpacing: 0.65 },
  title: { color: residentColors.onBrand, fontSize: 29, lineHeight: 35 },
  titleCompact: { fontSize: 25, lineHeight: 31 },
  subtitle: { color: residentColors.onBrandMedium },
  orbitPosition: { position: 'absolute', left: 8, right: 8, top: 72, alignItems: 'center' },
  orbitHost: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  orbit: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1, opacity: 0.42 },
  center: { alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  signalLayer: { ...StyleSheet.absoluteFill },
  momentRail: { minHeight: 64, borderRadius: 20, backgroundColor: residentColors.darkElevatedSurface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  moment: { flex: 1, gap: 3, minWidth: 0 },
  momentTime: { color: residentColors.attentionOnBrand },
  momentTitle: { color: residentColors.onBrand },
});
