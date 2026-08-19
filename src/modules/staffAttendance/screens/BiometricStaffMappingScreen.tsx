import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useBiometricStaffMapping } from "../data/useBiometricStaffMapping";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { AttendancePrivacyNotice } from "../components/AttendancePrivacyNotice";
import { getRequiredItem } from "../../../shared/utils/requiredItem";
import { styles } from "../styles/screens/BiometricStaffMappingScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
import { getActiveUiLiteral } from "../../../shared/localization/activeUiLiteral";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'BiometricStaffMapping'>;
export function BiometricStaffMappingScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { deviceId: routeDeviceId, employeeCode: routeEmployeeCode } = route.params || {};
    const { map, isSubmitting } = useBiometricStaffMapping();
    const [deviceId, setDeviceId] = useState(routeDeviceId || '');
    const [biometricEmployeeCode, setBiometricEmployeeCode] = useState(routeEmployeeCode || '');
    const [staffId, setStaffId] = useState('');
    const [effectiveFrom, setEffectiveFrom] = useState(getRequiredItem(new Date().toISOString().split('T'), 0, "BiometricStaffMappingScreen.tsx"));
    const [notes, setNotes] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const validate = () => {
        const tempErrors: Record<string, string> = {};
        if (!deviceId.trim())
            tempErrors.deviceId = getActiveUiLiteral("m_b3b83b9e2dbb");
        if (!biometricEmployeeCode.trim())
            tempErrors.biometricEmployeeCode = getActiveUiLiteral("m_1a450ae260dc");
        if (!staffId.trim())
            tempErrors.staffId = getActiveUiLiteral("m_0fb4b6064101");
        if (!effectiveFrom.trim())
            tempErrors.effectiveFrom = getActiveUiLiteral("m_50df700e9873");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleSubmit = async () => {
        if (!validate())
            return;
        try {
            await map({
                deviceId,
                biometricEmployeeCode,
                staffId,
                effectiveFrom,
                notes,
            });
            AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_73b470aee7e3), [
                {
                    text: String(localizedUiText.m_565339bc4d33),
                    onPress: () => navigation.goBack(),
                },
            ]);
        }
        catch (err) {
            AppAlert.alert(String(localizedUiText.m_54a0e8c17ebb), err instanceof Error ? err.message : String(localizedUiText.m_a318c7280ec3));
        }
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_527119f27497}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_6f5b8f810dfc}</Text>
      </View>

      <AttendancePrivacyNotice />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_350636ec5dcf}</Text>
          <TextInput style={[styles.input, errors.deviceId && styles.inputError]} placeholder={localizedUiText.m_bca7e1e63f81} value={deviceId} onChangeText={setDeviceId}/>
          {errors.deviceId && <Text style={styles.errorText}>{errors.deviceId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_141eb9546da1}</Text>
          <TextInput style={[styles.input, errors.biometricEmployeeCode && styles.inputError]} placeholder={localizedUiText.m_2fe13d4c535d} value={biometricEmployeeCode} onChangeText={setBiometricEmployeeCode}/>
          {errors.biometricEmployeeCode && <Text style={styles.errorText}>{errors.biometricEmployeeCode}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_a85063d6d9f0}</Text>
          <TextInput style={[styles.input, errors.staffId && styles.inputError]} placeholder={localizedUiText.m_8cc6a456f2b1} value={staffId} onChangeText={setStaffId}/>
          {errors.staffId && <Text style={styles.errorText}>{errors.staffId}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_efd1ed3a1b23}</Text>
          <TextInput style={[styles.input, errors.effectiveFrom && styles.inputError]} placeholder={localizedUiText.m_6c48580bf8e9} value={effectiveFrom} onChangeText={setEffectiveFrom}/>
          {errors.effectiveFrom && <Text style={styles.errorText}>{errors.effectiveFrom}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{localizedUiText.m_8a7525b1492f}</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder={localizedUiText.m_8d900b087509} multiline numberOfLines={4} value={notes} onChangeText={setNotes}/>
        </View>

        <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitText}>{isSubmitting ? localizedUiText.m_cf06f82d2ad1 : localizedUiText.m_7b4d4246ab29}</Text>
        </Pressable>
      </View>
    </ScreenContainer>);
}

