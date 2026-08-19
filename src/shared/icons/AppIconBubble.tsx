import { View } from "react-native";
import { AppIcon } from "./AppIcon";
import { AppIconName } from "./icon.types";
import { useAppTheme } from "../theme/useAppTheme";
import { styles, createViewWidthHeightBorderRadiusBackgroundColorStyle } from "./styles/AppIconBubble.styles";
export interface AppIconBubbleProps {
    name: AppIconName;
    size?: number;
    iconSize?: number;
    color?: string;
    backgroundColor?: string;
    testID?: string;
}
export function AppIconBubble({ name, size = 48, iconSize = 24, color, backgroundColor, testID, }: AppIconBubbleProps) {
    const { colors } = useAppTheme();
    const finalColor = color || colors.primary;
    const finalBgColor = backgroundColor || colors.primarySoft;
    return (<View testID={testID} style={[
            styles.bubble,
            createViewWidthHeightBorderRadiusBackgroundColorStyle(size, size, size / 2, finalBgColor),
        ]}>
      <AppIcon name={name} size={iconSize} color={finalColor}/>
    </View>);
}
export default AppIconBubble;

