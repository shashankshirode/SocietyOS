import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../styles/components/CctvPrivacyNotice.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function CctvPrivacyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Ionicons name="eye-off-outline" size={20} color="#B91C1C" style={styles.icon}/>
      <Text style={styles.text}>{localizedUiText.m_dd077fba78cd}</Text>
    </View>);
}

