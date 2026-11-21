import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type TextInputInstance, KeyboardTypeOptions, Text, TextInput, View, ViewStyle, type TextInputProps, type TextInputFocusEvent } from "react-native";
import { Spacing } from "../theme/spacing";
import { useAppTheme } from "../theme/useAppTheme";
import { useKeyboardFocus } from "../keyboard/KeyboardFocusContext";
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

export const FormField = forwardRef<TextInputInstance, FormFieldProps>(function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    helperText,
    keyboardType = 'default',
    multiline = false,
    required = false,
    maxLength,
    editable = true,
    style,
    numberOfLines = 1,
    secureTextEntry = false,
    autoCapitalize = 'sentences',
    leftIcon,
    rightAction,
    returnKeyType,
    blurOnSubmit,
    onSubmitEditing,
    onFocus,
    onBlur,
    testID,
}: FormFieldProps, forwardedRef) {
    const { colors, shadows } = useAppTheme();
    const inputRef = useRef<TextInputInstance>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const ensureVisible = useKeyboardAwareField(inputRef);
    const focusCoordinator = useKeyboardFocus();

    useImperativeHandle(forwardedRef, () => inputRef.current as TextInputInstance);

    const minimumHeight = numberOfLines * 22 + Spacing.lg * 2;
    const multilineHeight = Math.min(Math.max(minimumHeight, contentHeight), 176);

    const handleFocus = (event: TextInputFocusEvent) => {
        setIsFocused(true);
        ensureVisible();
        focusCoordinator.registerFocusedInput(inputRef.current);
        onFocus?.(event);
    };

    const handleBlur = (event: TextInputFocusEvent) => {
        setIsFocused(false);
        focusCoordinator.unregisterFocusedInput(inputRef.current);
        onBlur?.(event);
    };

    const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;
    const shadowColor = isFocused ? colors.primary : colors.shadow;
    const shadowStyle = isFocused ? (shadows.medium ?? shadows.soft) : shadows.soft;

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.label, createTextColorStyle2(colors.textSecondary)]}>
                {label}
                {required && <Text style={createTextColorStyle(colors.danger)}> *</Text>}
            </Text>
            <View style={[
                styles.inputWrapper,
                createViewBorderColorBackgroundColorShadowColorSpread4Style(
                    borderColor,
                    editable ? colors.inputBackground : colors.backgroundSoft,
                    shadowColor,
                    shadowStyle
                ),
                multiline && styles.viewHeightAlignItems,
                !editable && styles.wrapperDisabled,
            ]}>
                {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
                <TextInput
                    ref={inputRef}
                    testID={testID}
                    style={[
                        styles.input,
                        createTextInputColorStyle(colors.inputText),
                        multiline && styles.multilineInput,
                        multiline && createTextInputMinHeightStyle(multilineHeight),
                        !editable && createTextInputColorStyle2(colors.disabled),
                    ]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={colors.inputPlaceholder}
                    cursorColor={colors.primary}
                    selectionColor={colors.primary}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    maxLength={maxLength}
                    editable={editable}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    accessibilityLabel={label}
                    accessibilityState={{ disabled: !editable }}
                    accessibilityHint={error || helperText}
                    returnKeyType={returnKeyType ?? (multiline ? 'default' : 'done')}
                    blurOnSubmit={blurOnSubmit ?? !multiline}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onContentSizeChange={multiline ? (event) => {
                        setContentHeight(event.nativeEvent.contentSize.height + Spacing.lg * 2);
                        ensureVisible();
                        focusCoordinator.ensureVisible(inputRef.current);
                    } : undefined}
                />
                {rightAction && <View style={styles.rightActionContainer}>{rightAction}</View>}
            </View>
            {error ? <Text style={[styles.error, createTextColorStyle3(colors.danger)]}>{error}</Text> : null}
            {!error && helperText ? <Text style={[styles.helperText, createTextColorStyle4(colors.textMuted)]}>{helperText}</Text> : null}
        </View>
    );
});

export default FormField;
