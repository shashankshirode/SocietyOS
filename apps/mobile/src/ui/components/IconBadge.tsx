import { View, ViewStyle, StyleProp } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { useAppTheme } from "../../shared/theme/useAppTheme";
import { styles, createViewWidthHeightBorderRadiusBackgroundColorStyle } from "./styles/IconBadge.styles";
type IoniconsName = ComponentProps<typeof Ionicons>['name'];
export interface IconBadgeProps {
    icon: IoniconsName;
    size?: number;
    iconSize?: number;
    color?: string;
    backgroundColor?: string;
    style?: StyleProp<ViewStyle>;
    testID?: string;
}
export function IconBadge({ icon, size = 40, iconSize, color, backgroundColor, style, testID, }: IconBadgeProps) {
    const { colors } = useAppTheme();
    const resolvedIconSize = iconSize ?? Math.round(size * 0.5);
    const resolvedColor = color ?? colors.primary;
    const resolvedBg = backgroundColor ?? colors.primarySoft;
    return (<View style={[
            styles.badge,
            createViewWidthHeightBorderRadiusBackgroundColorStyle(size, size, size * 0.3, resolvedBg),
            style,
        ]} testID={testID}>
      <Ionicons name={icon} size={resolvedIconSize} color={resolvedColor}/>
    </View>);
}

