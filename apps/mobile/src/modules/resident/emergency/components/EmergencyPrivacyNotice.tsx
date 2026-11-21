import { Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../../shared/theme";
import { styles } from "../styles/components/EmergencyPrivacyNotice.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../messages/useMessages";
interface Props {
    style?: ViewStyle;
}
export function EmergencyPrivacyNotice({ style }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={[styles.container, style]}>
      <Ionicons name="shield-checkmark" size={18} color={Colors.info}/>
      <Text style={styles.text}>{localizedUiText.m_ec47b5611dd1}</Text>
    </View>);
}

