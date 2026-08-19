import React from "react";
import { View, type ViewStyle } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4 } from "./styles/FormFieldContainer.styles";
export interface FormFieldContainerProps {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    style?: ViewStyle;
    children: React.ReactNode;
}
export function FormFieldContainer({ label, error, helperText, required = false, style, children, }: FormFieldContainerProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, style]}>
      <SafeText variant="bodyStrong" style={[styles.label, createSafeTextColorStyle2(colors.textSecondary)]}>
        {label}
        {required && <SafeText style={createSafeTextColorStyle(colors.danger)}> *</SafeText>}
      </SafeText>
      
      {children}

      {error ? (<SafeText variant="tiny" style={[styles.error, createSafeTextColorStyle3(colors.danger)]}>
          {error}
        </SafeText>) : helperText ? (<SafeText variant="caption" style={[styles.helperText, createSafeTextColorStyle4(colors.textMuted)]}>
          {helperText}
        </SafeText>) : null}
    </View>);
}
export default FormFieldContainer;

