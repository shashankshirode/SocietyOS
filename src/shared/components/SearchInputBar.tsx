import { TextInput, View } from "react-native";
import { AppIcon } from "../icons/AppIcon";
import { Shadows } from "../theme/shadows";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewBackgroundColorBorderColorShadowColorStyle, createTextInputColorStyle } from "./styles/SearchInputBar.styles";
type SearchInputBarProps = {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
};
export function SearchInputBar({ value, onChangeText, placeholder = 'Search' }: SearchInputBarProps) {
    const { colors } = useAppTheme();
    return (<View style={[styles.container, createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, colors.border, colors.shadow), Shadows.soft]}>
      <AppIcon name="search" size={19} color={colors.textMuted}/>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.inputPlaceholder} style={[styles.input, createTextInputColorStyle(colors.inputText)]} accessibilityLabel={placeholder}/>
    </View>);
}

