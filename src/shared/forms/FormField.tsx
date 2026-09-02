import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { KeyboardTypeOptions, Text, TextInput, View, ViewStyle, type TextInputProps } from "react-native";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createTextColorStyle, createTextColorStyle2, createTextInputColorStyle, createTextInputMinHeightStyle, createTextInputColorStyle2, createTextColorStyle3, createTextColorStyle4, createViewBorderColorBackgroundColorShadowColorSpread4Style } from "./styles/FormField.styles";
import { useKeyboardAwareField } from './KeyboardAwareForm';
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
    returnKeyType?: TextInputProps['returnKeyType'];
    blurOnSubmit?: boolean;
    onSubmitEditing?: TextInputProps['onSubmitEditing'];
    onFocus?: TextInputProps['onFocus'];
    onBlur?: TextInputProps['onBlur'];
    testID?: string;
}
export const FormField = forwardRef<TextInput, FormFieldProps>(function FormField({ label, value, onChangeText, placeholder, error, helperText, keyboardType = 'default', multiline = false, required = false, maxLength, editable = true, style, numberOfLines = 1, secureTextEntry = false, autoCapitalize = 'sentences', leftIcon, rightAction, returnKeyType, blurOnSubmit, onSubmitEditing, onFocus, onBlur, testID }: FormFieldProps, forwardedRef) {
    const { colors, shadows } = useAppTheme();
    const inputRef = useRef<TextInput>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const ensureVisible = useKeyboardAwareField(inputRef);
    useImperativeHandle(forwardedRef, () => inputRef.current as TextInput);
    const minimumHeight = numberOfLines * 22 + Spacing.lg * 2;
    const multilineHeight = Math.min(Math.max(minimumHeight, contentHeight), 176);
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
        <TextInput ref={inputRef} testID={testID} style={[
            styles.input,
            createTextInputColorStyle(colors.inputText),
            multiline && styles.multilineInput,
            multiline && createTextInputMinHeightStyle(multilineHeight),
            !editable && createTextInputColorStyle2(colors.disabled),
        ]} value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inputPlaceholder} keyboardType={keyboardType} multiline={multiline} numberOfLines={numberOfLines} textAlignVertical={multiline ? 'top' : 'center'} maxLength={maxLength} editable={editable} secureTextEntry={secureTextEntry} autoCapitalize={autoCapitalize} accessibilityLabel={label} accessibilityState={{ disabled: !editable }} accessibilityHint={error || helperText} returnKeyType={returnKeyType ?? (multiline ? 'default' : 'done')} blurOnSubmit={blurOnSubmit ?? !multiline} onSubmitEditing={onSubmitEditing} onFocus={(event) => { ensureVisible(); onFocus?.(event); }} onBlur={onBlur} onContentSizeChange={multiline ? (event) => { setContentHeight(event.nativeEvent.contentSize.height + Spacing.lg * 2); ensureVisible(); } : undefined}/>
        {rightAction && <View style={styles.rightActionContainer}>{rightAction}</View>}
      </View>
      {error ? <Text style={[styles.error, createTextColorStyle3(colors.danger)]}>{error}</Text> : null}
      {!error && helperText ? <Text style={[styles.helperText, createTextColorStyle4(colors.textMuted)]}>{helperText}</Text> : null}
    </View>);
});
export default FormField;
