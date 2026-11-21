import React from "react";
import { View } from "react-native";
import { SafeText } from "../../shared/components/SafeText";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createSafeTextColorStyle, createSafeTextColorStyle2, createSafeTextColorStyle3, createSafeTextColorStyle4 } from "./styles/FormField.styles";
export type FormFieldProps = {
    label: string;
    required?: boolean;
    helperText?: string;
    errorText?: string;
    characterCountText?: string;
    children: React.ReactNode;
    testID?: string;
};
export function FormField({ label, required = false, helperText, errorText, characterCountText, children, testID, }: FormFieldProps) {
    const { colors } = useAppTheme();
    const messageToShow = errorText ?? helperText;
    const messageTestID = testID ? `${testID}-${errorText ? 'error' : 'helper'}` : undefined;
    const characterCountTestID = testID ? `${testID}-character-count` : undefined;
    return (<View testID={testID} style={styles.container}>
      <View style={styles.labelRow}>
        <SafeText variant="bodyStrong" style={[styles.label, createSafeTextColorStyle(colors.textSecondary)]}>
          {label}
        </SafeText>
        {required ? (<SafeText variant="bodyStrong" style={[styles.required, createSafeTextColorStyle2(colors.danger)]}>
            *
          </SafeText>) : null}
      </View>

      <View style={styles.control}>
        {children}
      </View>

      {messageToShow ? (<SafeText testID={messageTestID} variant={errorText ? 'tiny' : 'caption'} style={[styles.message, createSafeTextColorStyle3(errorText ? colors.danger : colors.textMuted)]}>
          {messageToShow}
        </SafeText>) : null}

      {characterCountText ? (<SafeText testID={characterCountTestID} variant="tiny" style={[styles.characterCount, createSafeTextColorStyle4(colors.textMuted)]}>
          {characterCountText}
        </SafeText>) : null}
    </View>);
}
export default FormField;

