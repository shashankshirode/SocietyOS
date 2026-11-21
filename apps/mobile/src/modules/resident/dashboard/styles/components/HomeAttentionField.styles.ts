import { StyleSheet } from 'react-native';
import { Radius } from '../../../../../shared/theme/radius';

export const createActionListStyle = (backgroundColor: string, borderColor: string) => ({ backgroundColor, borderColor });
export const createActionIconStyle = (backgroundColor: string) => ({ backgroundColor });
export const createActionTextStyle = (color: string) => ({ color });
export const createDividerStyle = (borderTopColor: string) => ({ borderTopColor, borderTopWidth: 1 });

export const styles = StyleSheet.create({
  section: { gap: 12 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  list: { borderWidth: 1, borderRadius: Radius.xl, overflow: 'hidden' },
  row: { minHeight: 76, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 46, height: 46, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 2 },
});

