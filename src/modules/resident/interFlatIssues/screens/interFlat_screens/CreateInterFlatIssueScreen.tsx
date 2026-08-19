import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useCreateInterFlatIssue } from "../../data/useCreateInterFlatIssue";
import type { CreateInterFlatIssueScreenProps } from "../../../../../app/navigation/navigation.types";
import type { InterFlatIssueSeverity, InterFlatIssueType } from "../../../../../shared/types/interFlat.types";
import { styles } from "../../styles/screens/interFlat_screens/CreateInterFlatIssueScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
const severityOptions: readonly InterFlatIssueSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
export function CreateInterFlatIssueScreen({ navigation, route }: CreateInterFlatIssueScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const issueType: InterFlatIssueType = route.params?.issueType ?? 'OTHER';
    const { createIssue, isSubmitting } = useCreateInterFlatIssue();
    const [involvedFlat, setInvolvedFlat] = useState('');
    const [involvedTower, setInvolvedTower] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<InterFlatIssueSeverity>('MEDIUM');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!involvedFlat || !involvedTower || !location || !description) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (description.length < 20) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_181b1e35dbd2));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_c2ba08f9254d));
            return;
        }
        try {
            await createIssue({
                issueType,
                severity,
                involvedFlat,
                involvedTower,
                location,
                description,
                isPrivate: true
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_744fe55ea335), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_ec47365c421e));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_f6463cc07774}</Text>
      <Text style={styles.typeBadge}>{issueType.replace(/_/g, ' ')}</Text>

      <Text style={styles.label}>{localizedUiText.m_8e6938bc1010}</Text>
      <View style={styles.row}>
        <TextInput style={[styles.input, styles.textInputFlex]} placeholder={localizedUiText.m_4bf1d42d597b} value={involvedTower} onChangeText={setInvolvedTower}/>
        <TextInput style={[styles.input, styles.textInputFlex2]} placeholder={localizedUiText.m_9dc00dc79d04} value={involvedFlat} onChangeText={setInvolvedFlat}/>
      </View>

      <Text style={styles.label}>{localizedUiText.m_b88c9013df6c}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_0238b546e43e} value={location} onChangeText={setLocation}/>

      <Text style={styles.label}>{localizedUiText.m_689bdaaaa463}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_092559e47b6e} multiline numberOfLines={4} value={description} onChangeText={setDescription}/>

      <Text style={styles.label}>{localizedUiText.m_f8e756f0aaf3}</Text>
      <View style={styles.row}>
        {severityOptions.map((s) => (<TouchableOpacity key={s} style={[styles.sevBtn, severity === s && styles.sevBtnActive]} onPress={() => setSeverity(s)}>
            <Text style={[styles.sevText, severity === s && styles.sevTextActive]}>{s}</Text>
          </TouchableOpacity>))}
      </View>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_dcdb436bf797}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_a6227b02ea69}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

