import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { TextInput, View, type TextInputProps, type ViewStyle, type TextStyle, type TextInputInstance, type TextInputFocusEvent } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useKeyboardFocus } from "../../shared/keyboard/KeyboardFocusContext";
import { FormFieldContainer } from "./FormFieldContainer";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewHeightStyle, createTextInputColorStyle, createViewBorderColorBackgroundColorSpread3Style } from "./styles/AppTextField.styles";

export interface AppTextFieldProps extends Omit<TextInputProps, 'style'> {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export const AppTextField = forwardRef<TextInputInstance, AppTextFieldProps>(function AppTextField({ label, error, helperText, required, containerStyle, inputStyle, multiline, numberOfLines = 1, onFocus, onBlur, ...props }: AppTextFieldProps, forwardedRef) {
    const { colors, shadows } = useAppTheme();
    const focusCoordinator = useKeyboardFocus();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInputInstance>(null);

    useImperativeHandle(forwardedRef, () => inputRef.current as TextInputInstance);

    const handleFocus = (event: TextInputFocusEvent) => {
        setIsFocused(true);
        focusCoordinator.registerFocusedInput(inputRef.current);
        onFocus?.(event);
    };

    const handleBlur = (event: TextInputFocusEvent) => {
        setIsFocused(false);
        focusCoordinator.unregisterFocusedInput(inputRef.current);
        onBlur?.(event);
    };

    const borderColor = error ? colors.danger : isFocused ? colors.primary : colors.border;
    const shadowStyle = isFocused ? (shadows.medium ?? shadows.soft) : shadows.soft;

    return (
        <FormFieldContainer label={label} {...includeWhenPresent("error", error)} {...includeWhenPresent("helperText", helperText)} {...includeWhenPresent("required", required)} {...includeWhenPresent("style", containerStyle)}>
            <View style={[
                styles.inputWrapper,
                createViewBorderColorBackgroundColorSpread3Style(
                    borderColor,
                    props.editable === false ? colors.backgroundSoft : colors.inputBackground,
                    shadowStyle
                ),
                multiline && createViewHeightStyle(Math.max(88, numberOfLines * 24 + 20)),
            ]}>
                <TextInput
                    ref={inputRef}
                    style={[
                        styles.input,
                        createTextInputColorStyle(colors.inputText),
                        multiline && styles.multilineInput,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.inputPlaceholder}
                    cursorColor={colors.primary}
                    selectionColor={colors.primary}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    {...includeWhenPresent("multiline", multiline)}
                    numberOfLines={numberOfLines}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    {...props}
                />
            </View>
        </FormFieldContainer>
    );
});

export default AppTextField;
