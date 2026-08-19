import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useManualAttendanceEntry } from "../data/useManualAttendanceEntry";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import type { PunchType } from "../../../shared/types/attendance.types";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/ManualAttendanceEntryScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'ManualAttendanceEntry'>;
export function ManualAttendanceEntryScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { enter, isSubmitting } = useManualAttendanceEntry();
    const [staffId, setStaffId] = useState('');
    const [date, setDate] = useState(getRequiredItem(new Date().toISOString().split('T'), 0, "ManualAttendanceEntryScreen.tsx"));
    const [punchType, setPunchType] = useState<PunchType>('IN');
    const [punchTime, setPunchTime] = useState('09:00');
    const [reason, setReason] = useState('');
    const [confirmationChecked, setConfirmationChecked] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!staffId.trim())
            tempErrors.staffId = getActiveUiLiteral("m_0fb4b6064101");
        if (!date.trim())
            tempErrors.date = getActiveUiLiteral("m_2cc9bbca7f87");
        if (!punchTime.trim())
            tempErrors.punchTime = getActiveUiLiteral("m_46ca212d6dc4");
        if (!reason.trim() || reason.length < 15) {
            tempErrors.reason = getActiveUiLiteral("m_4167a9a8ee72");
        }
        if (!confirmationChecked) {
            tempErrors.confirmation = getActiveUiLiteral("m_0c421b8ce055");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            await enter({
                staffId,
                date,
                punchType,
                punchTime,
                reason,
                confirmationChecked,
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_90b143111c65), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        catch (err) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), err instanceof Error ? err.message : String(localizedUiText.m_5ea83766ef50));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_08f095019dc1}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_84d7378ee581}</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="alert-circle-outline" size={18} color={Colors.warning}/>
        <Text style={styles.alertText}>{localizedUiText.m_ce607a206242}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_9cfd0fe67134}</Text>
          <TextInput style={[styles.input, errors.staffId && styles.inputError]} placeholder={localizedUiText.m_8cc6a456f2b1} value={staffId} onChangeText={setStaffId}/>
          {errors.staffId && <Text style={styles.errorText}>{errors.staffId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_c218c8b08e3a}</Text>
          <TextInput style={[styles.input, errors.date && styles.inputError]} placeholder={localizedUiText.m_6c48580bf8e9} value={date} onChangeText={setDate}/>
          {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_a319cb3dac04}</Text>
          <View style={styles.typeSelector}>
            {(['IN', 'OUT'] as PunchType[]).map(type => (<Pressable key={type} style={[styles.typeButton, punchType === type && styles.typeButtonActive]} onPress={() => setPunchType(type)}>
                <Text style={[styles.typeText, punchType === type && styles.typeTextActive]}>{type}</Text>
              </Pressable>))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_6da83b38e1c7}</Text>
          <TextInput style={[styles.input, errors.punchTime && styles.inputError]} placeholder={localizedUiText.m_7c9739818315} value={punchTime} onChangeText={setPunchTime}/>
          {errors.punchTime && <Text style={styles.errorText}>{errors.punchTime}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_c52e3162d3d4}</Text>
          <TextInput style={[styles.input, styles.textArea, errors.reason && styles.inputError]} placeholder={localizedUiText.m_6d803fea3395} multiline numberOfLines={4} value={reason} onChangeText={setReason}/>
          {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
        </View>

        <Pressable style={styles.checkboxRow} onPress={() => setConfirmationChecked(!confirmationChecked)}>
          <View style={[styles.checkbox, confirmationChecked && styles.checkboxChecked]}>
            {confirmationChecked && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
          </View>
          <Text style={styles.checkboxLabel}>{localizedUiText.m_67af61def33e}</Text>
        </Pressable>
        {errors.confirmation && <Text style={styles.errorText}>{errors.confirmation}</Text>}

        <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_64115d5b9c79 : localizedUiText.m_dfafd8bf35f4}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

