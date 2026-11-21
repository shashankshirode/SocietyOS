import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { styles } from "../styles/components/HardwareWarningBanner.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function HardwareWarningBanner() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Ionicons name="warning-outline" size={20} color="#B45309" style={styles.icon}/>
      <Text style={styles.text}>{localizedUiText.m_be76c09d4b79}</Text>
    </View>);
}

