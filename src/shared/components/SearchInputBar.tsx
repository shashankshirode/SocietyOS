import { useRef, useState } from "react";
import { TextInput, View, type TextInputInstance } from "react-native";
import { AppIcon } from "../icons/AppIcon";
import { Shadows } from "../theme/shadows";
import { useAppTheme } from "../theme/useAppTheme";
import { useKeyboardFocus } from "../keyboard/KeyboardFocusContext";
import { styles, createViewBackgroundColorBorderColorShadowColorStyle, createTextInputColorStyle } from "./styles/SearchInputBar.styles";

type SearchInputBarProps = {
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    testID?: string;
};

export function SearchInputBar({ value, onChangeText, placeholder = 'Search', testID }: SearchInputBarProps) {
    const { colors } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInputInstance>(null);
    const focusCoordinator = useKeyboardFocus();

    const borderColor = isFocused ? colors.primary : colors.border;
    const shadowColor = isFocused ? colors.primary : colors.shadow;

    return (
        <View style={[styles.container, createViewBackgroundColorBorderColorShadowColorStyle(colors.surface, borderColor, shadowColor), Shadows.soft]} testID={testID}>
            <AppIcon name="search" size={19} color={isFocused ? colors.primary : colors.textMuted}/>
            <TextInput
                ref={inputRef}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.inputPlaceholder}
                cursorColor={colors.primary}
                selectionColor={colors.primary}
                onFocus={() => {
                    setIsFocused(true);
                    focusCoordinator.registerFocusedInput(inputRef.current);
                }}
                onBlur={() => {
                    setIsFocused(false);
                    focusCoordinator.unregisterFocusedInput(inputRef.current);
                }}
                style={[styles.input, createTextInputColorStyle(colors.inputText)]}
                accessibilityLabel={placeholder}
            />
        </View>
    );
}

export default SearchInputBar;
