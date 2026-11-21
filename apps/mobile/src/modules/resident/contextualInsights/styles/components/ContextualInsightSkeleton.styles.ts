import { StyleSheet } from 'react-native';
import { Radius } from '../../../../../shared/theme/radius';

export const styles = StyleSheet.create({
  container: {
    height: 44,
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 12,
    gap: 12,
  },
});
