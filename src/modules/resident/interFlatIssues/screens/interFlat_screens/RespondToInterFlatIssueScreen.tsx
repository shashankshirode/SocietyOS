import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRespondToIssue } from "../../data/useRespondToIssue";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import type { IssueResponseType } from "../../../../../shared/types/interFlat.types";
import { styles } from "../../styles/screens/interFlat_screens/RespondToInterFlatIssueScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
const responseTypes: readonly IssueResponseType[] = [
    'ACKNOWLEDGE_AND_COOPERATE',
    'NEED_MORE_DETAILS',
    'DISAGREE',
    'ALREADY_RESOLVED',
    'NOT_RELATED_TO_MY_FLAT',
];
export function RespondToInterFlatIssueScreen({ route, navigation }: InterFlatScreenProps<'RespondToInterFlatIssue'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { submitResponse, isSubmitting } = useRespondToIssue(issueId);
    const [responseType, setResponseType] = useState<IssueResponseType>('ACKNOWLEDGE_AND_COOPERATE');
    const [explanation, setExplanation] = useState('');
    const [willCooperate, setWillCooperate] = useState(true);
    const [proposedResolution, setProposedResolution] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!explanation) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_414c339ce80c));
            return;
        }
        if (explanation.length < 15) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_889c1e025604));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_7324eae10d22));
            return;
        }
        try {
            await submitResponse({
                responseType,
                explanation,
                willCooperateWithInspection: willCooperate,
                proposedResolution
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_89c0ee8b9861), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_9871c0bd862d));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_157672ec2156}</Text>
      <Text style={styles.label}>{localizedUiText.m_3c6df75333e2}</Text>
      
      <View style={styles.grid}>
        {responseTypes.map((type) => (<TouchableOpacity key={type} style={[styles.gridBtn, responseType === type && styles.gridBtnActive]} onPress={() => setResponseType(type)}>
            <Text style={[styles.gridText, responseType === type && styles.gridTextActive]}>{type.replace(/_/g, ' ')}</Text>
          </TouchableOpacity>))}
      </View>

      <Text style={styles.label}>{localizedUiText.m_ecc6e12068a4}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_3d6ef82811a3} multiline value={explanation} onChangeText={setExplanation}/>

      <Text style={styles.label}>{localizedUiText.m_1dbc9aee049a}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.toggleBtn, willCooperate && styles.toggleActive]} onPress={() => setWillCooperate(true)}>
          <Text style={[styles.toggleText, willCooperate && styles.toggleTextActive]}>{localizedUiText.m_34de04ad0817}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, !willCooperate && styles.toggleActive]} onPress={() => setWillCooperate(false)}>
          <Text style={[styles.toggleText, !willCooperate && styles.toggleTextActive]}>{localizedUiText.m_a9ed4c424833}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{localizedUiText.m_3f89cc36a701}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_0f109efe9d8b} value={proposedResolution} onChangeText={setProposedResolution}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_f03cc8e7ec1b}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_02ca78af16e2}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

