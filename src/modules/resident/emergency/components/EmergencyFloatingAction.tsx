import { Pressable, View } from "react-native";
import { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigationState } from "@react-navigation/native";
import { useAppTheme } from "../../../../shared/theme/useAppTheme";
import { useMessages } from "../../../../shared/constants/useMessages";
import { t } from "../../household/components/householdComponentUtils";
import { useSosCommandDockLayout } from "../hooks/useSosCommandDockLayout";
import { isSosFloatingVisible } from "../data/emergencyFloatingVisibility";
import { shouldHideTabBar } from "../../navigation/residentTabVisibility";
import { getDeepActiveRouteName } from "../../navigation/useResidentTabVisibility";
import { useKeyboardExperience } from '../../experience/KeyboardExperienceContext';
import { EmergencyExperience } from './EmergencyExperience';
import { useSocietyExperience } from '../../experience/SocietyExperienceContext';
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
    const [localCrisisModeVisible, setLocalCrisisModeVisible] = useState(false);
    const experience = useSocietyExperience();
    const crisisModeVisible = experience.providerMounted
        ? experience.crisisModeVisible
        : localCrisisModeVisible;
    const openCrisisMode = experience.providerMounted
        ? experience.openCrisisMode
        : () => setLocalCrisisModeVisible(true);
    const closeCrisisMode = experience.providerMounted
        ? experience.closeCrisisMode
        : () => setLocalCrisisModeVisible(false);
    const keyboard = useKeyboardExperience();
    const shouldShow = activeRouteName ? isSosFloatingVisible(activeRouteName) : true;
    if ((!shouldShow || keyboard.isOpen) && !crisisModeVisible) {
        return null;
    }
    return (<>
      {!crisisModeVisible ? <View style={[styles.container, createViewBottomRightStyle(bottomOffset, rightOffset)]}>
      <Pressable style={[styles.floatingButton, createPressableBackgroundColorShadowColorStyle(colors.danger, colors.shadow)]} onPress={openCrisisMode} accessibilityRole="button" accessibilityLabel={t(messages, 'resident.emergency.sos.open')} accessibilityState={{ expanded: crisisModeVisible }}>
        <Ionicons name="alert-circle" size={28} color={colors.textInverse}/>
      </Pressable>
      </View> : null}
      {!experience.providerMounted ? <EmergencyExperience visible={crisisModeVisible} onClose={closeCrisisMode}/> : null}
    </>);
}
export default EmergencyFloatingAction;
