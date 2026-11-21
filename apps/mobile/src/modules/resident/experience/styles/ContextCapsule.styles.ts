import { StyleSheet } from 'react-native';
import { Radius, Spacing, Typography } from '../../../../shared/theme';

export const styles = StyleSheet.create({
  capsule: {
    alignSelf: 'flex-start',
    maxWidth: '88%',
    minHeight: 44,
    borderRadius: Radius.pill,
  },
  pressable: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  label: {
    ...Typography.tiny,
    flexShrink: 1,
    textTransform: 'uppercase',
    letterSpacing: 0.55,
  },
});

export const createBackgroundStyle = (backgroundColor: string) => ({ backgroundColor });
export const createColorStyle = (color: string) => ({ color });
