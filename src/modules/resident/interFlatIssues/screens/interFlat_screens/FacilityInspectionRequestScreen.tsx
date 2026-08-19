import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useFacilityInspection } from "../../data/useFacilityInspection";
import type { InterFlatScreenProps } from "../../../../../app/navigation/navigation.types";
import { VisualDateTimePicker } from "../../../../../ui/patterns/VisualDateTimePicker";
import { styles } from "../../styles/screens/interFlat_screens/FacilityInspectionRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
function toIsoDateTime(date: string, time: string): string {
    const match = /^(\d{1,2}):(\d{2})\s+(AM|PM)$/.exec(time);
    if (!match)
        return '';
    let hour = Number(match[1]);
    if (match[3] === 'PM' && hour < 12)
        hour += 12;
    if (match[3] === 'AM' && hour === 12)
        hour = 0;
    return `${date}T${String(hour).padStart(2, '0')}:${match[2]}:00`;
}
export function FacilityInspectionRequestScreen({ route, navigation }: InterFlatScreenProps<'FacilityInspectionRequest'>) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { issueId } = route.params;
    const { requestInspection, isSubmitting } = useFacilityInspection();
    const [preferredDate, setPreferredDate] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [inspectionArea, setInspectionArea] = useState('');
    const [notes, setNotes] = useState('');
    const [consent, setConsent] = useState(false);
    const handleSubmit = async () => {
        if (!preferredDate || !preferredTime || !inspectionArea) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_d1641a4df419));
            return;
        }
        if (!consent) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_17cf03761dcc));
            return;
        }
        try {
            const scheduledAt = toIsoDateTime(preferredDate, preferredTime);
            if (!scheduledAt) {
                AppAlert.alert(String(localizedUiText.m_5895cfe4de6f), String(localizedUiText.m_88bf6d1404bd));
                return;
            }
            await requestInspection(issueId, scheduledAt);
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_11e922e1779c), [
                { text: String(localizedUiText.m_565339bc4d33), onPress: () => navigation.navigate('InterFlatHome') }
            ]);
        }
        catch {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), String(localizedUiText.m_3f4e2f75a4b1));
        }
    };
    return (<ScrollView style={styles.container} contentContainerStyle={styles.scroll}>
      <Text style={styles.title}>{localizedUiText.m_80b018682a17}</Text>
      
      <Text style={styles.label}>{localizedUiText.m_2867576decd3}</Text>
      <TextInput style={styles.input} placeholder={localizedUiText.m_28af10a3dcfd} value={inspectionArea} onChangeText={setInspectionArea}/>

      <VisualDateTimePicker label={localizedUiText.m_3bde12e87641} value={preferredDate} onChange={setPreferredDate} mode="date"/>
      <VisualDateTimePicker label={localizedUiText.m_13ae4c193d33} value={preferredTime} onChange={setPreferredTime} mode="time"/>

      <Text style={styles.label}>{localizedUiText.m_58b232876b5d}</Text>
      <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_2d17bba32c56} multiline value={notes} onChangeText={setNotes}/>

      <TouchableOpacity style={styles.consentRow} onPress={() => setConsent(!consent)}>
        <View style={[styles.checkbox, consent && styles.checked]}/>
        <Text style={styles.consentText}>{localizedUiText.m_bf01b4933860}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.submitBtnText}>{isSubmitting ? localizedUiText.m_7ba2b2f12c41 : localizedUiText.m_7ad098f214d2}</Text>
      </TouchableOpacity>
    </ScrollView>);
}

