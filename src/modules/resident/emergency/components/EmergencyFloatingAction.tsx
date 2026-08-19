import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigationState } from "@react-navigation/native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { useSosCommandDockLayout } from "../hooks/useSosCommandDockLayout";
import { isSosFloatingVisible } from "../data/emergencyFloatingVisibility";
import { shouldHideTabBar } from "../../navigation/residentTabVisibility";
import { SosCommandDock } from "./SosCommandDock";
import { useSosCommandDockState } from "../hooks/useSosCommandDockState";
import { useResidentEmergencyActions } from "../hooks/useResidentEmergencyActions";
import { styles, createViewBottomRightStyle, createPressableBackgroundColorShadowColorStyle } from "../styles/components/EmergencyFloatingAction.styles";
export function EmergencyFloatingAction() {
    const { colors } = useAppTheme();
    const messages = useMessages();
    const activeRouteName = useNavigationState((state) => {
        try {
            return getDeepActiveRouteName(state);
        }
        catch {
            return null;
        }
    });
    const isTabBarHidden = activeRouteName ? shouldHideTabBar(activeRouteName) : false;
    const { bottomOffset, rightOffset } = useSosCommandDockLayout({ isTabBarHidden });
    const dockState = useSosCommandDockState();
    const { triggerAction } = useResidentEmergencyActions(dockState.setState);
    const shouldShow = activeRouteName ? isSosFloatingVisible(activeRouteName) : true;
    if (!shouldShow) {
        return null;
    }
    return (<View style={[styles.container, createViewBottomRightStyle(bottomOffset, rightOffset)]}>
      <Pressable style={[styles.floatingButton, createPressableBackgroundColorShadowColorStyle(colors.danger, colors.shadow)]} onPress={() => dockState.openDock()} accessibilityRole="button" accessibilityLabel={t(messages, 'resident.emergency.sos.open')} accessibilityState={{ expanded: dockState.isOpen }}>
        <Ionicons name="alert-circle" size={28} color={colors.textInverse}/>
      </Pressable>

      <SosCommandDock dockState={dockState} triggerAction={triggerAction}/>
    </View>);
}
export default EmergencyFloatingAction;

