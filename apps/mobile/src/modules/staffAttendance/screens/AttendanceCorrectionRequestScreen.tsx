import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useAttendanceCorrections } from "../data/useAttendanceCorrections";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import type { CorrectionType } from "../../../shared/types/attendance.types";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/AttendanceCorrectionRequestScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'AttendanceCorrectionRequest'>;
const correctionTypes: {
    label: string;
    value: CorrectionType;
}[] = [
    { get label() {
            return getActiveUiLiteral("m_c8ab9c19245e");
        }, value: 'MISSED_CHECK_IN' },
    { get label() {
            return getActiveUiLiteral("m_f13e5505b833");
        }, value: 'MISSED_CHECK_OUT' },
    { get label() {
            return getActiveUiLiteral("m_3e9599c01586");
        }, value: 'WRONG_PUNCH_TIME' },
    { get label() {
            return getActiveUiLiteral("m_02a23c9a0394");
        }, value: 'WRONG_PUNCH_TYPE' },
    { get label() {
            return getActiveUiLiteral("m_4ed610551a84");
        }, value: 'DUPLICATE_PUNCH' },
];
export function AttendanceCorrectionRequestScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { requestCorrection } = useAttendanceCorrections();
    const [staffId, setStaffId] = useState('');
    const [attendanceDate, setAttendanceDate] = useState(getRequiredItem(new Date().toISOString().split('T'), 0, "AttendanceCorrectionRequestScreen.tsx"));
    const [selectedType, setSelectedType] = useState<CorrectionType>('MISSED_CHECK_IN');
    const [requestedCorrection, setRequestedCorrection] = useState('');
    const [reason, setReason] = useState('');
    const [confirmationChecked, setConfirmationChecked] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!staffId.trim())
            tempErrors.staffId = getActiveUiLiteral("m_0fb4b6064101");
        if (!attendanceDate.trim())
            tempErrors.attendanceDate = getActiveUiLiteral("m_8a8aa52d9d74");
        if (!requestedCorrection.trim())
            tempErrors.requestedCorrection = getActiveUiLiteral("m_de0465dda9b9");
        if (!reason.trim() || reason.length < 20) {
            tempErrors.reason = getActiveUiLiteral("m_352e36c8b155");
        }
        if (!confirmationChecked) {
            tempErrors.confirmation = getActiveUiLiteral("m_ca570fe62d58");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            await requestCorrection({
                staffId,
                attendanceDate,
                correctionType: selectedType,
                requestedCorrection,
                reason,
                confirmationChecked,
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_6bd29a618d51), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        catch (err) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), err instanceof Error ? err.message : String(localizedUiText.m_13ddd866499a));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_11bc9a705e53}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_1d15dbe8160a}</Text>
      </View>

      <View style={styles.alertBox}>
        <Ionicons name="warning" size={18} color={Colors.warning}/>
        <Text style={styles.alertText}>{localizedUiText.m_60c1b29c3606}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_9cfd0fe67134}</Text>
          <TextInput style={[styles.input, errors.staffId && styles.inputError]} placeholder={localizedUiText.m_8cc6a456f2b1} value={staffId} onChangeText={setStaffId}/>
          {errors.staffId && <Text style={styles.errorText}>{errors.staffId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_2ea8687487ac}</Text>
          <TextInput style={[styles.input, errors.attendanceDate && styles.inputError]} placeholder={localizedUiText.m_6c48580bf8e9} value={attendanceDate} onChangeText={setAttendanceDate}/>
          {errors.attendanceDate && <Text style={styles.errorText}>{errors.attendanceDate}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_9a494047f14a}</Text>
          <View style={styles.typeSelector}>
            {correctionTypes.map(type => (<Pressable key={type.value} style={[styles.typeButton, selectedType === type.value && styles.typeButtonActive]} onPress={() => setSelectedType(type.value)}>
                <Text style={[styles.typeText, selectedType === type.value && styles.typeTextActive]}>{type.label}</Text>
              </Pressable>))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_54a32db617f8}</Text>
          <TextInput style={[styles.input, errors.requestedCorrection && styles.inputError]} placeholder={localizedUiText.m_08b7862a3ed1} value={requestedCorrection} onChangeText={setRequestedCorrection}/>
          {errors.requestedCorrection && <Text style={styles.errorText}>{errors.requestedCorrection}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_2bb275006bfd}</Text>
          <TextInput style={[styles.input, styles.textArea, errors.reason && styles.inputError]} placeholder={localizedUiText.m_8608c42eb9a8} multiline numberOfLines={4} value={reason} onChangeText={setReason}/>
          {errors.reason && <Text style={styles.errorText}>{errors.reason}</Text>}
        </View>

        <Pressable style={styles.checkboxRow} onPress={() => setConfirmationChecked(!confirmationChecked)}>
          <View style={[styles.checkbox, confirmationChecked && styles.checkboxChecked]}>
            {confirmationChecked && <Ionicons name="checkmark" size={14} color={Colors.white}/>}
          </View>
          <Text style={styles.checkboxLabel}>{localizedUiText.m_fab9646b7848}</Text>
        </Pressable>
        {errors.confirmation && <Text style={styles.errorText}>{errors.confirmation}</Text>}

        <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} onPress={handleSubmit}>
          <Text style={styles.submitText}>{localizedUiText.m_cffa014c614c}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

