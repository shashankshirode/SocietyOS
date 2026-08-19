import { forwardRef, useState } from "react";
import { TextInput, type NativeSyntheticEvent, type TextInputContentSizeChangeEventData, type TextInputProps } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { APP_TEXT_AREA_MAXIMUM_HEIGHT, APP_TEXT_AREA_MINIMUM_HEIGHT, styles, createTextInputHeightBackgroundColorBorderColorColorShadowColorSpread6Style } from './styles/AppTextArea.styles';
export type AppTextAreaProps = Omit<TextInputProps, 'multiline' | 'style' | 'value' | 'onChangeText' | 'scrollEnabled' | 'textAlignVertical'> & {
    value: string;
    onChangeText: (value: string) => void;
    hasError?: boolean;
};
export const AppTextArea = forwardRef<TextInput, AppTextAreaProps>(function AppTextArea({ value, onChangeText, hasError = false, editable = true, onContentSizeChange, ...props }, ref) {
    const { colors, shadows } = useAppTheme();
    const [contentHeight, setContentHeight] = useState(APP_TEXT_AREA_MINIMUM_HEIGHT);
    const resolvedHeight = Math.min(APP_TEXT_AREA_MAXIMUM_HEIGHT, Math.max(APP_TEXT_AREA_MINIMUM_HEIGHT, contentHeight));
    const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>): void => {
        const newHeight = event.nativeEvent.contentSize.height;
        setContentHeight((prev) => {
            if (Math.abs(prev - newHeight) > 2) {
                return newHeight;
            }
            return prev;
        });
        onContentSizeChange?.(event);
    };
    return (<TextInput ref={ref} value={value} onChangeText={onChangeText} editable={editable} placeholderTextColor={colors.inputPlaceholder} multiline textAlignVertical="top" scrollEnabled={resolvedHeight >= APP_TEXT_AREA_MAXIMUM_HEIGHT} onContentSizeChange={handleContentSizeChange} style={[
            styles.input,
            createTextInputHeightBackgroundColorBorderColorColorShadowColorSpread6Style(resolvedHeight, editable ? colors.inputBackground : colors.backgroundSoft, hasError ? colors.danger : colors.border, editable ? colors.inputText : colors.disabled, colors.shadow, shadows.soft),
        ]} {...props}/>);
});
export default AppTextArea;

