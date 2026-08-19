import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/components/SuperAdminWarningBanner.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
interface SuperAdminWarningBannerProps {
    message?: string;
}
export function SuperAdminWarningBanner({ message }: SuperAdminWarningBannerProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    void localizedUiText;
    const defaultMsg = getActiveUiLiteral("m_412a1282e9d7");
    return (<View style={styles.container}>
      <Ionicons name="warning-outline" size={20} color={Colors.warning}/>
      <Text style={styles.text}>{message || defaultMsg}</Text>
    </View>);
}

