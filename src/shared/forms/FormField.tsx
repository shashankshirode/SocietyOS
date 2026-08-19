import React from "react";
import { KeyboardTypeOptions, Text, TextInput, View, ViewStyle } from "react-native";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorStyle, createTextColorStyle2, createTextInputColorStyle, createTextInputMinHeightStyle, createTextInputColorStyle2, createTextColorStyle3, createTextColorStyle4, createViewBorderColorBackgroundColorShadowColorSpread4Style } from "./styles/FormField.styles";
interface FormFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    helperText?: string;
    keyboardType?: KeyboardTypeOptions;
    multiline?: boolean;
    required?: boolean;
    maxLength?: number;
    editable?: boolean;
    style?: ViewStyle;
    numberOfLines?: number;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    leftIcon?: React.ReactNode;
    rightAction?: React.ReactNode;
}
export function FormField({ label, value, onChangeText, placeholder, error, helperText, keyboardType = 'default', multiline = false, required = false, maxLength, editable = true, style, numberOfLines = 1, secureTextEntry = false, autoCapitalize = 'sentences', leftIcon, rightAction, }: FormFieldProps) {
    const { colors, shadows } = useAppTheme();
    return (<View style={[styles.container, style]}>
      <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>
        {label}
        {required && <Text style={createTextColorStyle(colors.danger)}> *</Text>}
      </Text>
      <View style={[
            styles.inputWrapper,
            createViewBorderColorBackgroundColorShadowColorSpread4Style(error ? colors.danger : colors.border, editable ? colors.inputBackground : colors.backgroundSoft, colors.shadow, shadows.soft),
            multiline && styles.viewHeightAlignItems,
            !editable && styles.wrapperDisabled,
        ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput style={[
            styles.input,
            createTextInputColorStyle(colors.inputText),
            multiline && styles.multilineInput,
            multiline && createTextInputMinHeightStyle(numberOfLines * 22 + Spacing.lg * 2),
            !editable && createTextInputColorStyle2(colors.disabled),
        ]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inputPlaceholder} keyboardType={keyboardType} multiline={multiline} numberOfLines={numberOfLines} textAlignVertical={multiline ? 'top' : 'center'} maxLength={maxLength} editable={editable} secureTextEntry={secureTextEntry} autoCapitalize={autoCapitalize} accessibilityLabel={label}/>
        {rightAction && <View style={styles.rightActionContainer}>{rightAction}</View>}
      </View>
      {error ? <Text style={[styles.error, createTextColorStyle3(colors.danger)]}>{error}</Text> : null}
      {!error && helperText ? <Text style={[styles.helperText, createTextColorStyle4(colors.textMuted)]}>{helperText}</Text> : null}
    </View>);
}
export default FormField;

