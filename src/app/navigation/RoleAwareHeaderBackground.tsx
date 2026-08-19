import { View } from "react-native";
import { headerRoleTheme } from "./headerTheme";
import type { HeaderRoleThemeKey } from "./headerTheme";
import { styles, createViewBackgroundColorStyle, createViewBackgroundColorStyle2 } from "./styles/RoleAwareHeaderBackground.styles";
interface RoleAwareHeaderBackgroundProps {
    role: HeaderRoleThemeKey;
}
export function RoleAwareHeaderBackground({ role }: RoleAwareHeaderBackgroundProps) {
    const roleConfig = headerRoleTheme[role] || { background: ['#172554', '#4F46E5'] };
    return (<View style={[
            styles.background,
            createViewBackgroundColorStyle2(roleConfig.background[0]),
        ]}>
      <View style={[
            styles.accentCircle,
            createViewBackgroundColorStyle(roleConfig.background[1] || 'rgba(255, 255, 255, 0.15)'),
        ]}/>
    </View>);
}

