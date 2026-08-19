import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useCreateEmergencyIncident } from "../../data/useCreateEmergencyIncident";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import type { SecurityThreatType } from "../../../../../shared/types/emergency.types";
import { styles } from "../../styles/screens/safety_screens/SecurityThreatAlertScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'SecurityThreatAlert'>;
export function SecurityThreatAlertScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIncident, isSubmitting } = useCreateEmergencyIncident();
    const [threatType, setThreatType] = useState<SecurityThreatType>('SUSPICIOUS_PERSON');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [needHelp, setNeedHelp] = useState(true);
    const [isPrivate, setIsPrivate] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!location.trim())
            temp.location = getActiveUiLiteral("m_ee85504dda9e");
        if (!description.trim() || description.length < 15) {
            temp.description = getActiveUiLiteral("m_3a128c83428f");
        }
        if (!confirmed)
            temp.confirmed = getActiveUiLiteral("m_cf89dac671e8");
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            const incident = await createIncident({
                emergencyType: 'SECURITY_THREAT',
                severity: 'HIGH',
                location,
                description,
                threatType,
                isPrivate,
                needVolunteer: false,
            });
            AppAlert.alert(String(localizedUiText.m_5a4a8c3ee8d0), String(localizedUiText.m_2a97eaa3a9ca), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.replace('ActiveEmergencyDetail', { incidentId: incident.id }),
                }
            ]);
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_13ddd866499a));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_c422428f906e}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_e3d9470d3f75}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_07111d5c6f6a}</Text>
            <View style={styles.typeGrid}>
              {(['SUSPICIOUS_PERSON', 'UNAUTHORIZED_ENTRY', 'FIGHT_OR_VIOLENCE', 'THEFT_SUSPECTED'] as SecurityThreatType[]).map(type => (<Pressable key={type} style={[styles.typeBtn, threatType === type && styles.typeBtnActive]} onPress={() => setThreatType(type)}>
                  <Text style={[styles.typeText, threatType === type && styles.typeTextActive]}>{type.replace(/_/g, ' ')}</Text>
                </Pressable>))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_692d4cc7005a}</Text>
            <TextInput style={[styles.input, errors.location && styles.inputError]} placeholder={localizedUiText.m_0a30bb6c180f} value={location} onChangeText={setLocation}/>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_92f1d9fb30a0}</Text>
            <TextInput style={[styles.input, styles.textArea, errors.description && styles.inputError]} placeholder={localizedUiText.m_57f7b30588a1} multiline numberOfLines={4} value={description} onChangeText={setDescription}/>
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setNeedHelp(!needHelp)}>
            <View style={[styles.checkbox, needHelp && styles.checkboxChecked]}>
              {needHelp && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_2c96a41d69b7}</Text>
          </Pressable>

          <Pressable style={styles.checkboxRow} onPress={() => setIsPrivate(!isPrivate)}>
            <View style={[styles.checkbox, isPrivate && styles.checkboxChecked]}>
              {isPrivate && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_4755a09d8063}</Text>
          </Pressable>

          <View style={styles.divider}/>

          <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked, errors.confirmed && styles.checkboxError]}>
              {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={[styles.checkboxLabel, styles.confirmLabel]}>{localizedUiText.m_c2664752cedb}</Text>
          </Pressable>
          {errors.confirmed && <Text style={styles.errorText}>{errors.confirmed}</Text>}

          <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_320ffc4fe9ed : localizedUiText.m_90426bd07eb0}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

