import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { EmergencySafetyStackParamList } from "../../../../../app/navigation/navigation.types";
import { useVolunteerRegistration } from "../../data/useVolunteerRegistration";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import type { VolunteerType, VolunteerAvailability } from "../../../../../shared/types/volunteer.types";
import { styles } from "../../styles/screens/safety_screens/EmergencyVolunteerRegistrationScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<EmergencySafetyStackParamList, 'EmergencyVolunteerRegistration'>;
export function EmergencyVolunteerRegistrationScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { register, isSubmitting } = useVolunteerRegistration();
    const [volunteerType, setVolunteerType] = useState<VolunteerType>('FIRST_AID');
    const [availability, setAvailability] = useState<VolunteerAvailability>('AVAILABLE');
    const [skillsNote, setSkillsNote] = useState('');
    const [consent, setConsent] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!consent)
            temp.consent = getActiveUiLiteral("m_feaaf466325f");
        if (!confirmed)
            temp.confirmed = getActiveUiLiteral("m_973af2199875");
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            await register({
                volunteerType,
                availability,
                skillsNote,
                contactVisibilityConsent: consent,
            });
            AppAlert.alert(String(localizedUiText.m_625bd93c7ca1), String(localizedUiText.m_34a12fe6aab8), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.goBack(),
                }
            ]);
        }
        catch (e) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), e instanceof Error ? e.message : String(localizedUiText.m_d40e3b08ef50));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{localizedUiText.m_f824171a2d18}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_c9ff605dc150}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_444d82b11bfc}</Text>
            <View style={styles.grid}>
              {(['DOCTOR', 'NURSE', 'FIRST_AID', 'CAR_AVAILABLE', 'FIRE_SAFETY_TRAINED'] as VolunteerType[]).map(type => (<Pressable key={type} style={[styles.typeBtn, volunteerType === type && styles.typeBtnActive]} onPress={() => setVolunteerType(type)}>
                  <Text style={[styles.typeText, volunteerType === type && styles.typeTextActive]}>{type.replace(/_/g, ' ')}</Text>
                </Pressable>))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_85980beccd91}</Text>
            <View style={styles.grid}>
              {(['AVAILABLE', 'LIMITED', 'ON_CALL_ONLY'] as VolunteerAvailability[]).map(av => (<Pressable key={av} style={[styles.typeBtn, availability === av && styles.typeBtnActive]} onPress={() => setAvailability(av)}>
                  <Text style={[styles.typeText, availability === av && styles.typeTextActive]}>{av.replace(/_/g, ' ')}</Text>
                </Pressable>))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_d294db1856ef}</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_2aa933cce178} multiline numberOfLines={4} value={skillsNote} onChangeText={setSkillsNote}/>
          </View>

          <View style={styles.divider}/>

          <Pressable style={styles.checkboxRow} onPress={() => setConsent(!consent)}>
            <View style={[styles.checkbox, consent && styles.checkboxChecked, errors.consent && styles.checkboxError]}>
              {consent && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_c7a29ef669ba}</Text>
          </Pressable>
          {errors.consent && <Text style={styles.errorText}>{errors.consent}</Text>}

          <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked, errors.confirmed && styles.checkboxError]}>
              {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_3c3f9a130543}</Text>
          </Pressable>
          {errors.confirmed && <Text style={styles.errorText}>{errors.confirmed}</Text>}

          <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_5b7d8cc03a12 : localizedUiText.m_7a60259f35e5}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

