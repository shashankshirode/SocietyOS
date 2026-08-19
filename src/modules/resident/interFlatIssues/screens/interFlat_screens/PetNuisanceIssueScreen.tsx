import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useCreateInterFlatIssue } from "../../data/useCreateInterFlatIssue";
import { styles } from "../../styles/screens/interFlat_screens/PetNuisanceIssueScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function PetNuisanceIssueScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIssue, isSubmitting } = useCreateInterFlatIssue();
    const [involvedFlat, setInvolvedFlat] = useState('');
    const [involvedTower, setInvolvedTower] = useState('');
    const [petIssueType, setPetIssueType] = useState('LEASH_RULE');
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
                issueType: 'PET_NUISANCE',
                severity: 'LOW',
                involvedFlat,
                involvedTower,
                location: 'Common Area Lobby / Elevator',
                description: formatUiLiteral(String(localizedUiText.m_0ecf7ea79277), [petIssueType, description])
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_85301ecaef78), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_62805a31b60d));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_00e051ce224b}</Text>
      <Text style={styles.infoNote}>{localizedUiText.m_82191f4fe67d}</Text>

      <Text style={styles.label}>{localizedUiText.m_9c40972f32d7}</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.textInputFlex]} placeholder={localizedUiText.m_aeb11001d776} value={involvedTower} onChangeText={setInvolvedTower}/>
        <TextInput style={[styles.input, styles.textInputFlex2]} placeholder={localizedUiText.m_92fccf78c843} value={involvedFlat} onChangeText={setInvolvedFlat}/>
      </View>

      <Text style={styles.label}>{localizedUiText.m_d9b4da78ffd9}</Text>
      <View style={styles.grid}>
        {['NOISE_BARKING', 'CLEANLINESS', 'AGGRESSIVE_BEHAVIOUR', 'LEASH_RULE', 'OTHER'].map((type) => (<TouchableOpacity key={type} style={[styles.gridBtn, petIssueType === type && styles.gridBtnActive]} onPress={() => setPetIssueType(type)}>
            <Text style={[styles.gridText, petIssueType === type && styles.gridTextActive]}>{type.replace(/_/g, ' ')}</Text>
          </TouchableOpacity>))}
      </View>

      <Text style={styles.label}>{localizedUiText.m_200291bd1109}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_025e3b4d3ef0} multiline value={description} onChangeText={setDescription}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_6d4f4aa8e611}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_a6227b02ea69}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

