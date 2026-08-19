import { View, Text, FlatList, Pressable } from "react-native";
import { AppAlert } from "../../../ui/modal/AppAlert";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { StaffAttendanceStackParamList } from "../../../app/navigation/navigation.types";
import { useMonthlyAttendanceReport } from "../data/useMonthlyAttendanceReport";
import { LoadingState } from "../../../shared/feedback/LoadingState";
import { ErrorState } from "../../../shared/feedback/ErrorState";
import { ScreenContainer } from "../../../shared/layouts/ScreenContainer";
import { Colors } from "../../../shared/constants/colors";
import { styles } from "../styles/screens/MonthlyAttendanceReportScreen.styles";
import { useMessages as useGeneratedUiMessages } from "../../../messages/useMessages";
type Props = NativeStackScreenProps<StaffAttendanceStackParamList, 'MonthlyAttendanceReport'>;
export function MonthlyAttendanceReportScreen({ navigation }: Props) {
    const localizedUiText = useGeneratedUiMessages().uiLiterals;
    const { data, isLoading, error, refetch } = useMonthlyAttendanceReport();
    const handleExport = () => {
        AppAlert.alert(String(localizedUiText.m_5d55cdba1c77), String(localizedUiText.m_b7e4283a0850), [
            { text: String(localizedUiText.m_19766ed6ccb2), style: 'cancel' },
            { text: String(localizedUiText.m_1d393b0081b6), onPress: () => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_02146810e80d)) },
            { text: String(localizedUiText.m_0f63da2090b8), onPress: () => AppAlert.alert(String(localizedUiText.m_c88a0b907419), String(localizedUiText.m_44574545efb1)) },
        ]);
    };
    return (<ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{localizedUiText.m_fe5c7ff3ab00}</Text>
          <Pressable style={styles.exportBtn} onPress={handleExport}>
            <Ionicons name="download-outline" size={16} color={Colors.white}/>
            <Text style={styles.exportBtnText}>{localizedUiText.m_3664895579f0}</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{localizedUiText.m_343f97313f5d}</Text>
      </View>

      {isLoading ? (<LoadingState message={localizedUiText.m_e9a9a2173e99}/>) : error ? (<ErrorState message={error.message} onRetry={refetch}/>) : (<View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colHeader, styles.colName]}>{localizedUiText.m_90303ba84cf2}</Text>
            <Text style={[styles.colHeader, styles.colDays]}>{localizedUiText.m_9c4d09c16f88}</Text>
            <Text style={[styles.colHeader, styles.colDays]}>{localizedUiText.m_ef68818cc22e}</Text>
            <Text style={[styles.colHeader, styles.colDays]}>{localizedUiText.m_0f950da185fc}</Text>
            <Text style={[styles.colHeader, styles.colPct]}>%</Text>
          </View>

          <FlatList data={data} keyExtractor={item => item.staffId} renderItem={({ item }) => (<Pressable style={styles.tableRow} onPress={() => navigation.navigate('StaffAttendanceDetail', { staffId: item.staffId })}>
                <View style={styles.colName}>
                  <Text style={styles.nameText}>{item.staffName}</Text>
                  <Text style={styles.codeText}>{item.staffCode}</Text>
                </View>
                <Text style={[styles.rowText, styles.colDays]}>{item.presentDays}</Text>
                <Text style={[styles.rowText, styles.colDays, item.absentDays > 0 && styles.dangerText]}>{item.absentDays}</Text>
                <Text style={[styles.rowText, styles.colDays, item.lateDays > 0 && styles.warningText]}>{item.lateDays}</Text>
                <Text style={[styles.rowText, styles.colPct, styles.boldText]}>{item.attendancePercentage}%</Text>
              </Pressable>)} contentContainerStyle={styles.listContent}/>
        </View>)}
    </ScreenContainer>);
}

