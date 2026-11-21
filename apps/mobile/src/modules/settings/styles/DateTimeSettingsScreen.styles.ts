import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import type { ThemeColors } from '../../../shared/theme/useAppTheme';

export interface DateTimeSettingsStyles {
  root: ViewStyle;
  scrollContent: ViewStyle;
  sectionCard: ViewStyle;
  sectionCardWithTopBorder: ViewStyle;
  sectionTitle: TextStyle;
  sectionDescription: TextStyle;
  optionItem: ViewStyle;
  optionContent: ViewStyle;
  optionLabel: TextStyle;
  optionDescription: TextStyle;
  modeContent: ViewStyle;
  customTimezoneButton: ViewStyle;
  customTimezoneValue: TextStyle;
  customTimezoneHint: TextStyle;
  previewCard: ViewStyle;
  previewRow: ViewStyle;
  previewLabel: TextStyle;
  previewValue: TextStyle;
  divider: ViewStyle;
  crossTimezoneNote: TextStyle;
  overlay: ViewStyle;
  radioCircle: ViewStyle;
  radioCircleSelected: ViewStyle;
  radioDot: ViewStyle;
  errorMessage: TextStyle;
}

export function createDateTimeSettingsStyles(colors: ThemeColors): DateTimeSettingsStyles {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 100,
      gap: 16,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionCardWithTopBorder: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: -1,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textPrimary,
      marginBottom: 4,
    },
    sectionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 18,
    },
    optionItem: {
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    optionLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      flex: 1,
    },
    optionDescription: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    modeContent: {
      flex: 1,
      gap: 2,
    },
    customTimezoneButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    customTimezoneValue: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.textPrimary,
      flex: 1,
    },
    customTimezoneHint: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
    },
    previewCard: {
      backgroundColor: colors.surfaceMuted || colors.background,
      borderRadius: 12,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    previewLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    previewValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    crossTimezoneNote: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 17,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioCircleSelected: {
      borderColor: colors.primary,
    },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    errorMessage: {
      fontSize: 13,
      color: colors.danger,
      marginTop: 8,
    },
  });
}
