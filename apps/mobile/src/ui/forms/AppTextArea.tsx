import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { type TextInputInstance, TextInput, type TextInputContentSizeChangeEvent, type TextInputProps, type TextInputFocusEvent } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { useKeyboardFocus } from "../../shared/keyboard/KeyboardFocusContext";
import { APP_TEXT_AREA_MAXIMUM_HEIGHT, APP_TEXT_AREA_MINIMUM_HEIGHT, styles, createTextInputHeightBackgroundColorBorderColorColorShadowColorSpread6Style } from './styles/AppTextArea.styles';

export type AppTextAreaProps = Omit<TextInputProps, 'multiline' | 'style' | 'value' | 'onChangeText' | 'scrollEnabled' | 'textAlignVertical'> & {
    value: string;
    onChangeText: (value: string) => void;
    hasError?: boolean;
};

export const AppTextArea = forwardRef<TextInputInstance, AppTextAreaProps>(function AppTextArea({ value, onChangeText, hasError = false, editable = true, onContentSizeChange, onFocus, onBlur, ...props }, forwardedRef) {
    const { colors, shadows } = useAppTheme();
    const focusCoordinator = useKeyboardFocus();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInputInstance>(null);
    const [contentHeight, setContentHeight] = useState(APP_TEXT_AREA_MINIMUM_HEIGHT);

    useImperativeHandle(forwardedRef, () => inputRef.current as TextInputInstance);

    const resolvedHeight = Math.min(APP_TEXT_AREA_MAXIMUM_HEIGHT, Math.max(APP_TEXT_AREA_MINIMUM_HEIGHT, contentHeight));

    const handleContentSizeChange = (event: TextInputContentSizeChangeEvent): void => {
        const newHeight = event.nativeEvent.contentSize.height;
        setContentHeight((prev) => {
            if (Math.abs(prev - newHeight) > 2) {
                return newHeight;
            }
            return prev;
        });
        focusCoordinator.ensureVisible(inputRef.current);
        onContentSizeChange?.(event);
    };

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
            multiline
            textAlignVertical="top"
            scrollEnabled={resolvedHeight >= APP_TEXT_AREA_MAXIMUM_HEIGHT}
            onContentSizeChange={handleContentSizeChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={[
                styles.input,
                createTextInputHeightBackgroundColorBorderColorColorShadowColorSpread6Style(
                    resolvedHeight,
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

export default AppTextArea;
