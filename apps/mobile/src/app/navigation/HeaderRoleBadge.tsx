import { Text, View } from "react-native";
import { headerRoleTheme } from "./headerTheme";
import type { HeaderRoleThemeKey } from "./headerTheme";
import { styles, createTextColorStyle } from "./styles/HeaderRoleBadge.styles";
interface HeaderRoleBadgeProps {
    role: HeaderRoleThemeKey;
}
export function HeaderRoleBadge({ role }: HeaderRoleBadgeProps) {
    const roleConfig = headerRoleTheme[role] || { label: role, accent: '#FFFFFF' };
    return (<View style={[styles.badge, styles.viewBackgroundColor]}>
      <Text style={[styles.text, createTextColorStyle(roleConfig.accent)]}>
        {roleConfig.label.toUpperCase()}
      </Text>
    </View>);
}

