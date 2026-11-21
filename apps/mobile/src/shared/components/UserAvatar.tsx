import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Colors } from "../theme";
import { styles, createViewWidthHeightBackgroundColorStyle, createTextColorFontSizeStyle } from "./styles/UserAvatar.styles";
import { useMessages as useGeneratedUiMessages } from "../../messages/useMessages";
import { formatUiLiteral } from "../localization/formatUiLiteral";
type UserAvatarProps = {
    name: string;
    size?: number;
    backgroundColor?: string;
    textColor?: string;
    style?: StyleProp<ViewStyle>;
};
export function UserAvatar({ name, size = 56, backgroundColor = Colors.primary, textColor = Colors.textOnPrimary, style, }: UserAvatarProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const initials = name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join('');
    return (<View style={[
            styles.avatar,
            createViewWidthHeightBackgroundColorStyle(size, size, backgroundColor),
            style,
        ]} accessibilityLabel={formatUiLiteral(localizedUiText.m_4e26ea0982a1, [name])}>
      <Text style={[styles.initials, createTextColorFontSizeStyle(textColor, Math.max(16, size * 0.34))]}>
        {initials || '?'}
      </Text>
    </View>);
}
export default UserAvatar;

