import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useResolutionProposal } from "../../data/useResolutionProposal";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import type { ResolutionAcceptanceScope } from "../../../../../shared/types/disputeMediation.types";
import { VisualDateTimePicker } from "../../../../../ui/patterns/VisualDateTimePicker";
import { styles } from "../../styles/screens/interFlat_screens/ResolutionProposalScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
const acceptanceScopeOptions: readonly {
    key: ResolutionAcceptanceScope;
    label: string;
}[] = [
    { key: 'REPORTER_ONLY', get label() {
            return getActiveUiLiteral("m_223b74e1cdff");
        } },
    { key: 'INVOLVED_FLAT_ONLY', get label() {
            return getActiveUiLiteral("m_d6119c20c3f4");
        } },
    { key: 'BOTH_PARTIES', get label() {
            return getActiveUiLiteral("m_cfa5c668a6e2");
        } },
    { key: 'COMMITTEE_ONLY', get label() {
            return getActiveUiLiteral("m_c157704c4882");
        } },
];
export function ResolutionProposalScreen({ route, navigation }: InterFlatScreenProps<'ResolutionProposal'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { mediationId } = route.params;
    const { createProposal, isSubmitting } = useResolutionProposal(mediationId);
    const [proposedResolution, setProposedResolution] = useState('');
    const [responsibleParty, setResponsibleParty] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [acceptanceScope, setAcceptanceScope] = useState<ResolutionAcceptanceScope>('BOTH_PARTIES');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!proposedResolution || !responsibleParty || !targetDate) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_ffc90403bd3c));
            return;
        }
        try {
            await createProposal({
                proposedResolution,
                responsibleParty,
                targetDate,
                acceptanceScope
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_3519d31b17f8), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_e5da5a1ac0b3));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_1dae7ab0b305}</Text>
      
      <Text style={styles.label}>{localizedUiText.m_a87ca0847fd5}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_0b2e1c2629bf} multiline value={proposedResolution} onChangeText={setProposedResolution}/>

      <Text style={styles.label}>{localizedUiText.m_fbcc6baa17f2}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_714742fb4ada} value={responsibleParty} onChangeText={setResponsibleParty}/>

      <VisualDateTimePicker label={localizedUiText.m_ec3b654b5c31} value={targetDate} onChange={setTargetDate} mode="date"/>

      <Text style={styles.label}>{localizedUiText.m_a846e83f4e91}</Text>
      <View style={styles.grid}>
        {acceptanceScopeOptions.map((item) => (<TouchableOpacity key={item.key} style={[styles.gridBtn, acceptanceScope === item.key && styles.gridBtnActive]} onPress={() => setAcceptanceScope(item.key)}>
            <Text style={[styles.gridText, acceptanceScope === item.key && styles.gridTextActive]}>{item.label}</Text>
          </TouchableOpacity>))}
      </View>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_c70c042f10aa}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{localizedUiText.m_10e7362778d9}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

