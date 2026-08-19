import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoleAwareHeaderBackground } from "./RoleAwareHeaderBackground";
import { BackNavigationButton } from "./BackNavigationButton";
import { HeaderTitleBlock } from "./HeaderTitleBlock";
import { HeaderRoleBadge } from "./HeaderRoleBadge";
import type { HeaderRoleThemeKey } from "./headerTheme";
import { includeWhenPresent } from "../../shared/utils/presentProperty";
import { styles, createViewPaddingTopStyle } from "./styles/RoleAwareAppHeader.styles";
interface RoleAwareAppHeaderProps {
    role: HeaderRoleThemeKey;
    title: string;
    subtitle?: string;
    onBack?: () => void;
    showBack?: boolean;
}
export function RoleAwareAppHeader({ role, title, subtitle, onBack, showBack = false, }: RoleAwareAppHeaderProps) {
    const insets = useSafeAreaInsets();
    return (<View style={[styles.headerContainer, createViewPaddingTopStyle(insets.top)]}>
      <RoleAwareHeaderBackground role={role}/>
      
      <View style={styles.contentRow}>
        {showBack && onBack ? (<View style={styles.leftAction}>
            <BackNavigationButton onPress={onBack}/>
          </View>) : null}
        
        <View style={styles.titleContainer}>
          <HeaderTitleBlock title={title} {...includeWhenPresent("subtitle", subtitle)}/>
        </View>

        <View style={styles.rightAction}>
          <HeaderRoleBadge role={role}/>
        </View>
      </View>
    </View>);
}

