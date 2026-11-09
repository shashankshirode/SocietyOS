import { forwardRef } from "react";
import { type TextInputInstance, TextInput, type TextInputProps } from "react-native";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createTextInputBackgroundColorBorderColorColorShadowColorSpread5Style } from "./styles/AppTextInput.styles";
export type AppTextInputProps = Omit<TextInputProps, 'multiline' | 'style' | 'value' | 'onChangeText'> & {
    value: string;
    onChangeText: (value: string) => void;
    hasError?: boolean;
};
export const AppTextInput = forwardRef<TextInputInstance, AppTextInputProps>(function AppTextInput({ value, onChangeText, hasError = false, editable = true, ...props }, ref) {
    const { colors, shadows } = useAppTheme();
    return (<TextInput ref={ref} value={value} onChangeText={onChangeText} editable={editable} placeholderTextColor={colors.inputPlaceholder} accessibilityState={{ disabled: !editable }} maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? 1.5} style={[
            styles.input,
            createTextInputBackgroundColorBorderColorColorShadowColorSpread5Style(editable ? colors.inputBackground : colors.backgroundSoft, hasError ? colors.danger : colors.border, editable ? colors.inputText : colors.disabled, colors.shadow, shadows.soft),
        ]} {...props}/>);
});
export default AppTextInput;

