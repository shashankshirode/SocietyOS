import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import type { ThemeColors, Theme } from '../../../shared/theme/tokens';

interface DateTimeSettingsStyles {
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
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  modalSearch: ViewStyle;
  searchIcon: ViewStyle;
  searchInput: ViewStyle;
  searchInputText: TextStyle;
  resultsList: ViewStyle;
  resultItem: ViewStyle;
  resultLabel: TextStyle;
  resultId: TextStyle;
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
      color: '#111827',
      flex: 1,
    },
    customTimezoneHint: {
      fontSize: 12,
      color: '#6B7280',
      marginTop: 8,
    },
    previewCard: {
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      padding: 16,
      gap: 12,
    },
    previewRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    previewLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#6B7280',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    previewValue: {
      fontSize: 15,
      fontWeight: '600',
      color: '#111827',
    },
    divider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: 8,
    },
    crossTimezoneNote: {
      fontSize: 12,
      color: '#6B7280',
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 8,
      maxHeight: '85%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#111827',
    },
    modalSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    searchIcon: {
      marginLeft: 4,
    },
    searchInput: {
      flex: 1,
      backgroundColor: '#F3F4F6',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 15,
      color: '#111827',
    },
    searchInputText: {
      fontSize: 15,
      color: '#111827',
    },
    resultsList: {
      paddingHorizontal: 16,
      paddingBottom: 24,
      gap: 8,
    },
    resultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: '#F9FAFB',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    resultLabel: {
      fontSize: 15,
      fontWeight: '500',
      color: '#111827',
      flex: 1,
    },
    resultId: {
      fontSize: 12,
      color: '#9CA3AF',
      marginLeft: 12,
      fontFamily: 'monospace',
    },
  });
}
