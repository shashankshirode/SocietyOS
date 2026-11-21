import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useStaffAttendanceDetail } from "../data/useStaffAttendanceDetail";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { StatusBadge } from "../../../shared/components/StatusBadge";
import { styles } from "../styles/screens/StaffAttendanceDetailScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'StaffAttendanceDetail'>;
export function StaffAttendanceDetailScreen({ route, navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { staffId } = route.params;
    const { data, isLoading, error, refetch } = useStaffAttendanceDetail(staffId);
    if (isLoading)
        return <LoadingState message={localizedUiText.m_4e83b6068130}/>;
    if (error)
        return <ErrorState message={error.message} onRetry={refetch}/>;
    if (!data)
        return <ErrorState message={localizedUiText.m_adee0fdd972f}/>;
    const { summary, dailyRecords } = data;
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.staffName}</Text>
        <Text style={styles.subtitle}>{data.staffCode}{" " + localizedUiText.m_f2714002591f}</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_43f9b89c0b9d}</Text>
          <Text style={[styles.statVal, styles.successText]}>{summary.presentDays}{" " + localizedUiText.m_ab51004e9d71}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_84fd36f7cbff}</Text>
          <Text style={[styles.statVal, styles.dangerText]}>{summary.absentDays}{" " + localizedUiText.m_ab51004e9d71}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_0f950da185fc}</Text>
          <Text style={[styles.statVal, styles.warningText]}>{summary.lateDays}{" " + localizedUiText.m_ab51004e9d71}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{localizedUiText.m_ca2d1bfd96fd}</Text>
          <Text style={styles.statVal}>{summary.attendancePercentage}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{localizedUiText.m_fa2d7215b673}</Text>
          <Pressable style={styles.correctBtn} onPress={() => navigation.navigate('AttendanceCorrectionRequest')}>
            <Ionicons name="create-outline" size={14} color={Colors.primary}/>
            <Text style={styles.correctBtnText}>{localizedUiText.m_f44d952a1852}</Text>
          </Pressable>
        </View>

        <View style={styles.logsCard}>
          {dailyRecords.map((record, idx) => (<View key={idx} style={styles.logRow}>
              <View>
                <Text style={styles.dateText}>
                  {new Date(record.date).toLocaleDateString([], { day: '2-digit', month: 'short', weekday: 'short' })}
                </Text>
                <Text style={styles.timeText}>
                  {record.checkInTime ? `${record.checkInTime} - ${record.checkOutTime || localizedUiText.m_8af1d328d75e}` : localizedUiText.m_7d85dbb19948}
                </Text>
              </View>
              <StatusBadge status={record.status} moduleType="parking"/>
            </View>))}
        </View>
      </View>
    </ScreenContainer>);
}

