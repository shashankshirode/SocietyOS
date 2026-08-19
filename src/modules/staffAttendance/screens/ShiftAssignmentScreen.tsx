import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useShiftAssignment } from "../data/useShiftAssignment";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/ShiftAssignmentScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'ShiftAssignment'>;
export function ShiftAssignmentScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { staffId: routeStaffId, shiftId: routeShiftId } = route.params || {};
    const { assign, isSubmitting } = useShiftAssignment();
    const [staffId, setStaffId] = useState(routeStaffId || '');
    const [shiftId, setShiftId] = useState(routeShiftId || 'shift-001');
    const [effectiveFrom, setEffectiveFrom] = useState(getRequiredItem(new Date().toISOString().split('T'), 0, "ShiftAssignmentScreen.tsx"));
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!staffId.trim())
            tempErrors.staffId = getActiveUiLiteral("m_0fb4b6064101");
        if (!shiftId.trim())
            tempErrors.shiftId = getActiveUiLiteral("m_fc7a506be7c9");
        if (!effectiveFrom.trim())
            tempErrors.effectiveFrom = getActiveUiLiteral("m_50df700e9873");
        if (!location.trim())
            tempErrors.location = getActiveUiLiteral("m_4a5edffaf57a");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            await assign({
                staffId,
                shiftId,
                effectiveFrom,
                location,
                weeklyOffDays: ['SUNDAY'],
                notes,
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_8336e86d5799), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        catch (err) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), err instanceof Error ? err.message : String(localizedUiText.m_603f6bf914a8));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_00622bd341e1}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_e160f8957ec6}</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="warning" size={18} color={Colors.warning}/>
        <Text style={styles.alertText}>{localizedUiText.m_9cb23646f5fb}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_9cfd0fe67134}</Text>
          <TextInput style={[styles.input, errors.staffId && styles.inputError]} placeholder={localizedUiText.m_8cc6a456f2b1} value={staffId} onChangeText={setStaffId}/>
          {errors.staffId && <Text style={styles.errorText}>{errors.staffId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_2c04c3a90d53}</Text>
          <TextInput style={[styles.input, errors.shiftId && styles.inputError]} placeholder={localizedUiText.m_76e80b3cecab} value={shiftId} onChangeText={setShiftId}/>
          {errors.shiftId && <Text style={styles.errorText}>{errors.shiftId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_840003d38ac9}</Text>
          <TextInput style={[styles.input, errors.effectiveFrom && styles.inputError]} placeholder={localizedUiText.m_6c48580bf8e9} value={effectiveFrom} onChangeText={setEffectiveFrom}/>
          {errors.effectiveFrom && <Text style={styles.errorText}>{errors.effectiveFrom}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_692d4cc7005a}</Text>
          <TextInput style={[styles.input, errors.location && styles.inputError]} placeholder={localizedUiText.m_f4031ac4cb9f} value={location} onChangeText={setLocation}/>
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_8a7525b1492f}</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_d07d0315ad0b} multiline numberOfLines={4} value={notes} onChangeText={setNotes}/>
        </View>

        <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_085b8736822e : localizedUiText.m_00622bd341e1}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

