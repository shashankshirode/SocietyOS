import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/components/AttendancePrivacyNotice.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
export function AttendancePrivacyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Ionicons name="shield-checkmark" size={18} color={Colors.info}/>
      <Text style={styles.text}>{localizedUiText.m_531aa9652575}</Text>
    </View>);
}

