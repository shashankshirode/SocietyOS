import { StyleSheet } from 'react-native';
import { residentColors } from '../../../../../shared/theme/residentColors';

export const createCommandSurfaceStyle = (backgroundColor: string) => ({ backgroundColor });
export const createLabelStyle = (color: string) => ({ color });

export const styles = StyleSheet.create({
  section: { gap: 12 },
  surface: { minHeight: 116, borderRadius: 28, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 },
  icon: { width: 52, height: 52, borderRadius: 18, backgroundColor: residentColors.onBrandMedium, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
});

