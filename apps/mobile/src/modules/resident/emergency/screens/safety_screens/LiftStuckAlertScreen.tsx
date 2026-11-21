import { AppAlert } from "../../../../../ui/modal/AppAlert";
import { useState } from "react";
import { Text, View, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateEmergencyIncident } from "../../data/useCreateEmergencyIncident";
import { ScreenContainer } from "../../../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../../../shared/theme";
import { styles } from "../../styles/screens/safety_screens/LiftStuckAlertScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../../../messages/useMessages";
import { formatUiLiteral } from "../../../../../shared/localization/formatUiLiteral";
import { getActiveUiLiteral } from "../../../../../shared/localization/activeUiLiteral";
export function LiftStuckAlertScreen({ navigation }: NavigationOnlyScreenProps) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { createIncident, isSubmitting } = useCreateEmergencyIncident();
    const [tower, setTower] = useState('');
    const [liftNumber, setLiftNumber] = useState('');
    const [floor, setFloor] = useState('');
    const [numPeople, setNumPeople] = useState('1');
    const [medicalIssue, setMedicalIssue] = useState(false);
    const [contactPerson, setContactPerson] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const temp: Record<string, string> = {};
        if (!tower.trim())
            temp.tower = getActiveUiLiteral("m_a99d6daf095c");
        if (!liftNumber.trim())
            temp.liftNumber = getActiveUiLiteral("m_4de26371e686");
        if (!floor.trim())
            temp.floor = getActiveUiLiteral("m_a0cd98330dff");
        if (!contactPerson.trim())
            temp.contactPerson = getActiveUiLiteral("m_24a19b9c576a");
        if (!confirmed)
            temp.confirmed = getActiveUiLiteral("m_c27b754fd718");
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            const incident = await createIncident({
                emergencyType: 'LIFT_STUCK',
                severity: 'HIGH',
                location: `Tower ${tower}, Lift ${liftNumber}, near Floor ${floor}`,
                description: formatUiLiteral(String(localizedUiText.m_baf3ef3b35c5), [numPeople, medicalIssue ? String(localizedUiText.m_85a39ab345d6) : String(localizedUiText.m_1ea442a134b2), contactPerson]),
                liftNumber,
                numberOfPeopleStuck: parseInt(numPeople, 10) || 1,
                isPeopleTrapped: true,
            });
            AppAlert.alert(String(localizedUiText.m_c79e4af37717), String(localizedUiText.m_e835e810d8e2), [
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
        <Text style={styles.title}>{localizedUiText.m_a673c8535eed}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_a3eb19e48bfa}</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_83bb62355ed8}</Text>
            <TextInput style={[styles.input, errors.tower && styles.inputError]} placeholder={localizedUiText.m_0c7cae0c0bdd} value={tower} onChangeText={setTower}/>
            {errors.tower && <Text style={styles.errorText}>{errors.tower}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_9c19ab34e323}</Text>
            <TextInput style={[styles.input, errors.liftNumber && styles.inputError]} placeholder={localizedUiText.m_d1b1ab2fe1a3} value={liftNumber} onChangeText={setLiftNumber}/>
            {errors.liftNumber && <Text style={styles.errorText}>{errors.liftNumber}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_d349e442df84}</Text>
            <TextInput style={[styles.input, errors.floor && styles.inputError]} placeholder={localizedUiText.m_14f5c28068a5} value={floor} onChangeText={setFloor}/>
            {errors.floor && <Text style={styles.errorText}>{errors.floor}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_ecfdff5a0ff3}</Text>
            <TextInput style={styles.input} placeholder={localizedUiText.m_c55ce7c1820c} keyboardType="number-pad" value={numPeople} onChangeText={setNumPeople}/>
          </View>

          <Pressable style={styles.checkboxRow} onPress={() => setMedicalIssue(!medicalIssue)}>
            <View style={[styles.checkbox, medicalIssue && styles.checkboxChecked]}>
              {medicalIssue && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={styles.checkboxLabel}>{localizedUiText.m_76c60b850b37}</Text>
          </Pressable>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{localizedUiText.m_6d1f7c679c4a}</Text>
            <TextInput style={[styles.input, errors.contactPerson && styles.inputError]} placeholder={localizedUiText.m_cc94f2634ecf} value={contactPerson} onChangeText={setContactPerson}/>
            {errors.contactPerson && <Text style={styles.errorText}>{errors.contactPerson}</Text>}
          </View>

          <View style={styles.divider}/>

          <Pressable style={styles.checkboxRow} onPress={() => setConfirmed(!confirmed)}>
            <View style={[styles.checkbox, confirmed && styles.checkboxChecked, errors.confirmed && styles.checkboxError]}>
              {confirmed && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
            </View>
            <Text style={[styles.checkboxLabel, styles.confirmLabel]}>{localizedUiText.m_a271d3066d9e}</Text>
          </Pressable>
          {errors.confirmed && <Text style={styles.errorText}>{errors.confirmed}</Text>}

          <Pressable style={({ pressed }) => [styles.submitBtn, pressed && styles.pressed]} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_3042d24a7088 : localizedUiText.m_4187294b9c64}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>);
}

