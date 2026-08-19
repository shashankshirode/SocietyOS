import { useState } from "react";
import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useResidentHomeContexts } from "../hooks/useResidentHomeContexts";
import { useActiveResidentHome } from "../hooks/useActiveResidentHome";
import { useMessages } from "../../../../shared/constants/useMessages";
import { ResidentHomeSwitcherSheet } from "./ResidentHomeSwitcherSheet";
import { residentColors } from "../../../../shared/theme/residentColors";
import { styles } from "../styles/components/ResidentHomeSwitcherButton.styles";
export function shouldShowResidentHomeSwitcher(isLoading: boolean, eligibleResidenceCount: number, hasActiveContext: boolean): boolean {
    return !isLoading && eligibleResidenceCount > 1 && hasActiveContext;
}
export function ResidentHomeSwitcherButton({ iconColor = residentColors.onBrandMedium, }: {
    iconColor?: string;
}) {
    const messages = useMessages();
    const { data: contexts = [], isLoading } = useResidentHomeContexts();
    const { activeContext } = useActiveResidentHome();
    const [sheetVisible, setSheetVisible] = useState(false);
    if (!shouldShowResidentHomeSwitcher(isLoading, contexts.length, Boolean(activeContext))) {
        return null;
    }
    return (<>
      <Pressable onPress={() => setSheetVisible(true)} hitSlop={8} style={styles.button} accessibilityRole="button" accessibilityLabel={messages.resident.accessibility.homeContext.openSwitcher}>
        <Ionicons name="swap-horizontal-outline" size={20} color={iconColor}/>
      </Pressable>

      <ResidentHomeSwitcherSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}/>
    </>);
}
export default ResidentHomeSwitcherButton;

