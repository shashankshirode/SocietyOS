import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { styles } from "../../styles/screens/interFlat_screens/EvidenceAttachmentPlaceholderScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function EvidenceAttachmentPlaceholderScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_d5de9865e07b}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_40825c6f4df2}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{localizedUiText.m_38dd3e0f820e}</Text>
        <Text style={styles.bullet}>{localizedUiText.m_699608fc8680}</Text>
        <Text style={styles.bullet}>{localizedUiText.m_e9219d5cc4db}</Text>
        <Text style={styles.bullet}>{localizedUiText.m_71aec40f142f}</Text>
        <Text style={styles.bullet}>{localizedUiText.m_352bf7510bf5}</Text>
      </View>

      <Text style={styles.privacyNote}>{localizedUiText.m_32a3b7983036}</Text>

      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.actionBtnText}>{localizedUiText.m_b8d99df1066e}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

