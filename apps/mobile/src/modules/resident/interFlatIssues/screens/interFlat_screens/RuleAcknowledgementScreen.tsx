import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRuleAcknowledgement } from "../../data/useRuleAcknowledgement";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/RuleAcknowledgementScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function RuleAcknowledgementScreen({ route, navigation }: InterFlatScreenProps<'RuleAcknowledgement'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { ruleId } = route.params;
    const { acknowledge, isSubmitting } = useRuleAcknowledgement(ruleId);
    const [consent, setConsent] = useState(false);
    const handleAcknowledge = async () => {
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_7324eae10d22));
            return;
        }
        await acknowledge();
        AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_98909f43841a), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('RuleLibrary') }
        ]);
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_4f48cb73bf4a}</Text>
      <Text style={styles.subtitle}>{localizedUiText.m_3bdb7c7f5750}</Text>

      <View style={styles.card}>
        <Text style={styles.value}>{localizedUiText.m_3f7cced0f58d}</Text>
      </View>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_b9a54b79fbdf}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleAcknowledge} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_c85b85b6920e : localizedUiText.m_f9236d9e87b6}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

