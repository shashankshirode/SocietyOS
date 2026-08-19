import { Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMessages } from "../../../shared/constants/useMessages";
import { resolveResidentMessage, type MessageTree } from "./ResidentHeaderTitle";
import type { MessageKey } from "./residentHeader.types";
import { styles } from "./styles/ResidentBackButton.styles";
export type ResidentBackButtonProps = {
    onPress: () => void;
    tintColor: string;
    accessibilityLabelKey?: MessageKey;
};
export function ResidentBackButton({ onPress, tintColor, accessibilityLabelKey = 'accessibility.navigation.goBack', }: ResidentBackButtonProps) {
    const messages = useMessages();
    const accessibilityLabel = resolveResidentMessage(messages as MessageTree, accessibilityLabelKey);
    return (<Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} hitSlop={12} onPress={onPress} style={styles.button}>
      <Ionicons name="chevron-back" size={24} color={tintColor}/>
    </Pressable>);
}

