import { Text, View } from "react-native";
import { styles } from "../../styles/screens/interFlat_screens/CalmCommunicationBanner.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function CalmCommunicationBanner() {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<View style={styles.container}>
      <Text style={styles.title}>{localizedUiText.m_0a543f3a6945}</Text>
      <Text style={styles.text}>{localizedUiText.m_8df57c38f18e}</Text>
    </View>);
}

