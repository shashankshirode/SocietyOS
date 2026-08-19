import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useNeighbourNotificationPreview } from "../../data/useNeighbourNotificationPreview";
import { interFlatRepository } from "../../data/interFlat.repository";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/NeighbourNotificationPreviewScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function NeighbourNotificationPreviewScreen({ route, navigation }: InterFlatScreenProps<'NeighbourNotificationPreview'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { data } = useNeighbourNotificationPreview(issueId);
    const issue = data;
    const handleSend = async () => {
        await interFlatRepository.notifyInvolvedFlat(issueId, {});
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_97cbded9c1c3), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
        ]);
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_c9d628855f8f}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_b5a5ec8e719b}</Text>

      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>{localizedUiText.m_8e26b3e62d32}</Text>
        <Text style={styles.previewText}>
          {formatUiLiteral(localizedUiText.m_592268ba64ca, [issue?.issueNumber])}
        </Text>
        <Text style={styles.previewLabel}>{localizedUiText.m_f13d1b7dac25 + " "}{issue?.issueType?.replace(/_/g, ' ')}</Text>
        <Text style={styles.previewLabel}>{localizedUiText.m_bbdffe25dc7d + " "}{issue?.location}</Text>
      </View>

      <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
        <Text style={styles.sendBtnText}>{localizedUiText.m_1275a7fe5eba}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

