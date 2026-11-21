import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateEmergencyIncident } from "../../data/useCreateEmergencyIncident";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/MedicalEmergencyScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function MedicalEmergencyScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIncident, isSubmitting } = useCreateEmergencyIncident();
    const [personNeedingHelp, setPersonNeedingHelp] = useState('');
    const [isSenior, setIsSenior] = useState(false);
    const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
    const [description, setDescription] = useState('');
    const [needAmbulance, setNeedAmbulance] = useState(false);
    const [needVolunteer, setNeedVolunteer] = useState(false);
    const [notifyFamily, setNotifyFamily] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!personNeedingHelp.trim())
            temp.personNeedingHelp = getActiveUiLiteral("m_a193414edff7");
        if (!confirmed)
            temp.confirmed = getActiveUiLiteral("m_371f994aebd5");
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            const incident = await createIncident({
                emergencyType: 'MEDICAL',
                severity,
                location: 'Flat A-1204',
                description: formatUiLiteral(String(localizedUiText.m_b58ffd956f31), [description, personNeedingHelp, needAmbulance]),
                isSeniorCitizen: isSenior,
                needAmbulance,
                needVolunteer,
                notifyFamily,
            });
            AppAlert.alert(String(localizedUiText.m_7d9fcc36c53c), String(localizedUiText.m_76aa43d4054d), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.replace?.('ActiveEmergencyDetail', { incidentId: incident.id }),
                }
            ]);
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_13ddd866499a));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_fb6e65bf4bea}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_c4b3cf8effc6}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_5b6b152260fd}</Text>
            <TextInput style={[styles.input, errors.personNeedingHelp && styles.inputError]} placeholder={localizedUiText.m_db145c1a4af3} value={personNeedingHelp} onChangeText={setPersonNeedingHelp}/>
            {errors.personNeedingHelp && <Text style={styles.errorText}>{errors.personNeedingHelp}</Text>}
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setIsSenior(!isSenior)}>
            <View style={[styles.checkbox, isSenior && styles.checkboxChecked]}>
              {isSenior && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_473f377eeb92}</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_dda2e4719b6d}</Text>
            <View style={styles.severityGrid}>
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map(lev => (<Pressable key={lev} style={[styles.sevBtn, severity === lev && styles.sevBtnActive, severity === lev && lev === 'CRITICAL' && styles.sevBtnCritical]} onPress={() => setSeverity(lev)}>
                  <Text style={[styles.sevText, severity === lev && styles.sevTextActive]}>{lev}</Text>
                </Pressable>))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_fc9923f0f789}</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_4f1dbedfa9fa} multiline numberOfLines={4} value={description} onChangeText={setDescription}/>
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setNeedAmbulance(!needAmbulance)}>
            <View style={[styles.checkbox, needAmbulance && styles.checkboxChecked]}>
              {needAmbulance && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_af51592bebae}</Text>
          </Pressable>

          <Pressable style={styles.checkboxRow} onPress={() => setNeedVolunteer(!needVolunteer)}>
            <View style={[styles.checkbox, needVolunteer && styles.checkboxChecked]}>
              {needVolunteer && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_9694921de9c1}</Text>
          </Pressable>

          <Pressable style={styles.checkboxRow} onPress={() => setNotifyFamily(!notifyFamily)}>
            <View style={[styles.checkbox, notifyFamily && styles.checkboxChecked]}>
              {notifyFamily && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_1e5928db5975}</Text>
          </Pressable>

          <View style={styles.divider}/>

          <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked, errors.confirmed && styles.checkboxError]}>
              {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={[styles.checkboxLabel, styles.confirmLabel]}>{localizedUiText.m_886483ae63c1}</Text>
          </Pressable>
          {errors.confirmed && <Text style={styles.errorText}>{errors.confirmed}</Text>}

          <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_94dc61379ec0 : localizedUiText.m_33314cc8b9db}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

