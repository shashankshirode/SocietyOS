import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type TextInputInstance, TextInput, type TextInputProps, type TextInputFocusEvent } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useKeyboardFocus } from "../../shared/keyboard/KeyboardFocusContext";
import { styles, createTextInputBackgroundColorBorderColorColorShadowColorSpread5Style } from "./styles/AppTextInput.styles";

export type AppTextInputProps = Omit<TextInputProps, 'multiline' | 'style' | 'value' | 'onChangeText'> & {
    value: string;
    onChangeText: (value: string) => void;
    hasError?: boolean;
};

export const AppTextInput = forwardRef<TextInputInstance, AppTextInputProps>(function AppTextInput({ value, onChangeText, hasError = false, editable = true, onFocus, onBlur, ...props }, forwardedRef) {
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

    const borderColor = hasError ? colors.danger : isFocused ? colors.primary : colors.border;
    const shadowStyle = isFocused ? (shadows.medium ?? shadows.soft) : shadows.soft;

    return (
        <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            placeholderTextColor={colors.inputPlaceholder}
            cursorColor={colors.primary}
            selectionColor={colors.primary}
            onFocus={handleFocus}
            onBlur={handleBlur}
            accessibilityState={{ disabled: !editable }}
            maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? 1.5}
            style={[
                styles.input,
                createTextInputBackgroundColorBorderColorColorShadowColorSpread5Style(
                    editable ? colors.inputBackground : colors.backgroundSoft,
                    borderColor,
                    editable ? colors.inputText : colors.disabled,
                    isFocused ? colors.primary : colors.shadow,
                    shadowStyle
                ),
            ]}
            {...props}
        />
    );
});

export default AppTextInput;
