import { Text, View } from "react-native";
import { styles } from "../../styles/screens/interFlat_screens/DisputePrivacyNotice.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function DisputePrivacyNotice() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Text style={styles.text}>{localizedUiText.m_3043d0c1d7cd}</Text>
    </View>);
}

