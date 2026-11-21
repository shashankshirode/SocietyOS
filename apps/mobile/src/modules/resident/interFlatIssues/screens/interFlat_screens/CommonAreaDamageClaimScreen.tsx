import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useCreateInterFlatIssue } from "../../data/useCreateInterFlatIssue";
import { styles } from "../../styles/screens/interFlat_screens/CommonAreaDamageClaimScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function CommonAreaDamageClaimScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIssue, isSubmitting } = useCreateInterFlatIssue();
    const [location, setLocation] = useState('');
    const [damageType, setDamageType] = useState('WALL_DAMAGE');
    const [description, setDescription] = useState('');
    const [involvedFlat, setInvolvedFlat] = useState('');
    const [involvedTower, setInvolvedTower] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!location || !description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_17cf03761dcc));
            return;
        }
        try {
            await createIssue({
                issueType: 'COMMON_AREA_DAMAGE',
                severity: 'HIGH',
                involvedFlat: involvedFlat || 'Common Area',
                involvedTower: involvedTower || '',
                location,
                description: formatUiLiteral(String(localizedUiText.m_27daec5917a8), [damageType, description])
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_775d8af12b29), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_62805a31b60d));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_039a7924d849}</Text>
      <Text style={styles.infoNote}>{localizedUiText.m_9d8e6bb33120}</Text>

      <Text style={styles.label}>{localizedUiText.m_0abed4295d32}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_9414238c974e} value={location} onChangeText={setLocation}/>

      <Text style={styles.label}>{localizedUiText.m_abc4868f7dd0}</Text>
      <View style={styles.grid}>
        {['WALL_DAMAGE', 'LIFT_DAMAGE', 'PARKING_DAMAGE', 'GARDEN_DAMAGE', 'LIGHTING_DAMAGE', 'OTHER'].map((type) => (<TouchableOpacity key={type} style={[styles.gridBtn, damageType === type && styles.gridBtnActive]} onPress={() => setDamageType(type)}>
            <Text style={[styles.gridText, damageType === type && styles.gridTextActive]}>{type.replace(/_/g, ' ')}</Text>
          </TouchableOpacity>))}
      </View>

      <Text style={styles.label}>{localizedUiText.m_f5d94a24fe46}</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.textInputFlex]} placeholder={localizedUiText.m_aeb11001d776} value={involvedTower} onChangeText={setInvolvedTower}/>
        <TextInput style={[styles.input, styles.textInputFlex2]} placeholder={localizedUiText.m_92fccf78c843} value={involvedFlat} onChangeText={setInvolvedFlat}/>
      </View>

      <Text style={styles.label}>{localizedUiText.m_21e83ad0d310}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_5917ca93f1bd} multiline value={description} onChangeText={setDescription}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_2bb60e4539c4}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_2506821028c5}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

