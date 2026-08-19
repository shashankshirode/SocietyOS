import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useCreateInterFlatIssue } from "../../data/useCreateInterFlatIssue";
import { styles } from "../../styles/screens/interFlat_screens/RenovationDisturbanceScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function RenovationDisturbanceScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIssue, isSubmitting } = useCreateInterFlatIssue();
    const [involvedFlat, setInvolvedFlat] = useState('');
    const [involvedTower, setInvolvedTower] = useState('');
    const [disturbanceType, setDisturbanceType] = useState('NOISE');
    const [description, setDescription] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!involvedFlat || !involvedTower || !description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_17cf03761dcc));
            return;
        }
        try {
            await createIssue({
                issueType: 'RENOVATION_DISTURBANCE',
                severity: 'MEDIUM',
                involvedFlat,
                involvedTower,
                location: 'Adjacent Unit',
                description: formatUiLiteral(String(localizedUiText.m_97545856d9ba), [disturbanceType, description])
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_1edd9c3bc595), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_62805a31b60d));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_0645c002c235}</Text>
      <Text style={styles.infoNote}>{localizedUiText.m_76b86455dcec}</Text>

      <Text style={styles.label}>{localizedUiText.m_e57801b4b59c}</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.textInputFlex]} placeholder={localizedUiText.m_aeb11001d776} value={involvedTower} onChangeText={setInvolvedTower}/>
        <TextInput style={[styles.input, styles.textInputFlex2]} placeholder={localizedUiText.m_92fccf78c843} value={involvedFlat} onChangeText={setInvolvedFlat}/>
      </View>

      <Text style={styles.label}>{localizedUiText.m_35319e87dba7}</Text>
      <View style={styles.grid}>
        {['NOISE', 'DUST', 'DEBRIS', 'LIFT_USAGE', 'OUTSIDE_HOURS'].map((type) => (<TouchableOpacity key={type} style={[styles.gridBtn, disturbanceType === type && styles.gridBtnActive]} onPress={() => setDisturbanceType(type)}>
            <Text style={[styles.gridText, disturbanceType === type && styles.gridTextActive]}>{type.replace(/_/g, ' ')}</Text>
          </TouchableOpacity>))}
      </View>

      <Text style={styles.label}>{localizedUiText.m_6aa091b83a8e}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_c2bc38ae0c83} multiline value={description} onChangeText={setDescription}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_d5cbabfe193c}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_a6227b02ea69}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

