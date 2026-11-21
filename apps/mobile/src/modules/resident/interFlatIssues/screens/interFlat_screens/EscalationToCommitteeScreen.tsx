import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useEscalationToCommittee } from "../../data/useEscalationToCommittee";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { styles } from "../../styles/screens/interFlat_screens/EscalationToCommitteeScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
export function EscalationToCommitteeScreen({ route, navigation }: InterFlatScreenProps<'EscalationToCommittee'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { escalate, isSubmitting } = useEscalationToCommittee(issueId);
    const [reason, setReason] = useState('');
    const [action, setAction] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!reason || !action) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_ffc90403bd3c));
            return;
        }
        await escalate({ reason, action });
        AppAlert.alert(String(localizedUiText.m_b710aaaaa7ba), String(localizedUiText.m_a681177ca9cb), [
            { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
        ]);
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_2b8fe6959813}</Text>
      <Text style={styles.infoNote}>{localizedUiText.m_212f8f5ef668}</Text>

      <Text style={styles.label}>{localizedUiText.m_f5511fc6d9a9}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_a87af30864d2} multiline value={reason} onChangeText={setReason}/>

      <Text style={styles.label}>{localizedUiText.m_ef17fc7b8f1d}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_af2a782e0c84} value={action} onChangeText={setAction}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_42ed0fd804d2}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_8d3ca7fe7716 : localizedUiText.m_29dfbbf70444}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

