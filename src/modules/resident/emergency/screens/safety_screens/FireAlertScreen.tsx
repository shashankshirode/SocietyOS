import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateEmergencyIncident } from "../../data/useCreateEmergencyIncident";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import type { FireAlertType } from "../../../../../shared/types/emergency.types";
import { styles } from "../../styles/screens/safety_screens/FireAlertScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function FireAlertScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIncident, isSubmitting } = useCreateEmergencyIncident();
    const [location, setLocation] = useState('');
    const [fireType, setFireType] = useState<FireAlertType>('SMOKE_SEEN');
    const [isTrapped, setIsTrapped] = useState(false);
    const [description, setDescription] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!location.trim())
            temp.location = getActiveUiLiteral("m_84519fa7b772");
        if (!confirmed)
            temp.confirmed = getActiveUiLiteral("m_1859b00642bb");
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            const incident = await createIncident({
                emergencyType: 'FIRE',
                severity: 'CRITICAL',
                location,
                description,
                fireType,
                isPeopleTrapped: isTrapped,
            });
            AppAlert.alert(String(localizedUiText.m_ba851fa429ef), String(localizedUiText.m_aae6f856e11c), [
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
        <Text style={styles.title}>{localizedUiText.m_82f95465b827}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_763dff05e0f5}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_864b319e111c}</Text>
            <TextInput style={[styles.input, errors.location && styles.inputError]} placeholder={localizedUiText.m_092c46ef5f4f} value={location} onChangeText={setLocation}/>
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_ede4820ecc65}</Text>
            <View style={styles.typeGrid}>
              {(['SMOKE_SEEN', 'FIRE_SEEN', 'BURNING_SMELL', 'ELECTRICAL_SPARK'] as FireAlertType[]).map(type => (<Pressable key={type} style={[styles.typeBtn, fireType === type && styles.typeBtnActive]} onPress={() => setFireType(type)}>
                  <Text style={[styles.typeText, fireType === type && styles.typeTextActive]}>{type.replace('_', ' ')}</Text>
                </Pressable>))}
            </View>
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setIsTrapped(!isTrapped)}>
            <View style={[styles.checkbox, isTrapped && styles.checkboxChecked]}>
              {isTrapped && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_4e8b101e0970}</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_52bc11d20e00}</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_37046813f514} multiline numberOfLines={4} value={description} onChangeText={setDescription}/>
          </View>

          <View style={styles.divider}/>

          <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked, errors.confirmed && styles.checkboxError]}>
              {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={[styles.checkboxLabel, styles.confirmLabel]}>{localizedUiText.m_ab74b06344fa}</Text>
          </Pressable>
          {errors.confirmed && <Text style={styles.errorText}>{errors.confirmed}</Text>}

          <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_e58973b71074 : localizedUiText.m_5c2db71d166d}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

