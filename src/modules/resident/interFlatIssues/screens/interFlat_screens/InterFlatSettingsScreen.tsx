import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useInterFlatSettings } from "../../data/useInterFlatSettings";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/InterFlatSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function InterFlatSettingsScreen({ navigation }: InterFlatScreenProps<'InterFlatSettings'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data } = useInterFlatSettings();
    const settings = data || {
        issueCategoriesEnabled: [],
        responseDeadlineDays: 5,
        inspectionSlaHours: 48,
        evidenceVisibility: getActiveUiLiteral("m_d4441b767b3b")
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_535d18c12b87}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_4c3e72d40519}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>{localizedUiText.m_5d69ffd9b794}</Text>
        <Text style={styles.value}>{settings.responseDeadlineDays}{" " + localizedUiText.m_e08c0aa8f558}</Text>

        <Text style={styles.label}>{localizedUiText.m_56f08f9b4edc}</Text>
        <Text style={styles.value}>{settings.inspectionSlaHours}{" " + localizedUiText.m_21e8492938ab}</Text>

        <Text style={styles.label}>{localizedUiText.m_14f92cab1b5a}</Text>
        <Text style={styles.value}>{settings.evidenceVisibility}</Text>

        <Text style={styles.label}>{localizedUiText.m_0936e24e2231}</Text>
        <Text style={styles.value}>{localizedUiText.m_e7068ac5242d}</Text>
      </View>

      <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.actionBtnText}>{localizedUiText.m_b8d99df1066e}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

