import { View, Text, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useAttendanceSettings } from "../data/useAttendanceSettings";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { styles } from "../styles/screens/AttendanceSettingsScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'AttendanceSettings'>;
export function AttendanceSettingsScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useAttendanceSettings();
    const handleSave = () => {
        AppAlert.alert(String(localizedUiText.m_ec92e1dc9bb3), String(localizedUiText.m_a8386121fa09));
    };
    if (isLoading)
        return <LoadingState message={localizedUiText.m_157fd50d1133}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_ba1edae91173}/>;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{localizedUiText.m_95ad0c12dacb}</Text>
        <Text style={styles.subtitle}>{localizedUiText.m_01bdb09443d2}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_e05467c8200a}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_bc3d948ff021}</Text>
            <Text style={styles.value}>{data.shiftGracePeriodMinutes}{" " + localizedUiText.m_90e63d85fa1a}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_af96e0697342}</Text>
            <Text style={styles.value}>{data.lateMarkingThresholdMinutes}{" " + localizedUiText.m_90e63d85fa1a}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_a173e14cde3e}</Text>
            <Text style={styles.value}>{data.missingCheckoutWindowHours}{" " + localizedUiText.m_404314b1f4bd}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_41613d974189}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_9c341f845eff}</Text>
            <Text style={styles.value}>{data.autoDuplicateWindowMinutes}{" " + localizedUiText.m_90e63d85fa1a}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_ed157e6ba9c8}</Text>
            <Text style={styles.value}>{data.correctionApprovalRequired ? localizedUiText.m_85a39ab345d6 : localizedUiText.m_1ea442a134b2}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_53f952134768}</Text>
            <Text style={styles.value}>{data.correctionApprovalRoles.join(', ')}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_0844efd155c3}</Text>
            <Text style={styles.value}>{localizedUiText.m_8f2364e11b8b + " "}{data.vendorReportLockDayOfMonth}{" " + localizedUiText.m_24f05cf37256}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{localizedUiText.m_872c07792f19}</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_d7631fa9ec58}</Text>
            <Text style={styles.value}>{data.biometricSyncSchedule || localizedUiText.m_81c3c8199096}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{localizedUiText.m_6c5a4be839b4}</Text>
            <Text style={styles.value}>{data.dataRetentionMonths}{" " + localizedUiText.m_168374334431}</Text>
          </View>
        </View>
      </View>

      <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{localizedUiText.m_ec92e1dc9bb3}</Text>
      </Pressable>
    </ScreenContainer>);
}

