import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useCreateInterFlatIssue } from "../../data/useCreateInterFlatIssue";
import { styles } from "../../styles/screens/interFlat_screens/WaterLeakageIssueScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
export function WaterLeakageIssueScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIssue, isSubmitting } = useCreateInterFlatIssue();
    const [involvedFlat, setInvolvedFlat] = useState('');
    const [involvedTower, setInvolvedTower] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [isWaterLeaking, setIsWaterLeaking] = useState(true);
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!involvedFlat || !involvedTower || !location || !description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_abcd94df64ad));
            return;
        }
        try {
            await createIssue({
                issueType: 'WATER_LEAKAGE',
                severity: 'HIGH',
                involvedFlat,
                involvedTower,
                location,
                description: formatUiLiteral(String(localizedUiText.m_2203b3630c0a), [isWaterLeaking ? String(localizedUiText.m_85a39ab345d6) : String(localizedUiText.m_1ea442a134b2), description])
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_308c80e3bfc8), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_62805a31b60d));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_903eca685dfd}</Text>
      <Text style={styles.infoNote}>{localizedUiText.m_0ad6dd6e0c44}</Text>

      <Text style={styles.label}>{localizedUiText.m_0dfed357326a}</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.textInputFlex]} placeholder={localizedUiText.m_aeb11001d776} value={involvedTower} onChangeText={setInvolvedTower}/>
        <TextInput style={[styles.input, styles.textInputFlex2]} placeholder={localizedUiText.m_92fccf78c843} value={involvedFlat} onChangeText={setInvolvedFlat}/>
      </View>

      <Text style={styles.label}>{localizedUiText.m_c5776ecd6c0b}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_9085a0af64fc} value={location} onChangeText={setLocation}/>

      <Text style={styles.label}>{localizedUiText.m_cdb6a6ca65c4}</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.toggleBtn, isWaterLeaking && styles.toggleActive]} onPress={() => setIsWaterLeaking(true)}>
          <Text style={[styles.toggleText, isWaterLeaking && styles.toggleTextActive]}>{localizedUiText.m_d3d5bf0f17a4}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, !isWaterLeaking && styles.toggleActive]} onPress={() => setIsWaterLeaking(false)}>
          <Text style={[styles.toggleText, !isWaterLeaking && styles.toggleTextActive]}>{localizedUiText.m_3baf21f10865}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>{localizedUiText.m_21e83ad0d310}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_eac2a9e9ed9d} multiline value={description} onChangeText={setDescription}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_9e3890d21fe8}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_e7e72948c5d5}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

